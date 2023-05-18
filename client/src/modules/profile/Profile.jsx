import React, { useContext, useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Button,
  Text,
  ICON_SIZES,
  Icon,
  PhotoSlider,
  FONT_SIZES,
} from "../../components";

import { COLORS } from "../../constants";
import { formatDistanceToNow } from "date-fns";
import moment from "moment";

import Context from "../../context";
import { useHistory } from "react-router-dom";
import { useClient } from "../../client";
import {
  VIDEO_CHAT_REQUEST,
  UNBLOCK_USER_MUTATION,
} from "../../graphql/mutations";

const Profile = ({ userClicked, mobile, currentUser }) => {
  const client = useClient();
  let history = useHistory();
  const { state, dispatch } = useContext(Context);
  const [isBlocked, setIsBlocked] = useState(false);
  let user = userClicked ? userClicked : currentUser;

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
  } = user;

  useEffect(() => {
    if (!!state.isProfile) {
      setBlocked();
    }
  }, [state.isProfile]);

  const setBlocked = () => {
    setIsBlocked(false);

    currentUser.blockedUsers.find((user) => {
      if (user._id === _id) {
        return setIsBlocked(true);
      }
    });
  };

  const toggleDrawer = () => {
    dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
  };

  const handleVideoChatRequest = async () => {
    try {
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
    } catch (err) {
      console.log(err);
    }
  };

  const handleLocation = (_id, location) => {
    const payload = { _id, location };
    dispatch({ type: "VIEW_LOCATION", payload });
    dispatch({ type: "TOGGLE_PROFILE", payload: false });
    history.push("/location");
  };

  const handleUnBlock = async () => {
    try {
      const variables = {
        userID: currentUser._id,
        blockID: _id,
      };

      const { unBlock } = await client.request(
        UNBLOCK_USER_MUTATION,
        variables
      );
      dispatch({ type: "UPDATE_BLOCKED", payload: unBlock.blockedUsers });
      setIsBlocked(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Drawer onClose={toggleDrawer} isOpen={state.isProfile}>
      <Box width={"100%"} style={{ borderBottom: "solid 1px black" }}>
        <PhotoSlider
          withDelete={_id && _id === state.currentUser._id ? true : false}
          images={pictures}
          height={310}
          width={200}
        />
      </Box>
      <Box display="flex" width="100%" justifyContent="space-between">
        <Box paddingLeft={"5%"} display="flex" column>
          <Text
            margin={2}
            bold
            fontSize={mobile ? FONT_SIZES.X_LARGE : FONT_SIZES.XX_LARGE}
          >
            {username}
          </Text>
          <Text margin={2}>
            {sex} {age}
          </Text>
        </Box>
        <Box display="flex" column paddingRight="5%">
          <Box>
            <Icon
              name="brokenHeart"
              color={COLORS.red}
              size={ICON_SIZES.XX_LARGE}
            />
            <Text marginBottom={0} bold>
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
          <Text bold>Occupation: </Text>
          <Icon name="job" color={COLORS.black} size={ICON_SIZES.XX_LARGE} />
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
          <Text bold>Drink: </Text>
          <Icon name="beer" color={COLORS.black} size={ICON_SIZES.XX_LARGE} />
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
          <Text bold>Smoke: </Text>
          <Icon
            name="smoke"
            color={COLORS.textRed}
            size={ICON_SIZES.XX_LARGE}
          />
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
          <Text bold>Marijuana: </Text>
          <Icon name="weed" color={COLORS.green} size={ICON_SIZES.X_LARGE} />
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
          <Text bold>Drugs: </Text>
          <Icon name="drugs" color={COLORS.green} size={ICON_SIZES.XX_LARGE} />
        </Box>

        {drugs && <Text>{drugs}</Text>}
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
          <Text bold>Kids: </Text>
          <Icon name="kid" color={COLORS.black} size={ICON_SIZES.XX_LARGE} />
        </Box>

        {kids && <Text>{kids}</Text>}
      </Box>

      <Box justifyContent="center" width={"100%"}>
        <Button
          style={{ margin: 0 }}
          onClick={isBlocked ? handleUnBlock : handleVideoChatRequest}
          disabled={
            (!isLoggedIn && !isBlocked) ||
            (user._id === state.currentUser._id && !isBlocked)
          }
          color={
            (!isLoggedIn && !isBlocked) ||
            (user._id === state.currentUser._id && !isBlocked)
              ? COLORS.lightGrey
              : COLORS.red
          }
          width="100%"
        >
          <Text margin={0} bold>
            {isBlocked ? `UnBlock  ${username}` : `Video Chat with ${username}`}
          </Text>
        </Button>
        <Button
          style={{ margin: 0 }}
          disabled={location && !location.lat}
          onClick={() => handleLocation(_id, location)}
          color={
            location && !location.lat ? COLORS.lightGrey : COLORS.vividBlue
          }
          width="100%"
        >
          <Text margin={0} bold>
            View Location
          </Text>
        </Button>
      </Box>
    </Drawer>
  );
};

export default Profile;
