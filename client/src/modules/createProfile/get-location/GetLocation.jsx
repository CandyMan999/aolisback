import React, { useState, useEffect, useCallback } from "react";
import {
  CollapsableHeader,
  Box,
  Button,
  Text,
  Loading,
  Map,
  FONT_SIZES,
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
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });
  const [spinner, setSpinner] = useState(false);
  const location = useLocation();
  const [locationSuccess, setLocationSuccess] = useState(false);

  const noLocation = useCallback((array) => {
    return (
      Array.isArray(array) &&
      array.length === 2 &&
      array[0] === 0 &&
      array[1] === 0
    );
  }, []);

  useEffect(() => {
    if (userCoords.lat !== null && userCoords.lng !== null) {
      handleGetLocation();
    }
  }, [userCoords.lat, userCoords.lng]);

  useEffect(() => {
    if (currentUser.username) {
      setLocationSuccess(!noLocation(currentUser.location.coordinates));
    }
  }, [currentUser.location.coordinates, currentUser.username, noLocation]);

  const handleGetLocation = useCallback(async () => {
    try {
      setSpinner(true);

      let latitude =
        userCoords.lat !== null ? userCoords.lat : currentUser.location.lat;
      let longitude =
        userCoords.lng !== null ? userCoords.lng : currentUser.location.lng;

      const offset = 0.02;
      latitude += (Math.random() * 2 - 1) * offset;
      longitude += (Math.random() * 2 - 1) * offset;

      const variables = {
        latitude,
        longitude,
        _id: currentUser._id,
      };

      const { updateLocation } = await client.request(
        UPDATE_LOCATION_MUTATION,
        variables
      );

      if (updateLocation) {
        await dispatch({
          type: "UPDATE_LOCATION",
          payload: updateLocation.coordinates,
        });

        setLocationSuccess(true);
      } else {
        setLocationSuccess(false);
      }
      setSpinner(false);
    } catch (err) {
      setSpinner(false);
      console.log(err);
    }
  }, [userCoords, currentUser._id, client, dispatch]);

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
      total={total}
      completed={completed}
    >
      <Box width={"100%"} height={"100%"} column alignItems="center">
        <Text
          fontSize={FONT_SIZES.MEDIUM}
          color={COLORS.textPrimary}
          marginBottom={15}
          center
          bold
        >
          It's easier for us to find you matches when we know where you are. We
          never share your precise location, only an approximate location.
        </Text>
        <Map
          currentUser={currentUser}
          width={mobile ? "90vw" : "80%"}
          height={400}
          location={location}
        />

        <Box padding={10}>
          <Button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `0px 2px 10px ${COLORS.pink}`,
              borderRadius: "20px",
              height: "60px",
              border: `solid 1px ${COLORS.pink}`,
              marginTop: 30,
              paddingLeft: 15,
              paddingRight: 15,
            }}
            disabled={spinner}
            color={locationSuccess ? COLORS.black : COLORS.lightGrey}
            onClick={handleLocation}
            width="fit-content"
          >
            {spinner ? (
              <Loading bar color={COLORS.pink} />
            ) : noLocation(currentUser.location.coordinates) ? (
              <Text bold>Get Location 📍</Text>
            ) : (
              <Text color={COLORS.pink} bold>
                Update Location 📍
              </Text>
            )}
          </Button>
          {locationSuccess && (
            <Box alignItems="center">
              <Text fontSize={FONT_SIZES.XX_LARGE}>👍</Text>
            </Box>
          )}
          {!locationSuccess && (
            <Box alignItems="center">
              <Text fontSize={FONT_SIZES.XX_LARGE}>👎</Text>
            </Box>
          )}
        </Box>
      </Box>
    </CollapsableHeader>
  );
};

export default GetLocation;
