import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import { ToastContainer } from "react-toastify";

import Nav from "./components/Nav";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import Login from "./pages/auth/Login";
import { AuthContext } from "./context/authContext";

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
      </Switch>
    </ApolloProvider>
  );
};

export default App;
