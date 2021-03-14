import React, { Fragment } from "react";

import { Route } from "react-router-dom";
import { withRouter } from "react-router";

import Navbar from "./modules/navbar";
import HomeContainer from "./modules/home";

import "./App.css";

const App = () => {
  return (
    <Fragment>
      <Navbar />
      <HomeContainer />
    </Fragment>
  );
};

export default withRouter(App);
