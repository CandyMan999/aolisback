import React, { Fragment } from "react";

import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Navbar from "./modules/navbar";
import HomeContainer from "./modules/home";
import CreateProfile from "./modules/createProfile";

import "./App.css";

const App = () => {
  return (
    <Fragment>
      <Navbar />
      <Switch>
        <Route exact path="/" component={HomeContainer} />
        <ProtectedRoute path="/profile" component={CreateProfile} />
      </Switch>
    </Fragment>
  );
};

export default App;
