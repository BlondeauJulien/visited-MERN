import React from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';

const DUMMY_PLACES = [
	{
		id: 'p1',
		title: 'Empire State Building',
		description: 'One of the most famous sky scrapers in the world!',
		imageUrl: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/71/33/e6.jpg',
		address: '20 W 34th St, New York, NT, 10001',
		location: {
			lat: 40.7484405,
			lng: -73.9878584
		},
		creator: 'u1'
	},
	{
		id: 'p2',
		title: 'Empire State Building',
		description: 'One of the most famous sky scrapers in the world!',
		imageUrl:
			'https://www.voyageway.com/wp-content/uploads/2018/04/empire-state-building-ou-top-of-the-rock-740x447.jpg',
		address: '20 W 34th St, New York, NT, 10001',
		location: {
			lat: 40.7484405,
			lng: -73.9878584
		},
		creator: 'u2'
	}
];

const UpdatePlace = () => {
	const placeId = useParams().placeId;

	const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

	const [formState, inputHandler] = useForm(
		{
			title: {
				value: identifiedPlace.title,
				isValid: true
			},
			description: {
				value: identifiedPlace.description,
				isValid: true
			}
		},
		true
	)

	const placeUpdateSubmitHandler = e => {
		e.preventDefault();
		console.log(formState.inputs);
	}

	if (!identifiedPlace) {
		return (
			<div className="center">
				<h2>Could not find place!</h2>
			</div>
		);
	}
    
	return (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input 
                id="title" 
                element="input" 
                type="text" 
                label="Title" 
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title"
                onInput={inputHandler}
                initialValue={formState.inputs.title.value}
				initialValid={formState.inputs.title.isValid}
            />
            <Input 
                id="description" 
                element="textarea" 
                label="Description" 
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (min. 5 characters)."
                onInput={inputHandler}
                initialValue={formState.inputs.description.value}
				initialValid={formState.inputs.description.isValid}
            />
            <Button 
                type="submit"
                disabled={!formState.isValid}
            >
                UPDATE PLACE
            </Button>
        </form>
    );
};

export default UpdatePlace;
