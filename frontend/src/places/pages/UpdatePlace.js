import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
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
	const [isLoading, setIsLoading] = useState(true);
	const placeId = useParams().placeId;

	const [ formState, inputHandler, setFormData ] = useForm(
		{
			title: {
				value: '',
				isValid: false
			},
			description: {
				value: '',
				isValid: false
			}
		},
		false
	);

	const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

	useEffect(
		() => {
			if(identifiedPlace) {
				setFormData({
					title: {
						value: identifiedPlace.title,
						isValid: true
					},
					description: {
						value: identifiedPlace.description,
						isValid: true
					}
				});
				setIsLoading(false);
			}
		},
		[ setFormData, identifiedPlace ]
	);

	const placeUpdateSubmitHandler = (e) => {
		e.preventDefault();
		console.log(formState.inputs);
	};

	if (!identifiedPlace) {
		return (
			<div className="center">
				<Card>
					<h2>Could not find place!</h2>
				</Card>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="center">
				<h2>Loading</h2>
			</div>
		);
	}

	return (
		formState.inputs.title.value && (
			<form className="place-form" onSubmit={placeUpdateSubmitHandler}>
				<Input
					id="title"
					element="input"
					type="text"
					label="Title"
					validators={[ VALIDATOR_REQUIRE() ]}
					errorText="Please enter a valid title"
					onInput={inputHandler}
					initialValue={formState.inputs.title.value}
					initialValid={formState.inputs.title.isValid}
				/>
				<Input
					id="description"
					element="textarea"
					label="Description"
					validators={[ VALIDATOR_MINLENGTH(5) ]}
					errorText="Please enter a valid description (min. 5 characters)."
					onInput={inputHandler}
					initialValue={formState.inputs.description.value}
					initialValid={formState.inputs.description.isValid}
				/>
				<Button type="submit" disabled={!formState.isValid}>
					UPDATE PLACE
				</Button>
			</form>
		)
	);
};

export default UpdatePlace;
