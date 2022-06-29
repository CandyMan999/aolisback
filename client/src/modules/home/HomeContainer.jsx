import React, { Children, useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";

import HomeLayout from "./HomeLayout";
import Context from "../../context";

const HomeContainer = ({ queryParams, history }) => {
  const { dispatch } = useContext(Context);

  useEffect(() => {
    handleLocation();
  }, []);

  const handleLocation = () => {
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;

          dispatch({
            type: "SET_USER_COORDS",
            payload: { lat: latitude, lng: longitude },
          });
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return <HomeLayout>{Children}</HomeLayout>;
};

export default withRouter(HomeContainer);
