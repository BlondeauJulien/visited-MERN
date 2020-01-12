const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password'); //we can either get only what we want woth 'name email' or discount what we don't want with -password
    } catch (err) {
        const error = new HttpError(
            'failed to get users', 
            500
        );
        return next(error);
    }
    res.json({users: users.map(u => u.toObject({ getters: true}))})
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        next(new HttpError('Invalid inputs passed, please check your data', 422));
    }
    
    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        const error = new HttpError(
            'Signing up failed', 
            500
        );
        return next(error);
    }


    if(existingUser) {
        const error = new HttpError(
            'User already exist', 
            422
        );
        return next(error);
    }
    let filePath = req.file.path.replace(/\\/g, "/");

    const createdUser = new User({
        name,
        email,
        password,
        places: [],
        image: filePath, 
    })

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('signin failed, please try again', 500);
        return next(error);
    }

    res.status(201).json({user: createdUser.toObject({ getters: true })});
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        const error = new HttpError(
            'Login up failed', 
            500
        );
        return next(error);
    }

    if(!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Invalid credential', 
            401
        );
        return next(error);
    }

    res.json({message: 'Logged in', user: existingUser.toObject({ getters: true })});
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;