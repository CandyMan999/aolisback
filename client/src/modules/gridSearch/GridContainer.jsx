import React, { useContext, useEffect, useState } from "react";
import GridSearch from "./GridSearch";

import Context from "../../context";
import { GET_ALL_USERS } from "../../graphql/queries";
import { Loading, Box } from "../../components";
import { useClient } from "../../client";

const GridContainer = () => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { getAllUsers } = await client.request(GET_ALL_USERS, {});
      setUsers(getAllUsers);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("err fetching states: ", err);
    }
  };

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
      users={users}
    />
  );
};

export default GridContainer;
