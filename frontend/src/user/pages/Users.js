import React, { useEffect, useState, Fragment } from 'react'

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
    const [loadedUsers, setLoadedUsers] = useState();
    const { isLoading, error, clearError, sendRequest} = useHttpClient();

    useEffect(() => {
      /*   //technically we could turn useEffect into an async func but it's really bad code
        // instead best practice is to use an ifee
        const sendRequest = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('http://localhost:5000/api/users');
                const responseData = await response.json();

                if(!response.ok) {
					throw new Error(responseData.message); 
				}
    
                setLoadedUsers(responseData.users);
            } catch (err) {
                setError(err.message || 'Something went wrong, please try again.');
            }
            setIsLoading(false);
        }
        sendRequest(); */

        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest('http://localhost:5000/api/users');
                setLoadedUsers(responseData.users);
            } catch (err) {

            }
        };
        fetchUsers();

    }, [sendRequest])
    return (
        <Fragment>
			<ErrorModal error={error} onClear={clearError}/>
            {isLoading && (
                <div className="center">
                    <LoadingSpinner/>
                </div>
            )}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers}/>}
        </Fragment>
    )
}

export default Users
