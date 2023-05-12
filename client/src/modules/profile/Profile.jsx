import React, { useContext } from "react";
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

const Profile = ({ userClicked, mobile }) => {
  //eventually userClicked will be whole object

  let history = useHistory();
  const { state, dispatch } = useContext(Context);
  let user = userClicked ? userClicked : state.currentUser;

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

  const toggleDrawer = () => {
    dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
  };

  console.log("PROFILE: ", user);

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
          onClick={handleVideo}
          disabled={!isLoggedIn}
          color={!isLoggedIn ? COLORS.lightGrey : COLORS.red}
          width="100%"
        >
          <Text bold>{username}'s Video Channel</Text>
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
          <Text bold>View Location</Text>
        </Button>
      </Box>
    </Drawer>
  );
};

export default Profile;
