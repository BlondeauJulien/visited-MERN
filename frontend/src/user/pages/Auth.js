import React, { Fragment, useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { useForm } from '../../shared/hooks/form-hook';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
	const auth = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const [ formState, inputHandler, setFormData ] = useForm(
		{
			email: {
				value: '',
				isValid: false
			},
			password: {
				value: '',
				isValid: false
			}
		},
		false
	);
	
	const switchModelHandler = () => {
		if(!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					name: undefined
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
						value: '',
						isValid: false
					}
				},
				false
			);
		}


		setIsLoginMode(prevMode => !prevMode);
	}
    
    const authSubmitHandler = async e => {
		e.preventDefault();
		
		if(isLoginMode) {

		} else {
			try {
				setIsLoading(true);
				//Note this wont failt if the response is an error so we will gave to handle that
				const response = await fetch('http://localhost:5000/api/users/signup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						name : formState.inputs.name.value,
						email: formState.inputs.email.value,
						password: formState.inputs.password.value
					})
				});

				const responseData = await response.json();

				if(!response.ok) {
					//It's a property from the response object from fetch
					// it will be falsy for any 400 or 500 code response
					throw new Error(responseData.message); // all of our error response got a message
				}

				console.log(responseData);
				setIsLoading(false);
				auth.login();
			} catch (err) {
				setIsLoading(false);
				setError(err.message || 'Something went wrong, please try again.');
			}
		}
	}
	
	const errorHandler = () => {
		setError(null);
	}

	return (
		<Fragment>
			<ErrorModal error={error} onClear={errorHandler}/>
			<Card className='authentication'>
				{isLoading && <LoadingSpinner asOverlay/>}
				<h2>Login Required</h2>
				<hr />
				<form onSubmit={authSubmitHandler}>
					{!isLoginMode && (
						<Input
							element="input"
							id="name"
							type="text"
							label="Your Name"
							validators={[VALIDATOR_REQUIRE()]}
							errorText="Please enter a name."
							onInput={inputHandler}
						/>
					)}
					<Input
						id="email"
						element="input"
						type="email"
						label="E-mail"
						validators={[ VALIDATOR_EMAIL() ]}
						errorText="Please enter a valid email address"
						onInput={inputHandler}
						initialValue={formState.inputs.email.value}
						initialValid={formState.inputs.email.isValid}
					/>
					<Input
						id="password"
						element="input"
						type="password"
						label="Password"
						validators={[ VALIDATOR_MINLENGTH(5) ]}
						errorText="Please enter a valid password, at least 5 characters."
						onInput={inputHandler}
						initialValue={formState.inputs.password.value}
						initialValid={formState.inputs.password.isValid} 
					/>
					<Button type="submit" disabled={!formState.isValid}>
						{isLoginMode ? 'LOGIN' : 'SIGNUP'}
					</Button>
				</form>
				<Button inverse onClick={switchModelHandler}>
					SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
				</Button>
			</Card>
		</Fragment>
	);
};

export default Auth;
