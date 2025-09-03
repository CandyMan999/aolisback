import React, { useContext, useState, useEffect, Fragment } from "react";
import {
  Drawer,
  Box,
  Button,
  Text,
  ICON_SIZES,
  Icon,
  PhotoSlider,
  FONT_SIZES,
  Loading,
  OnlineDot,
  FloatingHeart,
  LikeButton,
  UnlikeButton,
} from "../../components";
import { track } from "@vercel/analytics";

import { COLORS } from "../../constants";
import { formatDistanceToNow } from "date-fns";
import moment from "moment";
import VideoModal from "../../modules/gridSearch/video-modal";

import Context from "../../context";
import { useHistory, useLocation } from "react-router-dom";
import { useClient } from "../../client";
import {
  VIDEO_CHAT_REQUEST,
  UNBLOCK_USER_MUTATION,
  LIKE_MUTATION,
  UNLIKE_MUTATION,
} from "../../graphql/mutations";
import { IS_LIKED_QUERY } from "../../graphql/queries";

const Profile = ({ userClicked, mobile, currentUser }) => {
  const client = useClient();
  let history = useHistory();
  const { pathname } = useLocation();
  const { state, dispatch } = useContext(Context);
  const [imBlocked, setImBlocked] = useState(false);
  const [userBlocked, setUserBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [match, setMatch] = useState(false);

  let user = userClicked ? userClicked : currentUser;
  const itsMe = userClicked._id === currentUser._id;

  const {
    username,
    singleTime,
    intro,
    sex,
    age,
    kids,
    location,
    occupation,
    marijuana,
    drink,
    smoke,
    drugs,
    pictures,
    _id,
    isLoggedIn,
    lookingFor,
    inCall,
  } = user;

  useEffect(() => {
    if (!!state.isProfile) {
      handleImBlocked();
      handleUserBlocked();
      handleShowHearts();
    }
  }, [state.isProfile]);

  const handleShowHearts = () => {
    try {
      client
        .request(IS_LIKED_QUERY, {
          userID: currentUser._id,
          otherID: _id,
        })
        .then(({ isLiked }) => setShowHearts(isLiked))
        .catch((err) => console.log("error filtering likes: ", err));
    } catch (err) {
      console.log("error filtering likes: ", err);
    }
  };

  const handleImBlocked = () => {
    try {
      setImBlocked(false);

      user.blockedUsers.find((user) => {
        if (user._id === currentUser._id) {
          return setImBlocked(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserBlocked = () => {
    try {
      setUserBlocked(false);

      currentUser.blockedUsers.find((user) => {
        if (user._id === _id) {
          return setUserBlocked(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const toggleDrawer = () => {
    dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
    if (!state.isProfile) {
      setShowHearts(false);
    }
  };

  const handleVideoChatRequest = async () => {
    try {
      if (
        currentUser.plan.videoMinutes + currentUser.plan.additionalMinutes <=
        currentUser.plan.videoMinutesUsed
      ) {
        window.ReactNativeWebView.postMessage("BUY_MINUTES");

        return;
      }

      track("Video_Call", {
        sender: state.currentUser.username,
        reciever: _id,
      });

      setLoading(true);
      const variables = {
        senderID: state.currentUser._id,
        receiverID: _id,
        status: "Pending",
      };

      const { videoChatRequest } = await client.request(
        VIDEO_CHAT_REQUEST,
        variables
      );

      dispatch({ type: "TOGGLE_PROFILE", payload: false });
      dispatch({ type: "TOGGLE_CHAT", payload: true });
      setShowHearts(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      // Track the error for debugging in production
      track("Video_Call_Error", {
        sender: state.currentUser.username,
        receiver: _id,
        error: err.message,
      });
    }
  };

  const handleLocation = (_id, location) => {
    try {
      dispatch({
        type: "VIEW_LOCATION",
        payload: {
          _id,
          lat: location.coordinates[1],
          lng: location.coordinates[0],
        },
      });
      dispatch({ type: "TOGGLE_PROFILE", payload: false });
      setShowHearts(false);
      history.push("/location");
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnBlock = async () => {
    try {
      setLoading(true);
      const variables = {
        userID: currentUser._id,
        blockID: _id,
      };

      const { unBlock } = await client.request(
        UNBLOCK_USER_MUTATION,
        variables
      );

      dispatch({ type: "UPDATE_BLOCKED", payload: unBlock.blockedUsers });
      setUserBlocked(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const toggleModal = () => {
    dispatch({ type: "TOGGLE_VIDEO", payload: !state.showVideo });
  };

  const handleSendVideoMessage = () => {
    try {
      if (
        currentUser.plan.messages + currentUser.plan.additionalMessages <=
        currentUser.plan.messagesSent
      ) {
        window.ReactNativeWebView.postMessage("BUY_MESSAGES");

        return;
      }

      dispatch({ type: "TOGGLE_PROFILE", payload: false });
      setShowHearts(false);
      if (mobile) {
        const receiverID = _id;
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

  const handleLikeUser = async () => {
    try {
      if (
        currentUser.plan.likes + currentUser.plan.additionalLikes <=
        currentUser.plan.likesSent
      ) {
        window.ReactNativeWebView.postMessage("BUY_LIKES");
        return;
      }
      setLoading(true);
      const variables = {
        userID: currentUser._id,
        likeID: _id,
      };
      const {
        like: { user, isMatch },
      } = await client.request(LIKE_MUTATION, variables);

      dispatch({ type: "UPDATE_LIKED_USERS", payload: user });
      setShowHearts(true);
      setMatch(isMatch);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("error liking user: ", err);
    }
  };
  const handleUnLikeUser = async () => {
    try {
      setLoading(true);
      const variables = {
        userID: currentUser._id,
        unLikeID: _id,
      };
      const { unLike } = await client.request(UNLIKE_MUTATION, variables);

      dispatch({ type: "UPDATE_LIKED_USERS", payload: unLike });
      setShowHearts(false);
      setMatch(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("error liking user: ", err);
    }
  };

  return (
    <Fragment>
      <Drawer onClose={toggleDrawer} isOpen={state.isProfile}>
        {inCall && (
          <Box width={"100%"} justifyContent="center" background={COLORS.black}>
            <OnlineDot inCall={inCall} />
          </Box>
        )}

        <Box width={"100%"}>
          <PhotoSlider
            withDelete={_id && _id === state.currentUser._id ? true : false}
            images={pictures}
            height={310}
            width={200}
          />
          {!itsMe &&
            (!showHearts ? (
              <UnlikeButton
                disabled={loading}
                onClick={handleLikeUser}
                loading={loading}
              />
            ) : (
              <LikeButton
                disabled={loading}
                onClick={handleUnLikeUser}
                loading={loading}
              />
            ))}
          {showHearts && (
            <FloatingHeart
              activate={showHearts}
              isMatch={match}
            />
          )}
        </Box>
        <Box
          display="flex"
          column
          width="100%"
          height="100%"
          minHeight="60vh"
          justifyContent="space-between"
        >
          <Box display="flex" width="100%" justifyContent="space-between">
            <Box paddingLeft={"5%"} display="flex" paddingTop={8} column>
              <Box
                display="flex"
                style={{ flexWrap: "nowrap", width: "max-content" }}
              >
                <Text
                  margin={2}
                  bold
                  fontSize={mobile ? FONT_SIZES.X_LARGE : FONT_SIZES.XX_LARGE}
                >
                  {username}
                </Text>
              </Box>

              <Text margin={2}>
                {sex === "Gender_Diverse" ? "Gender Diverse" : sex} {age}
              </Text>
            </Box>
            <Box display="flex" column paddingRight="5%">
              <Box>
                <Icon
                  name="brokenHeart"
                  color={COLORS.red}
                  size={ICON_SIZES.XX_LARGE}
                />
                <Text marginBottom={0} bold noWrap>
                  Single Since:
                </Text>
              </Box>
              <Box display="flex" justifyContent="flex-end">
                {singleTime && (
                  <Text
                    style={{
                      marginTop: "0px",
                      paddingBottom: "4px",
                    }}
                    center
                    margin={0}
                  >
                    <Text bold margin={0}>
                      {moment(Number(singleTime)).format("MM-DD-YYYY")}{" "}
                    </Text>
                    <Text margin={1} center color={COLORS.red}>
                      ({formatDistanceToNow(Number(singleTime)).toUpperCase()})
                    </Text>
                  </Text>
                )}
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            width="auto"
            justifyContent="space-between"
            height={"fit-content"}
            paddingY={5}
            paddingLeft="5%"
            paddingRight="5%"
            style={{
              borderBottom: `solid 2px ${COLORS.lighterGrey}`,
              paddingBottom: "6px",
            }}
          >
            {intro && <Text margin={0}>{intro}</Text>}
          </Box>
          <Box
            display="flex"
            width="auto"
            justifyContent="space-between"
            style={{
              borderBottom: `solid 2px ${COLORS.lighterGrey}`,
              paddingBottom: "4px",
            }}
            paddingY={5}
            paddingLeft="5%"
            paddingRight="5%"
          >
            <Box>
              <Icon name="job" color={COLORS.pink} size={ICON_SIZES.XX_LARGE} />
              <Text bold>Occupation: </Text>
            </Box>

            {occupation && <Text>{occupation}</Text>}
          </Box>
          <Box
            display="flex"
            width="auto"
            justifyContent="space-between"
            style={{
              borderBottom: `solid 2px ${COLORS.lighterGrey}`,
              paddingBottom: "4px",
            }}
            paddingY={5}
            paddingLeft="6%"
            paddingRight="5%"
          >
            <Box flex style={{ alignItems: "center" }}>
              {/* <Icon
                name="beer"
                color={COLORS.pink}
                size={ICON_SIZES.XX_LARGE}
              /> */}
              <Box paddingLeft={"5%"} marginRight={13}>
                <Text
                  style={{ paddingRight: 2, margin: 0 }}
                  fontSize={FONT_SIZES.X_LARGE}
                >
                  🥃
                </Text>
              </Box>
              <Text bold> Drink: </Text>
            </Box>

            {drink && <Text>{drink}</Text>}
          </Box>
          <Box
            display="flex"
            width="auto"
            justifyContent="space-between"
            style={{
              borderBottom: `solid 2px ${COLORS.lighterGrey}`,
              paddingBottom: "4px",
            }}
            paddingY={5}
            paddingLeft="5%"
            paddingRight="5%"
          >
            {/* <Box>
              <Icon
                name="smoke"
                color={COLORS.pink}
                size={ICON_SIZES.XX_LARGE}
              /> */}
            <Box flex style={{ alignItems: "center" }}>
              {/* <Icon
                name="beer"
                color={COLORS.pink}
                size={ICON_SIZES.XX_LARGE}
              /> */}
              <Box paddingLeft={"5%"} marginRight={13}>
                <Text style={{ paddingRight: 0, margin: 0, fontSize: 25 }}>
                  🚬
                </Text>
              </Box>
              <Text bold>Smoke: </Text>
            </Box>

            {smoke && <Text>{smoke}</Text>}
          </Box>
          <Box
            display="flex"
            width="auto"
            justifyContent="space-between"
            style={{
              borderBottom: `solid 2px ${COLORS.lighterGrey}`,
              paddingBottom: "4px",
            }}
            paddingY={5}
            paddingLeft="5%"
            paddingRight="5%"
          >
            <Box>
              <Icon name="weed" color={COLORS.pink} size={ICON_SIZES.X_LARGE} />
              <Text bold>Marijuana Tolerance: </Text>
            </Box>

            {marijuana && <Text>{marijuana}</Text>}
          </Box>
          <Box
            display="flex"
            width="auto"
            justifyContent="space-between"
            style={{
              borderBottom: `solid 2px ${COLORS.lighterGrey}`,
              paddingBottom: "4px",
            }}
            paddingY={5}
            paddingLeft="5%"
            paddingRight="5%"
          >
            <Box>
              <Icon
                name="drugs"
                color={COLORS.pink}
                size={ICON_SIZES.XX_LARGE}
              />
              <Text bold>Drug Use: </Text>
            </Box>

            {drugs && <Text>{drugs}</Text>}
          </Box>
          <Box
            display="flex"
            width="auto"
            justifyContent="space-between"
            style={{
              borderBottom:
                !!lookingFor && !!lookingFor.sex
                  ? `solid 2px ${COLORS.lighterGrey}`
                  : undefined,
              paddingBottom: "4px",
            }}
            paddingY={5}
            paddingLeft="5%"
            paddingRight="5%"
          >
            <Box>
              <Icon name="kid" color={COLORS.pink} size={ICON_SIZES.XX_LARGE} />
              <Text bold>Kids: </Text>
            </Box>

            {kids && <Text>{kids}</Text>}
          </Box>
          {!!lookingFor && !!lookingFor.sex && (
            <Box
              display="flex"
              width="auto"
              justifyContent="space-between"
              style={{
                // borderBottom: `solid 2px ${COLORS.lighterGrey}`,
                paddingBottom: "4px",
              }}
              paddingY={5}
              paddingLeft="5%"
              paddingRight="5%"
            >
              <Box>
                <Icon
                  name="curious"
                  color={COLORS.pink}
                  size={ICON_SIZES.XX_LARGE}
                />
                <Box position="absolute" top={0} left={37}>
                  💍
                </Box>

                <Text bold>Looking For: </Text>
              </Box>

              <Text>
                {lookingFor.sex === "Female"
                  ? "Women"
                  : lookingFor.sex === "Male"
                  ? "Men"
                  : lookingFor.sex === "Gender_Diverse"
                  ? "Gender Diverse"
                  : "Gender Diverse"}
              </Text>
            </Box>
          )}

          <Box justifyContent="center" width={"100%"} minHeight={60}>
            <Button
              style={{
                margin: 0,
                border: `solid 2px ${
                  itsMe || userBlocked || imBlocked || loading
                    ? COLORS.grey
                    : COLORS.pink
                }`,
                borderRadius: 10,
              }}
              onClick={
                userBlocked
                  ? handleUnBlock
                  : imBlocked
                  ? undefined
                  : !isLoggedIn || inCall
                  ? handleSendVideoMessage
                  : handleVideoChatRequest
              }
              disabled={(imBlocked && !userBlocked) || loading || itsMe}
              color={
                (imBlocked && !userBlocked) || itsMe
                  ? COLORS.lightGrey
                  : COLORS.lightPurple
              }
              width="100%"
            >
              {loading ? (
                <Loading bar />
              ) : (
                <Text
                  margin={0}
                  bold
                  color={
                    itsMe || userBlocked || imBlocked
                      ? COLORS.white
                      : COLORS.deepPurple
                  }
                >
                  {itsMe
                    ? `Send Video Message`
                    : userBlocked
                    ? `UnBlock  ${username}`
                    : imBlocked
                    ? `You're Blocked`
                    : !isLoggedIn || inCall
                    ? `Send Video Message`
                    : `Video Call ${username}`}
                </Text>
              )}
            </Button>
            <Button
              style={{
                margin: 0,
                border: `solid 2px ${
                  (location && noLocation(location.coordinates)) ||
                  (location && !location.showOnMap)
                    ? COLORS.grey
                    : COLORS.pink
                }`,
                borderRadius: 10,
              }}
              disabled={
                (location && noLocation(location.coordinates)) ||
                (location && !location.showOnMap)
              }
              onClick={() => handleLocation(_id, location)}
              coolStyle
              color={
                (location && noLocation(location.coordinates)) ||
                (location && !location.showOnMap)
                  ? COLORS.lightGrey
                  : COLORS.lightPurple
              }
              width="100%"
            >
              <Text
                margin={0}
                bold
                color={
                  (location && noLocation(location.coordinates)) ||
                  (location && !location.showOnMap)
                    ? COLORS.white
                    : COLORS.deepPurple
                }
              >
                View Location
              </Text>
            </Button>
          </Box>
        </Box>
      </Drawer>
      {state.showVideo && pathname !== "/message" && (
        <VideoModal
          onClose={toggleModal}
          closeModal={() => dispatch({ type: "TOGGLE_VIDEO", payload: false })}
          receiverID={_id}
          senderID={currentUser._id}
          state={state}
        />
      )}
    </Fragment>
  );
};

export default Profile;
