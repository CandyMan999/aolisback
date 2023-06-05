import React, { useContext, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

import Context from "./context";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state, dispatch } = useContext(Context);
  useEffect(() => {
    if (!state.currentUser) {
      dispatch({ type: "TOGGLE_LOGIN", payload: true });
    }
  }, [state.currentUser]);

  return (
    <Route
      render={(props) =>
        !state.currentUser.username ? (
          <Redirect to="/" />
        ) : (
          <Component currentUser={state.currentUser} {...props} />
        )
      }
      {...rest}
    />
  );
};

export default ProtectedRoute;
