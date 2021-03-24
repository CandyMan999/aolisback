import React, { Fragment } from "react";

import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Navbar from "./modules/navbar";
import HomeContainer from "./modules/home";
import CreateProfile from "./modules/createProfile";
import { Video, Map } from "./components";

import "./App.css";

const App = () => {
  return (
    <Fragment>
      <Navbar />
      <Switch>
        <Route exact path="/" component={HomeContainer} />
        <ProtectedRoute path="/profile" component={CreateProfile} />
        <ProtectedRoute path="/video" component={Video} />
        <ProtectedRoute path="/location" component={Map} />
      </Switch>
    </Fragment>
  );
};

export default App;
