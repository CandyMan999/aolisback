import React, { Fragment } from "react";

import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Navbar from "./modules/navbar";
import HomeContainer from "./modules/home";
import CreateProfile from "./modules/createProfile";
import GridSearch from "./modules/gridSearch";
import { Video, Map } from "./components";

import "./App.css";

class App extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Navbar props={this.props} />
        <Switch>
          <Route exact path="/" component={HomeContainer} />
          <ProtectedRoute path="/profile" component={CreateProfile} />
          <ProtectedRoute path="/video" component={Video} />
          <ProtectedRoute path="/location" component={Map} />
          <Route path="/grid-search" component={GridSearch} />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
