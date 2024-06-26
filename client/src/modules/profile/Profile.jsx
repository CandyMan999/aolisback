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
} from "../../components";

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
} from "../../graphql/mutations";

const Profile = ({ userClicked, mobile, currentUser }) => {
  const client = useClient();
  let history = useHistory();
  const { pathname } = useLocation();
  const { state, dispatch } = useContext(Context);
  const [imBlocked, setImBlocked] = useState(false);
  const [userBlocked, setUserBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
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
  } = user;

  useEffect(() => {
    if (!!state.isProfile) {
      handleImBlocked();
      handleUserBlocked();
    }
  }, [state.isProfile]);

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

  const callOnFaceTime = (contact) => {
    const facetimeUrl = `facetime://${contact}`;
    window.location.href = facetimeUrl;
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
  };

  const handleVideoChatRequest = async () => {
    try {
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
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
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
      dispatch({ type: "TOGGLE_PROFILE", payload: false });
      toggleModal();
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

  return (
    <Fragment>
      <Drawer onClose={toggleDrawer} isOpen={state.isProfile}>
        <Box width={"100%"} style={{ borderBottom: "solid 1px black" }}>
          <PhotoSlider
            withDelete={_id && _id === state.currentUser._id ? true : false}
            images={pictures}
            height={310}
            width={200}
          />
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
            <Box paddingLeft={"5%"} display="flex" column paddingTop={8}>
              <Text
                margin={2}
                bold
                fontSize={mobile ? FONT_SIZES.X_LARGE : FONT_SIZES.XX_LARGE}
              >
                {username}
              </Text>
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
            paddingLeft="5%"
            paddingRight="5%"
          >
            <Box>
              <Icon
                name="beer"
                color={COLORS.pink}
                size={ICON_SIZES.XX_LARGE}
              />
              <Text bold>Drink: </Text>
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
            <Box>
              <Icon
                name="smoke"
                color={COLORS.pink}
                size={ICON_SIZES.XX_LARGE}
              />
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
                border: `solid 2px ${COLORS.pink}`,
                borderRadius: 20,
              }}
              onClick={
                userBlocked
                  ? handleUnBlock
                  : imBlocked
                  ? undefined
                  : !isLoggedIn
                  ? handleSendVideoMessage
                  : handleVideoChatRequest
              }
              disabled={
                (imBlocked && !userBlocked) ||
                loading ||
                state.showChatRequest ||
                itsMe
              }
              color={
                (imBlocked && !userBlocked) || state.showChatRequest || itsMe
                  ? COLORS.lightGrey
                  : COLORS.deepPurple
              }
              width="100%"
            >
              {loading ? (
                <Loading bar />
              ) : (
                <Text margin={0} bold>
                  {itsMe
                    ? `Send Video Message`
                    : userBlocked
                    ? `UnBlock  ${username}`
                    : imBlocked
                    ? `You're Blocked`
                    : !isLoggedIn
                    ? `Send Video Message`
                    : `Video Chat with ${username}`}
                </Text>
              )}
            </Button>
            <Button
              style={{
                margin: 0,
                border: `solid 2px ${COLORS.pink}`,
                borderRadius: 20,
              }}
              disabled={location && noLocation(location.coordinates)}
              onClick={() => handleLocation(_id, location)}
              coolStyle
              color={
                location && noLocation(location.coordinates)
                  ? COLORS.lightGrey
                  : COLORS.vividBlue
              }
              width="100%"
            >
              <Text margin={0} bold>
                View Location
              </Text>
            </Button>
          </Box>
        </Box>
      </Drawer>
      {state.showVideo && pathname !== "/message" && (
        <VideoModal
          onClose={toggleModal}
          receiverID={_id}
          senderID={currentUser._id}
          state={state}
          mobile={mobile}
        />
      )}
    </Fragment>
  );
};

export default Profile;
