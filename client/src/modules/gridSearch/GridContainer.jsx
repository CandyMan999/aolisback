import React, { useContext, useEffect, useState } from "react";
import GridSearch from "./GridSearch";

import Context from "../../context";
import { Loading, Box } from "../../components";
import { useClient } from "../../client";

const GridContainer = ({}) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(false);

  //   const [coords, setCoords] = useState({
  //     lat: state.userCoords.lat ? state.userCoords.lat : 32.7767,
  //     lng: state.userCoords.lng ? state.userCoords.lng : -96.797,
  //   });

  //   useEffect(() => {
  //     fetchData();
  //     handleLocation();
  //   }, []);

  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const { getStates } = await client.request(GET_STATES, {});
  //       setStates(getStates);
  //       setLoading(false);
  //     } catch (err) {
  //       setLoading(false);
  //       console.log("err fetching states: ", err);
  //     }
  //   };

  //   const handleLocation = () => {
  //     setLoading(true);
  //     try {
  //       if ("geolocation" in navigator) {
  //         navigator.geolocation.getCurrentPosition((position) => {
  //           const { latitude, longitude } = position.coords;

  //           setCoords({ lat: latitude, lng: longitude });
  //           dispatch({
  //             type: "SET_USER_COORDS",
  //             payload: { lat: latitude, lng: longitude },
  //           });
  //         });
  //       }
  //       setLoading(false);
  //     } catch (err) {
  //       setLoading(false);
  //       console.log(err.message);
  //     }
  //   };
  return !!loading ? (
    <Box
      position="absolute"
      top="50%"
      left="50%"
      marginTop={-50}
      marginLeft={-50}
      width={100}
      height={100}
    >
      <Loading fade />
    </Box>
  ) : (
    <GridSearch
      state={state}
      client={client}
      dispatch={dispatch}
      currentUser={state.currentUser}
    />
  );
};

export default GridContainer;
