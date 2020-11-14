import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import { ToastContainer } from "react-toastify";

import { AuthContext } from "./context/authContext";

import Nav from "./components/Nav";
import Home from "./pages/Home";
import PrivateRouter from "./components/PrivateRoute";

import CompleteRegistration from "./pages/auth/CompleteRegistration";
import Login from "./pages/auth/Login";
import PasswordUpdate from "./pages/auth/PasswordUpdate";
import Post from "./pages/auth/Post";
import Profile from "./pages/auth/Profile";
import Register from "./pages/auth/Register";

const App = () => {
	const { state } = useContext(AuthContext);
	const { user } = state;

	const client = new ApolloClient({
		uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
		headers: {
			authorization: user ? user.token : "",
		},
		cache: new InMemoryCache(),
	});

	return (
		<ApolloProvider client={client}>
			<Nav />
			<ToastContainer />
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/register" component={Register} />
				<Route exact path="/login" component={Login} />
				<Route
					exact
					path="/complete-registration"
					component={CompleteRegistration}
				/>

				<PrivateRouter
					exact
					path="/profile"
					component={Profile} />
				<PrivateRouter
					exact
					path="/password/update"
					component={PasswordUpdate} />
				<PrivateRouter
					exact
					path="/post/create"
					component={Post} />
			</Switch>
		</ApolloProvider>
	);
};

export default App;
