import React, { useState, useEffect } from "react";
import {
  CollapsableHeader,
  Box,
  Button,
  Icon,
  Text,
  Loading,
  Map,
  ICON_SIZES,
} from "../../../components";
import { COLORS } from "../../../constants";
import { useLocation } from "react-router-dom";

import { UPDATE_LOCATION_MUTATION } from "../../../graphql/mutations";

const GetLocation = ({
  dispatch,
  client,
  currentUser,
  total,
  completed,
  mobile,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });
  const [spinner, setSpinner] = useState(false);
  const location = useLocation();
  const [locationSuccess, setLocationSuccess] = useState(false);

  useEffect(() => {
    if (userCoords.lat) {
      handleGetLocation();
      dispatch({
        type: "VIEW_LOCATION",
        payload: {
          _id: currentUser._id,
          lat: userCoords.lat,
          lng: userCoords.lng,
        },
      });
    }
  }, [userCoords.lat]);

  useEffect(() => {
    if (currentUser.username) {
      setLocationSuccess(!noLocation(currentUser.location.coordinates));
    }
  }, [currentUser.username]);

  const handleGetLocation = async () => {
    try {
      setSpinner(true);
      setSubmitted(false);
      const variables = {
        latitude: userCoords.lat ? userCoords.lat : currentUser.location.lat,
        longitude: userCoords.lng ? userCoords.lng : currentUser.location.lng,
        _id: currentUser._id,
      };

      const { updateLocation } = await client.request(
        UPDATE_LOCATION_MUTATION,
        variables
      );

      if (updateLocation) {
        dispatch({
          type: "UPDATE_LOCATION",
          payload: updateLocation.coordinates,
        });
        setSpinner(false);
        // setTimeout(() => {
        //   setSubmitted(true);
        // }, 2000);

        setLocationSuccess(true);
      }
      if (!updateLocation) {
        setLocationSuccess(false);
        setSpinner(false);
      }
    } catch (err) {
      setSpinner(false);
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

  const handleLocation = () => {
    try {
      setSpinner(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
        });
      }
    } catch (err) {
      setSpinner(false);
      console.log(err);
    }
  };

  return (
    <CollapsableHeader
      title={"Get Location"}
      // onClose={submitted}
      total={total}
      completed={completed}
    >
      <Box width={"100%"} height={"100%"} column alignItems="center">
        <Map
          currentUser={currentUser}
          width={mobile ? "100vw" : "80%"}
          height={400}
          location={location}
        />

        <Box padding={10}>
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
              borderRadius: "10px",
            }}
            color={COLORS.black}
            onClick={handleLocation}
            width="fit-content"
          >
            {spinner ? (
              <Loading bar color={COLORS.vividBlue} />
            ) : !currentUser.location.lat ? (
              <Text bold>Get Location</Text>
            ) : (
              <Text bold>Update Location</Text>
            )}
            <Icon name="pin" color={COLORS.red} style={{ padding: "0px" }} />
          </Button>
          {locationSuccess && (
            <Box alignItems="center">
              <Icon
                name="thumbsUp"
                color={COLORS.green}
                size={ICON_SIZES.XX_LARGE}
              />
            </Box>
          )}
          {!locationSuccess && (
            <Box alignItems="center">
              <Icon
                name="thumbsDown"
                color={COLORS.textRed}
                size={ICON_SIZES.XX_LARGE}
              />
              <Text>Where are you?</Text>
            </Box>
          )}
        </Box>
      </Box>
    </CollapsableHeader>
  );
};

export default GetLocation;
