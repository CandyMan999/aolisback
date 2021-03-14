import React, { Children } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import HomeLayout from "./HomeLayout";
import ChatBox from "../chatBox";

const HomeContainer = ({ queryParams, history }) => {
  return <HomeLayout>{Children}</HomeLayout>;
};

export default withRouter(HomeContainer);
