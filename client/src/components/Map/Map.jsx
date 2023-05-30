import React, { useState, useEffect, useContext, Fragment } from "react";
import ReactMapGL, { NavigationControl, Marker, Popup } from "react-map-gl";
import { useHistory } from "react-router-dom";
import { Image, Transformation, CloudinaryContext } from "cloudinary-react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { GET_USERS_MAP_QUERY } from "../../graphql/queries";

import {
  Box,
  Icon,
  ICON_SIZES,
  Text,
  RoomLink,
  OnlineDot,
  Picture,
} from "../../components";
import { COLORS } from "../../constants";

import Context from "../../context";
import { useClient } from "../../client";
import { FONT_SIZES } from "../Text";
import mapboxgl from "mapbox-gl";

mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const INITIAL_VIEWPORT = {
  latitude: 37.6521549856949,
  longitude: -97.14298803846937,
  zoom: 4,
};

const Map = ({ zoom, width, height }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");
  let history = useHistory();
  const [popup, setPopup] = useState({ isOpen: false, id: null });
  const [users, setUsers] = useState([]);

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const { state, dispatch } = useContext(Context);
  const client = useClient();
  const { location } = state.currentUser;

  useEffect(() => {
    handleGetUsers();
  }, []);

  useEffect(() => {
    const { _id, lat, lng } = state.userLocation;
    if (state.userLocation._id) {
      setPopup({ isOpen: true, id: _id });
      setViewport({
        latitude: lat,
        longitude: lng,
        zoom: 12,
      });
    }
  }, [state.userLocation._id]);

  const handleGetUsers = async () => {
    try {
      const { getUsersMap } = await client.request(GET_USERS_MAP_QUERY, {});

      setUsers([...getUsersMap]);
      if (!!location && location.lat && !state.userLocation._id) {
        setViewport({
          ...INITIAL_VIEWPORT,
          latitude: location.lat,
          longitude: location.lng,
        });

        if (zoom) {
          setViewport({
            ...INITIAL_VIEWPORT,
            zoom,
            latitude: location.lat,
            longitude: location.lng,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleMapClick = () => {
    setPopup({ isOpen: false, id: null });
    dispatch({
      type: "VIEW_LOCATION",
      payload: { _id: null, location: { lat: null, lng: null } },
    });
  };

  // const handleVideoLink = async (username) => {
  //   await dispatch({ type: "JOIN_CHANNEL", payload: username });
  //   history.push("/video");
  // };

  const handleSetProfile = async (user) => {
    await dispatch({ type: "UPDATE_PROFILE", payload: user });
    dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
  };

  return (
    <Fragment>
      <ReactMapGL
        width={width ? width : "100vw"}
        height={height ? height : "calc(100vh - 64px)"}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(newViewport) => setViewport(newViewport)}
        {...viewport}
        onClick={handleMapClick}
        scrollZoom={!mobileSize}
      >
        <div>
          <NavigationControl
            onViewportChange={(newViewport) => setViewport(newViewport)}
          />
        </div>
        {users.length &&
          users.map((user, i) => (
            <Box key={"box" + i} textAlign="center">
              <Marker
                key={user._id}
                latitude={user.location.lat}
                longitude={user.location.lng}
              >
                <Icon
                  key={user._id + i}
                  onClick={() => setPopup({ isOpen: true, id: user._id })}
                  name="pin"
                  size={ICON_SIZES.X_LARGE}
                  color={
                    state.currentUser._id === user._id
                      ? COLORS.vividBlue
                      : COLORS.red
                  }
                />
              </Marker>
              {popup.id && popup.id === user._id ? (
                <Box width="100%" display="flex" zIndex={100}>
                  <Popup
                    key={user._id + i + "1"}
                    anchor="bottom"
                    latitude={user.location.lat}
                    longitude={user.location.lng}
                    closeOnClick={false}
                    onClose={() => setPopup({ isOpen: false, id: null })}
                  >
                    <OnlineDot online={user.isLoggedIn} />
                    <Text bold fontSize={FONT_SIZES.X_LARGE} margin={0} center>
                      {user.username}
                    </Text>
                    <Box
                      onClick={() => handleSetProfile(user)}
                      justifyContent="center"
                      marginBottom={20}
                    >
                      <Box
                        justifyContent="center"
                        style={{
                          backgroundColor: "black",
                          borderRadius: "5px",
                          width: "fit-content",
                          padding: 10,
                        }}
                      >
                        <Picture
                          profilePic={user.pictures[0]}
                          name={user.username}
                          height={"120px"}
                          width={120}
                        />
                      </Box>
                    </Box>

                    {!!user.room && user.isLoggedIn && user.room.name && (
                      <RoomLink dispatch={dispatch} user={user} />
                    )}
                  </Popup>
                </Box>
              ) : (
                ""
              )}
            </Box>
          ))}
      </ReactMapGL>
    </Fragment>
  );
};

const styles = {
  root: {
    display: "flex",
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse",
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em",
  },
  deleteIcon: {
    color: "red",
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover",
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
};

export default Map;
