import React, { useContext, useEffect, useState } from "react";
import GridSearch from "./GridSearch";

import Context from "../../context";
import { GET_ALL_USERS } from "../../graphql/queries";
import { Loading, Box } from "../../components";
import { useClient } from "../../client";
import { getDistanceFromCoords } from "../../utils/helpers";

const GridContainer = () => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const { currentUser } = state;
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!!currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { getAllUsers } = await client.request(GET_ALL_USERS);

      const filteredUsers = await getAllUsers.filter(
        (user) => user.username !== state.currentUser.username
      );
      const filteredAndSorted = await sortByDistance(filteredUsers);

      setUsers(filteredAndSorted);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("err fetching states: ", err);
    }
  };

  const sortByDistance = (array) => {
    const newArray = array

      .map((user) => ({
        ...user,

        distanceAway: Math.abs(
          Math.round(
            getDistanceFromCoords(
              currentUser.location.lat,
              currentUser.location.lng,
              user.location.lat,
              user.location.lng
            )
          )
        ),
      }))
      .sort((a, b) => a.distanceAway - b.distanceAway);

    return newArray;
  };

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
