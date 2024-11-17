import React, { Children, useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";

import HomeLayout from "./HomeLayout";
import Context from "../../context";

const HomeContainer = ({ queryParams, history }) => {
  const { dispatch, state } = useContext(Context);

  useEffect(() => {
    // handleLocation();
  }, []);

  return (
    <HomeLayout state={state} dispatch={dispatch}>
      {Children}
    </HomeLayout>
  );
};

export default withRouter(HomeContainer);
