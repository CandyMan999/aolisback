import React, { Fragment, useContext, useEffect } from "react";
import {
  Drawer,
  Box,
  Button,
  Text,
  ICON_SIZES,
  Icon,
  PhotoSlider,
} from "../../components";

import { COLORS } from "../../constants";
import { formatDistanceToNow } from "date-fns";
import moment from "moment";

import { useClient } from "../../client";
import Context from "../../context";
import { useHistory } from "react-router-dom";

const Profile = ({ userClicked }) => {
  //eventually userClicked will be whole object
  const client = useClient();
  let history = useHistory();
  const { state, dispatch } = useContext(Context);

  const {
    username,
    sobrietyTime,
    intro,
    sex,
    age,
    kids,
    location,
    occupation,
    sponsor,
    sponsee,
    pictures,
    _id,
  } = userClicked;

  const toggleDrawer = () => {
    dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
  };

  const handleVideo = () => {
    dispatch({ type: "JOIN_CHANNEL", payload: username });
    dispatch({ type: "TOGGLE_PROFILE", payload: false });
    history.push("/video");
  };

  const handleLocation = (_id, location) => {
    const payload = { _id, location };
    dispatch({ type: "VIEW_LOCATION", payload });
    dispatch({ type: "TOGGLE_PROFILE", payload: false });
    history.push("/location");
  };

  return (
    <Drawer
      onClose={toggleDrawer}
      isOpen={state.isProfile}
      title={
        <span style={{ color: COLORS.vividBlue }}>{username}'s Profile</span>
      }
    >
      <Box display="flex" column paddingLeft={20} paddingRight={20}>
        <Box justifyContent={"center"}>
          <PhotoSlider
            withDelete={_id && _id === state.currentUser._id ? true : false}
            images={pictures}
            height={310}
            width={200}
          />
        </Box>
        <Box justifyContent="center">
          {sobrietyTime && (
            <Box position="absolute" left={0}>
              <Icon
                name="beer"
                color={COLORS.vividBlue}
                size={ICON_SIZES.XX_LARGE}
              />
            </Box>
          )}

          {sobrietyTime && (
            <Text
              style={{
                borderBottom: "solid 2px white",
                paddingBottom: "4px",
              }}
              center
              margin={0}
            >
              <span style={{ color: COLORS.white }}>SoberSince:</span>{" "}
              <span style={{ color: COLORS.themeGreen }}>
                {moment(Number(sobrietyTime)).format("MM-DD-YYYY")}{" "}
              </span>
              <Text margin={1} center color={COLORS.vividBlue}>
                ({formatDistanceToNow(Number(sobrietyTime)).toUpperCase()})
              </Text>
            </Text>
          )}
        </Box>

        {intro && (
          <Text
            style={{ borderBottom: "solid 2px white", paddingBottom: "4px" }}
            margin={0}
            color={COLORS.white}
          >
            {" "}
            INTRO: <span style={{ color: COLORS.themeGreen }}>{intro}</span>
          </Text>
        )}
        {sex && (
          <Text
            style={{ borderBottom: "solid 2px white", paddingBottom: "4px" }}
            margin={0}
            color={COLORS.white}
          >
            {" "}
            Gender: <span style={{ color: COLORS.themeGreen }}>{sex}</span>
          </Text>
        )}
        {age && (
          <Text
            style={{ borderBottom: "solid 2px white", paddingBottom: "4px" }}
            margin={0}
            color={COLORS.white}
          >
            {" "}
            Age: <span style={{ color: COLORS.themeGreen }}>{age}</span>
          </Text>
        )}
        <Text
          style={{ borderBottom: "solid 2px white", paddingBottom: "4px" }}
          margin={0}
          color={COLORS.white}
        >
          {" "}
          Kids:{" "}
          <span style={{ color: COLORS.themeGreen }}>
            {kids ? "Yes" : "No"}
          </span>
        </Text>
        {occupation && (
          <Text
            style={{ borderBottom: "solid 2px white", paddingBottom: "4px" }}
            margin={0}
            color={COLORS.white}
          >
            {" "}
            Occupation:{" "}
            <span style={{ color: COLORS.themeGreen }}>{occupation}</span>
          </Text>
        )}
        <Text
          style={{ borderBottom: "solid 2px white", paddingBottom: "4px" }}
          margin={0}
          color={COLORS.white}
        >
          {" "}
          I am willing to sponsor:{" "}
          <span style={{ color: COLORS.themeGreen }}>
            {sponsor ? "Yes" : "No"}
          </span>
        </Text>
        <Text
          style={{ borderBottom: "solid 2px white", paddingBottom: "4px" }}
          margin={0}
          color={COLORS.white}
        >
          {" "}
          I am looking for a sponsor:{" "}
          <span style={{ color: COLORS.themeGreen }}>
            {sponsee ? "Yes" : "No"}
          </span>
        </Text>
        <Box justifyContent="center">
          <Button onClick={handleVideo} color="red" width="fit-content">
            <span>Join {username}'s Video Channel</span>
          </Button>
        </Box>
        <Box justifyContent="center">
          <Button
            disabled={location && !location.lat}
            onClick={() => handleLocation(_id, location)}
            color={
              location && !location.lat ? COLORS.lightGrey : COLORS.vividBlue
            }
            width="fit-content"
          >
            <span>View Location</span>
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Profile;
