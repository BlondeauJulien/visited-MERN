import React, { useCallback, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';

const App = () => {
	const [token, setToken] = useState(null);
	const [userId, setUserId] = useState(false);

	const login = useCallback(
		(uid, token) => {
			setToken(token);
			localStorage.setItem('userData', JSON.stringify({
				userId: uid,
				token
			}))
			setUserId(uid);
		},
		[]
	);

	const logout = useCallback(
		() => {
			setToken(null);
			setUserId(null);
			localStorage.removeItem('userData');
		},
		[]
	);

	useEffect(() => {
		//useEffect always run after the component render cycle
		let storedData = JSON.parse(localStorage.getItem('userData'));
		if(storedData && storedData.token) {
			login(storedData.userId, storedData.token);
		}
	}, [login]);

	let routes;

	if(token) {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Users />
				</Route>
				<Route path="/:userId/places" exact>
					<UserPlaces />
				</Route>
				<Route path="/places/new" exact>
					<NewPlace />
				</Route>
				<Route path="/places/:placeId">
					<UpdatePlace />
				</Route>
				<Redirect to="/" />
			</Switch>
		);
	} else {
		routes =  (
			<Switch>
				<Route path="/" exact>
					<Users />
				</Route>
				<Route path="/:userId/places" exact>
					<UserPlaces />
				</Route>
				<Route path="/auth" exact>
					<Auth />
				</Route>
				<Redirect to="/auth" />
			</Switch>
		);
	}

	return (
		<AuthContext.Provider value={{
			isLoggedIn: !!token,
			token,
			login, 
			logout, 
			userId
		}}>
			<Router>
				<MainNavigation />
				<main>
					{routes}
				</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;
