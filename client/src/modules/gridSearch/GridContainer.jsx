import React, { useContext, useEffect, useState } from "react";
import GridSearch from "./GridSearch";

import Context from "../../context";
import {
  GET_ALL_USERS,
  GET_LIKED_USERS_QUERY,
  GET_USERS_WHO_LIKE_ME_QUERY,
  GET_MATCHED_USERS_QUERY,
} from "../../graphql/queries";
import { Loading, Box, ButtonsWithShuffle } from "../../components";
import { useClient } from "../../client";
import { getDistanceFromCoords } from "../../utils/helpers";

const GridContainer = () => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const { currentUser } = state;
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("Browse");

  useEffect(() => {
    if (!!currentUser.username) {
      fetchData();
    }
  }, [currentUser.username]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const variables = {
        latitude: currentUser.location.coordinates[1],
        longitude: currentUser.location.coordinates[0],
      };
      const { getAllUsers } = await client.request(GET_ALL_USERS, variables);

      const filteredUsers = await getAllUsers.filter(
        (user) => user.username !== state.currentUser.username
      );
      const filteredAndSorted = await sortByDistance(filteredUsers);

      setUsers(filteredAndSorted);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("err fetching users: ", err);
    }
  };

  const handleGetLikedUsers = async () => {
    try {
      setLoading(true);
      const variables = {
        userID: currentUser._id,
      };
      const { getLikedUsers } = await client.request(
        GET_LIKED_USERS_QUERY,
        variables
      );

      const sortedUsers = await sortByDistance(getLikedUsers);

      setUsers(sortedUsers);
      setLoading(false);
    } catch (err) {
      console.log("error getting liked users: ", err);
    }
  };

  const handleGetUsersWhoLikeMe = async () => {
    try {
      setLoading(true);
      const variables = {
        userID: currentUser._id,
      };
      const { getUsersWhoLikedMe } = await client.request(
        GET_USERS_WHO_LIKE_ME_QUERY,
        variables
      );

      const sortedUsers = await sortByDistance(getUsersWhoLikedMe);

      setUsers(sortedUsers);
      setLoading(false);
    } catch (err) {
      console.log("error getting liked users: ", err);
    }
  };

  const handleGetMatchedUsers = async () => {
    try {
      setLoading(true);
      const variables = {
        userID: currentUser._id,
      };
      const { getMatchedUsers } = await client.request(
        GET_MATCHED_USERS_QUERY,
        variables
      );

      const sortedUsers = await sortByDistance(getMatchedUsers);

      setUsers(sortedUsers);
      setLoading(false);
    } catch (err) {
      console.log("error getting liked users: ", err);
    }
  };

  const sortByDistance = (array) => {
    const newArray = array
      .map((user) => ({
        ...user,
        distanceAway:
          user.location.coordinates[0] === 0 &&
          user.location.coordinates[1] === 0
            ? 300000
            : Math.abs(
                Math.round(
                  getDistanceFromCoords(
                    currentUser.location.coordinates[1],
                    currentUser.location.coordinates[0],
                    user.location.coordinates[1],
                    user.location.coordinates[0]
                  )
                )
              ),
      }))
      .sort((a, b) => a.distanceAway - b.distanceAway);

    return newArray;
  };

  return (
    <Box width="100vw" height="100vh" column>
      <ButtonsWithShuffle
        handleGetLikedUsers={handleGetLikedUsers}
        handleGetUsersWhoLikeMe={handleGetUsersWhoLikeMe}
        handleGetAllUsers={fetchData}
        handleGetMatchedUsers={handleGetMatchedUsers}
        currentUser={currentUser}
        loading={loading}
        setSearch={setSearch}
      />

      {loading ? (
        <Box height="50%">
          <Loading fade size={200} />
        </Box>
      ) : (
        <GridSearch
          state={state}
          client={client}
          dispatch={dispatch}
          currentUser={state.currentUser}
          users={users}
          search={search}
        />
      )}
    </Box>
  );
};

export default GridContainer;
