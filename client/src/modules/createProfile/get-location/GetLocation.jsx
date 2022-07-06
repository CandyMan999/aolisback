import React, { useState, useEffect } from "react";
import {
  CollapsableHeader,
  Box,
  Button,
  Icon,
  Text,
  Loading,
} from "../../../components";
import { COLORS } from "../../../constants";

import { UPDATE_LOCATION_MUTATION } from "../../../graphql/mutations";

const GetLocation = ({ dispatch, client, currentUser }) => {
  const [submitted, setSubmitted] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });
  const [spinner, setSpinner] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(
    !!currentUser.location.lat
  );

  useEffect(() => {
    if (userCoords.lat) {
      handleGetLocation();
    }
  }, [userCoords.lat]);

  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = async () => {
    try {
      setSpinner(true);
      const variables = {
        lat: userCoords.lat ? userCoords.lat : currentUser.location.lat,
        lng: userCoords.lng ? userCoords.lng : currentUser.location.lng,
        _id: currentUser._id,
      };

      const { updateLocation } = await client.request(
        UPDATE_LOCATION_MUTATION,
        variables
      );

      console.log("updateLocation: ", updateLocation);
      if (updateLocation) {
        dispatch({ type: "UPDATE_USER", payload: updateLocation });
        setSpinner(false);
        setLocationSuccess(true);
      }
      if (!updateLocation) {
        setLocationSuccess(true);
        setSpinner(false);
      }
    } catch (err) {
      setSpinner(false);
      console.log(err);
    }
  };

  const handleLocation = () => {
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
        });
      }
    } catch (err) {
      setSpinner(false);
    }
  };

  console.log("location: ", currentUser);
  return (
    <CollapsableHeader title={"Get Location"} onClose={submitted}>
      {spinner ? (
        <Loading color={COLORS.themeGreen} />
      ) : (
        <Box padding={10}>
          <Button
            style={{ display: "flex", alignItems: "center" }}
            onClick={handleLocation}
            width="fit-content"
          >
            {!currentUser.location.lat ? "Get Location" : "Update Location"}
            <Icon name="pin" color={COLORS.red} style={{ padding: "0px" }} />
          </Button>
          {locationSuccess && (
            <Box alignItems="center">
              <Icon name="thumbsUp" color={COLORS.themeGreen} />
              <Text>Got yo ass</Text>
            </Box>
          )}
          {!locationSuccess && (
            <Box alignItems="center">
              <Icon name="thumbsDown" color={COLORS.textRed} />
              <Text>Couldn't find you</Text>
            </Box>
          )}
        </Box>
      )}
    </CollapsableHeader>
  );
};

export default GetLocation;
