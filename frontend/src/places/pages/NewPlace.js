import React, { useContext, Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useHttpClient } from '../../shared/hooks/http-hook'
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';

const NewPlace = () => {
    const authContext = useContext(AuthContext)
    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
         value: '',
         isValid: false
         },
         address: {
             value: '',
             isValid: false
         },
    }, 
    false)

    const {isLoading, error, clearError, sendRequest} = useHttpClient();

    const history = useHistory()

    const placeAddHandler = async e => {
        e.preventDefault();

        try {
            await sendRequest(
                'http://localhost:5000/api/places',
                'POST',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    address: formState.inputs.address.value,
                    creator: authContext.userId
                }),
                {
                    'Content-Type': 'application/json'
                }
            )
            history.push('/');
        } catch (err) {

        }


    }

    return (
        <Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className='place-form' onSubmit={placeAddHandler}>
              {  isLoading && <LoadingSpinner asOverlay/>}
                <Input 
                    id="title"
                    element="input" 
                    type="text" 
                    label="Title" 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />
                <Input 
                    id="description"
                    element="textarea" 
                    label="Description" 
                    validators={[VALIDATOR_MINLENGTH(5)]} 
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />
                <Input 
                    id="address"
                    element="input" 
                    label="Address" 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />
                <Button type="submit" disabled={!formState.isValid} >
                    ADD PLACE
                </Button>
            </form>
        </Fragment>
    )
}

export default NewPlace
