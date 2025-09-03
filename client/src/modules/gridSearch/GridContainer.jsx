import React, { useContext, useEffect, useState, useMemo } from "react";
import GridSearch from "./GridSearch";
import SwipeDeck from "./swipe-deck";
import Context from "../../context";
import {
  GET_ALL_USERS,
  GET_LIKED_USERS_QUERY,
  GET_USERS_WHO_LIKE_ME_QUERY,
  GET_MATCHED_USERS_QUERY,
} from "../../graphql/queries";
import { Loading, Box, LikeAndMatchButtons } from "../../components";
import { useClient } from "../../client";
import { getDistanceFromCoords } from "../../utils/helpers";

const GridContainer = () => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const { currentUser } = state;
  const [loading, setLoading] = useState(false);
  // const [viewMode, setViewMode] = useState("swipe"); // 'swipe' or 'grid'
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("Browse");
  const [usersWhoLikeMeCount, setUsersWhoLikeMeCount] = useState(0);
  const [skip, setSkip] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [endOfUsers, setEndOfUsers] = useState(false);

  useEffect(() => {
    if (currentUser.username) {
      fetchUsersWhoLikeMeCount();
    }
    if (!users.length) {
      fetchData(false);
    }
  }, []);

  const fetchData = async (paginate) => {
    if (!paginate) {
      setEndOfUsers(false);
    }

    if (skip === 0 || search !== "Browse") {
      setLoading(true);
    }
    setSpinner(true);
    try {
      const variables = {
        latitude: currentUser.location.coordinates[1],
        longitude: currentUser.location.coordinates[0],
        limit: 10,
        skip: paginate ? skip : 0,
      };

      const { getAllUsers } = await client.request(GET_ALL_USERS, variables);

      if (!getAllUsers.length) {
        setEndOfUsers(true);
      }

      const filteredUsers = getAllUsers.filter(
        (user) => user.username !== state.currentUser.username
      );
      const filteredAndSorted = sortByDistance(filteredUsers);

      if (paginate) {
        if (getAllUsers.length) {
          setUsers((prevUsers) => [...prevUsers, ...filteredAndSorted]);
          setSkip((prevSkip) => prevSkip + getAllUsers.length);
        }
      } else {
        setUsers(filteredAndSorted);
        setSkip(getAllUsers.length);
      }

      setLoading(false);
      setSpinner(false);
    } catch (err) {
      setLoading(false);
      console.log("err fetching users: ", err);
    }
  };

  const fetchUsersWhoLikeMeCount = async () => {
    try {
      const variables = {
        userID: currentUser._id,
      };
      const { getUsersWhoLikedMe } = await client.request(
        GET_USERS_WHO_LIKE_ME_QUERY,
        variables
      );

      setUsersWhoLikeMeCount(getUsersWhoLikedMe.length);
    } catch (err) {
      console.log("error getting users who like me count: ", err);
    }
  };

  const handleGetLikedUsers = async (paginate) => {
    try {
      setLoading(true);
      const variables = {
        userID: currentUser._id,
        limit: 10,
        skip: paginate ? skip : 0,
      };
      const { getLikedUsers } = await client.request(
        GET_LIKED_USERS_QUERY,
        variables
      );

      const sortedUsers = sortByDistance(getLikedUsers);

      if (paginate) {
        setUsers((prev) => [...prev, ...sortedUsers]);
        setSkip((prev) => prev + 10);
      } else {
        setUsers(sortedUsers);
        setSkip(10);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("error getting liked users: ", err);
    }
  };

  const handleGetUsersWhoLikeMe = async (paginate) => {
    try {
      setLoading(true);
      const variables = {
        userID: currentUser._id,
        limit: 10,
        skip: paginate ? skip : 0,
      };
      const { getUsersWhoLikedMe } = await client.request(
        GET_USERS_WHO_LIKE_ME_QUERY,
        variables
      );

      const sortedUsers = sortByDistance(getUsersWhoLikedMe);

      if (paginate) {
        setUsers((prev) => [...prev, ...sortedUsers]);
        setSkip((prev) => prev + 10);
      } else {
        setUsers(sortedUsers);
        setSkip(10);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("error getting liked users: ", err);
    }
  };

  const handleGetMatchedUsers = async (paginate) => {
    try {
      setLoading(true);
      const variables = {
        userID: currentUser._id,
        limit: 10,
        skip: paginate ? skip : 0,
      };
      const { getMatchedUsers } = await client.request(
        GET_MATCHED_USERS_QUERY,
        variables
      );

      const sortedUsers = sortByDistance(getMatchedUsers);

      if (paginate) {
        setUsers((prev) => [...prev, ...sortedUsers]);
        setSkip((prev) => prev + 10);
      } else {
        setUsers(sortedUsers);
        setSkip(10);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("error getting matched users: ", err);
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

  // const returnToSwiping = async () =>{
  //   try{
  //     setUsers([]);
  //     setEndOfUsers(false);

  //     fetchData(false);
  //   }catch(err){
  //     console.log("error reseting swipedeck: ", err)
  //   }
  // }

  const fetchMore = async () => {
    if (search === "Browse") {
      await fetchData(true);
    } else if (search === "My Likes") {
      await handleGetLikedUsers(true);
    } else if (search === "Likes Me") {
      await handleGetUsersWhoLikeMe(true);
    } else if (search === "Matches") {
      await handleGetMatchedUsers(true);
    }
  };

  const usersMemo = useMemo(() => users, [users]);

  return (
    <Box paddingTop={60} width="100vw" height={`calc(100vh - 60px)`} column>
      <LikeAndMatchButtons
        handleGetLikedUsers={handleGetLikedUsers}
        handleGetUsersWhoLikeMe={handleGetUsersWhoLikeMe}
        handleGetAllUsers={() => fetchData(false)}
        handleGetMatchedUsers={handleGetMatchedUsers}
        currentUser={currentUser}
        loading={loading}
        setSkip={setSkip}
        setSearch={setSearch}
        usersWhoLikeMeCount={usersWhoLikeMeCount}
        dispatch={dispatch}
        // setViewMode={setViewMode}
      />

      {(loading && !users.length) ||
      (loading && skip === 0) ||
      (!users.length && state.viewMode === "swipe") ? (
        <Box height="50%">
          <Loading fade size={200} />
        </Box>
      ) : state.viewMode === "swipe" ? (
        <SwipeDeck
          users={users}
          currentUser={currentUser}
          state={state}
          dispatch={dispatch}
          fetchData={fetchMore}
          loading={spinner}
          endOfUsers={endOfUsers}
          setUsers={setUsers}
          setEndOfUsers={setEndOfUsers}
        />
      ) : (
        <GridSearch
          state={state}
          client={client}
          dispatch={dispatch}
          currentUser={currentUser}
          users={usersMemo}
          search={search}
          fetchData={fetchMore}
          skip={skip}
          spinner={spinner}
        />
      )}
    </Box>
  );
};

export default GridContainer;
