// SwipeDeck.js

import React, { useState, useMemo, useRef, useEffect } from "react";
import SwipeableProfileCard from "./swipeable-profile-card";
import {
  Box,
  Button,
  Icon,
  Text,
  ICON_SIZES,
  FONT_SIZES,
  Picture,
  MatchScreen,
} from "../../../components";
import { MdVideoChat } from "react-icons/md";
import { COLORS } from "../../../constants";
import { motion, useAnimation } from "framer-motion";

import { GiCheckeredFlag } from "react-icons/gi";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useHistory, useLocation } from "react-router-dom";
import { useClient } from "../../../client";
import { LIKE_MUTATION, VIDEO_CHAT_REQUEST } from "../../../graphql/mutations";

const SwipeDeck = ({
  users,
  currentUser,
  state,
  fetchData,
  loading,
  dispatch,
  endOfUsers,
  setUsers,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const client = useClient();
  let history = useHistory();
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const acceptButtonControls = useAnimation();
  const nextUserButtonControls = useAnimation();

  const location = useLocation();
  const currentIndexRef = useRef(currentIndex);
  const isOutOfLikes =
    currentUser.plan.likes + currentUser.plan.additionalLikes <=
    currentUser.plan.likesSent;

  const mobile = useMediaQuery("(max-width: 800px)");

  const currentUserOnTop = users[currentIndex];

  const childRefs = useMemo(
    () =>
      Array(users.length)
        .fill(0)
        .map(() => React.createRef()),
    [users.length]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  useEffect(() => {
    if (noLocation(currentUser.location.coordinates)) {
      alert("To find nearby users please enable your location via settings!");
    }
  }, []);

  const noLocation = (array) => {
    if (
      Array.isArray(array) &&
      array.length === 2 &&
      array[0] === 0 &&
      array[1] === 0
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (currentIndex === users?.length) {
      fetchData(true);
    }
  }, [currentIndex]);

  const handleSwipe = (direction, user, index) => {
    if (direction === "right") {
      handleLikeUser(user._id);

      // Trigger scale animation for onAccept button
      acceptButtonControls
        .start({
          scale: 1.3,
          transition: { duration: 0.2 },
        })
        .then(() => {
          // Return to original scale
          acceptButtonControls.start({
            scale: 1,
            transition: { duration: 0.2 },
          });
        });
    } else if (direction === "left") {
      // Trigger scale animation for onNextUser button
      nextUserButtonControls
        .start({
          scale: 1.3,
          transition: { duration: 0.2 },
        })
        .then(() => {
          // Return to original scale
          nextUserButtonControls.start({
            scale: 1,
            transition: { duration: 0.2 },
          });
        });
    }

    if (direction === "right") {
      handleLikeUser(user._id);
    }
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
  };

  const onAccept = () => {
    try {
      if (isOutOfLikes) {
        window.ReactNativeWebView.postMessage("BUY_LIKES");
        return;
      }

      if (currentIndex < users.length && childRefs[currentIndex].current) {
        childRefs[currentIndex].current.swipe("right");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onNextUser = () => {
    if (currentIndex < users.length && childRefs[currentIndex].current) {
      childRefs[currentIndex].current.swipe("left");
    }
  };

  const handleLikeUser = async (_id) => {
    try {
      if (
        currentUser.plan.likes + currentUser.plan.additionalLikes <=
        currentUser.plan.likesSent
      ) {
        window.ReactNativeWebView.postMessage("BUY_LIKES");

        return;
      }

      const variables = {
        userID: currentUser._id,
        likeID: _id,
      };
      const {
        like: { user, isMatch, matchID },
      } = await client.request(LIKE_MUTATION, variables);

      dispatch({ type: "UPDATE_LIKED_USERS", payload: user });

      if (isMatch) {
        const found = users.find((user) => user._id === matchID);

        setMatchedUser(found);
        setMatchModalVisible(true);
      }
    } catch (err) {
      console.log("error liking user: ", err);
    }
  };

  const handleSendVideoMessage = () => {
    const currentUserOnTop = users[currentIndex];
    try {
      // if (
      //   currentUser.plan.messages + currentUser.plan.additionalMessages <=
      //   currentUser.plan.messagesSent
      // ) {
      //   window.ReactNativeWebView.postMessage("BUY_MESSAGES");

      //   return;
      // }
      dispatch({ type: "TOGGLE_PROFILE", payload: false });

      if (mobile) {
        const receiverID = currentUserOnTop._id;
        const senderID = currentUser._id;
        const params = new URLSearchParams(location.search);
        params.set("senderID", senderID);
        params.set("receiverID", receiverID);
        params.set("videoMessage", true);

        const data = {
          senderID,
          receiverID,
          videoMessage: true,
        };

        // Navigate to the constructed URL
        history.replace({
          pathname: location.pathname,
          search: params.toString(),
        });
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        } else {
          console.warn("ReactNativeWebView is not available.");
        }
      } else {
        dispatch({ type: "TOGGLE_VIDEO", payload: !state.showVideo });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImBlocked = () => {
    try {
      let blocked = false;

      currentUserOnTop?.blockedUsers.find((user) => {
        if (user._id === currentUser._id) {
          blocked = true;
        }
      });
      return blocked;
    } catch (err) {
      console.log(err);
    }
  };

  const handleVideoChatRequest = async () => {
    const currentUserOnTop = users[currentIndex];
    try {
      // if (
      //   currentUser.plan.videoMinutes + currentUser.plan.additionalMinutes <=
      //   currentUser.plan.videoMinutesUsed
      // ) {
      //   window.ReactNativeWebView.postMessage("BUY_MINUTES");

      //   return;
      // }

      const variables = {
        senderID: state.currentUser._id,
        receiverID: currentUserOnTop._id,
        status: "Pending",
      };

      const { videoChatRequest } = await client.request(
        VIDEO_CHAT_REQUEST,
        variables
      );

      dispatch({ type: "TOGGLE_PROFILE", payload: false });
      dispatch({ type: "TOGGLE_CHAT", payload: true });
    } catch (err) {
      console.log(err);
    }
  };

  const USERS = users.map((user, index) => ({ ...user, index })).reverse();

  return (
    <Box
      width="100%"
      column
      style={{ overflowX: "hidden", overflowY: "hidden", paddingTop: 20 }}
    >
      <Box
        className="cardContainer"
        style={{
          width: "100vw",
          height: `calc(100vh - 100px)`,
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {loading && currentIndex >= users.length && !endOfUsers && (
          <Box
            column
            alignItems="center"
            height="100%"
            justifyContent="center"
            position="absolute"
          >
            <Picture
              profilePic={
                currentUser && currentUser.pictures?.length
                  ? currentUser.pictures[0]
                  : undefined
              }
              searching={true}
              height={120}
              width={120}
            />
            <Text bold>Searching For Users...</Text>
          </Box>
        )}

        {endOfUsers && (
          <Box
            as={motion.div}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            column
            alignItems="center"
            height="90%"
            justifyContent="center"
            position="absolute"
            style={{ padding: "20px" }}
          >
            <GiCheckeredFlag size={100} color={COLORS.vividBlue} />
            <Text
              as={motion.h2}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              bold
              fontSize={FONT_SIZES.LARGE}
              color={COLORS.black}
              style={{ marginTop: 20 }}
            >
              You've reached the end!
            </Text>
            <Text
              as={motion.p}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              fontSize={FONT_SIZES.MEDIUM}
              color={COLORS.grey}
              style={{ marginTop: 10, textAlign: "center", maxWidth: "300px" }}
            >
              Come back later for more awesome people to meet.
            </Text>
            <Button
              as={motion.button}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              onClick={() => {
                setUsers([]);
                setCurrentIndex(0);
                fetchData(false);
              }}
              color={COLORS.vividBlue}
              style={{ marginTop: 30 }}
            >
              Refresh
            </Button>
          </Box>
        )}

        {USERS.map((user, index) => {
          const topCard = users[currentIndex]?.username === user?.username;

          const rotation = getRotation();
          return (
            <SwipeableProfileCard
              key={user._id}
              ref={childRefs[users.length - 1 - index]}
              user={user}
              currentUser={currentUser}
              state={state}
              dispatch={dispatch}
              rotation={topCard ? 0 : rotation}
              onSwipe={(dir) => handleSwipe(dir, user, index)}
              //   onCardLeftScreen={() => handleCardLeftScreen(user, index)}
              onAccept={onAccept}
              onNextUser={onNextUser}
              preventSwipe={
                isOutOfLikes ? ["right", "up", "down"] : ["up", "down"]
              }
            />
          );
        })}
      </Box>

      {/* Buttons outside of the card component */}
      <Box
        width="100%"
        position="absolute"
        style={{
          zIndex: 200,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          bottom: 20,
        }}
      >
        <Button
          as={motion.button} // Enable motion capabilities
          animate={nextUserButtonControls}
          width={"80px"}
          height={"80px"}
          color={COLORS.red}
          style={{
            borderRadius: "50%",
            boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
          }}
          onClick={onNextUser}
        >
          <Icon name="close" color={COLORS.white} size={ICON_SIZES.XXX_LARGE} />
        </Button>

        <Button
          width={"80px"}
          height={"80px"}
          color={handleImBlocked() ? COLORS.lightGrey : COLORS.white}
          style={{
            borderRadius: "50%",
            boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
          }}
          disabled={handleImBlocked()}
          onClick={
            handleImBlocked()
              ? null
              : !currentUserOnTop?.isLoggedIn || currentUserOnTop?.inCall
              ? handleSendVideoMessage
              : handleVideoChatRequest
          }
        >
          <MdVideoChat size={60} color={COLORS.vividBlue} />
        </Button>

        <Button
          as={motion.button} // Enable motion capabilities
          animate={acceptButtonControls}
          width={"80px"}
          height={"80px"}
          color={COLORS.green}
          style={{
            borderRadius: "50%",
            boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
          }}
          onClick={onAccept}
        >
          <Text
            color={COLORS.black}
            margin={0}
            bold
            fontSize={FONT_SIZES.XXX_LARGE}
          >
            ❤️
          </Text>
        </Button>
      </Box>

      <MatchScreen
        matchedUser={matchedUser}
        currentUser={currentUser}
        showScreen={matchModalVisible}
        onClose={() => {
          setMatchModalVisible(false);
          setMatchedUser(null);
        }}
      />
    </Box>
  );
};

const getRotation = () => {
  const rotations = [0, -1, 1, -2, 2, -4, 4, 0];
  return rotations[Math.floor(Math.random() * rotations.length)];
};

export default SwipeDeck;