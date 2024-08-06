import React, { Fragment } from "react";

import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Navbar from "./modules/navbar";
import HomeContainer from "./modules/home";
import CreateProfile from "./modules/createProfile";
import GridSearch from "./modules/gridSearch";
import MessageCenter from "./modules/messageCenter";
import Message from "./modules/Message";
import AdminPage from "./modules/admin";
import { Map, FloatingHeart } from "./components";

import "./App.css";

class App extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Navbar props={this.props} />
        <Switch>
          <Route exact path="/" component={HomeContainer} />
          <ProtectedRoute exact path="/profile" component={CreateProfile} />

          <ProtectedRoute props={this.props} path="/location" component={Map} />
          <Route path="/message-center" component={MessageCenter} />
          <Route path="/message" component={Message} />
          <Route path="/grid-search" component={GridSearch} />
          <ProtectedRoute exact path="/admin" component={AdminPage} />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
