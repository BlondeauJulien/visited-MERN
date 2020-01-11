const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            'Could not find a place for the provided id.', 
            500);
        return next(error);
    }


    if(!place) {
        // when throw an error we don't need to return because it stops the execution of the code but with next() we need to because it doesn't stop and we continue to the rest of the code if we don't use return next();
        const error = new HttpError('Could not find a place for the provided id.', 404);
        return next(error);
    }

    res.json({ place: place.toObject( {getters: true } ) });
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userWithPlaces ;
    try {
        userWithPlaces = await User.findById(userId).populate('places');
    } catch (err) {
        const error = new HttpError(
            'Could not find places for the provided user.', 
            500);
        return next(error);
    }


    if(!userWithPlaces || userWithPlaces.places.length === 0) {
        return next(new HttpError('Could not find places for the user provided.', 404));
    }

    res.json({ places: userWithPlaces.places.map(place => place.toObject({getters: true })) });
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const { 
        title,
        description,
        address,
        creator
    } = req.body;

    let coordinates
    try{
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/71/33/e6.jpg',
        creator
    });

    let user;

    try {
        user = await User.findById(creator);

    } catch (err) {
        const error = new HttpError('Creating place failed, please try again', 500);
        return next(error);
    }

    if(!user) {
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }

    try {
        // session don't work with local db but should be used otherwie
        //const sess = await mongoose.startSession();
        //sess.startTransaction();
        await createdPlace.save(/* { session: sess } */);
        console.log("here")
        //This is not a standard push. This is a special push created by mongoose
        user.places.push(createdPlace);
        await user.save(/* { session: sess } */);
        //SO only once the session is commited, all these files will be saved in DB. If there is an error before it cancel the changes
        //await sess.commitTransaction(); 

    } catch (err) {
        const error = new HttpError('Creating place failed, please try again', 500);
        return next(error);
    }

    res.status(201).json({place: createdPlace});
}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const {
        title,
        description
    } = req.body;
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong and we couldnt update, please try again', 
            500);
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong and we couldnt update, please try again', 
            500);
        return next(error);
    }

    res.status(200).json({place: place.toObject({ getters: true})});

}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try{
        // populate search for where the place is used (here search user creator): to do so we need a relation between the models
        place = await Place.findById(placeId).populate('creator')
    } catch (err) {
        const error = new HttpError('Couldnt delete, please try again', 500);
        return next(error);
    }

    if(!place) {
        const error = new HttpError('Couldnt find a place for this id, please try again', 404);
        return next(error);
    }

    try{
        //const sess = await mongoose.startSession();
        //sess.startTransaction();
        await place.deleteOne(/* { session: sess } */);
        place.creator.places.pull(place);
        await place.creator.save(/* { session: sess } */);
        //await sess.commitTransaction(); 
    } catch (err) {
        const error = new HttpError('Couldnt delete, please try again', 500);
        return next(error);
    }

    res.status(200).json({message: `Delete successful`});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
