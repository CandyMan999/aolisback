import React, { useState, useEffect, useContext, Fragment } from "react";
import ReactMapGL, { NavigationControl, Marker, Popup } from "react-map-gl";
import { useHistory } from "react-router-dom";
import { Image, Transformation, CloudinaryContext } from "cloudinary-react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { GET_ALL_USERS_QUERY } from "../../graphql/queries";

import {
  Box,
  Icon,
  ICON_SIZES,
  Text,
  Button,
  RoomLink,
  OnlineDot,
} from "../../components";
import { COLORS } from "../../constants";
import Profile from "../../modules/profile";
import Context from "../../context";
import { useClient } from "../../client";
import { FONT_SIZES } from "../Text";
import mapboxgl from "mapbox-gl";

mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const INITIAL_VIEWPORT = {
  latitude: 21.304026582335645,
  longitude: -157.8411131383927,
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
      const { getUsers } = await client.request(GET_ALL_USERS_QUERY, {});

      setUsers([...getUsers]);
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

  const handleVideoLink = async (username) => {
    await dispatch({ type: "JOIN_CHANNEL", payload: username });
    history.push("/video");
  };

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
                <Box center width="100%" display="flex">
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
                    {user.pictures.length && (
                      <Box
                        onClick={() => handleSetProfile(user)}
                        justifyContent="center"
                        style={{
                          backgroundColor: "black",
                          borderRadius: "5px",
                        }}
                      >
                        {user.pictures[0].publicId ? (
                          <CloudinaryContext cloudName="localmassagepros">
                            <Image
                              alt={`${user.pictures[0]._id}-avatar`}
                              style={{
                                height: "96px",
                                width: "auto",
                              }}
                              loading="lazy"
                              publicId={user.pictures[0].publicId}
                            >
                              <Transformation
                                height={"96"}
                                width={"auto"}
                                crop="thumb"
                              />
                            </Image>
                          </CloudinaryContext>
                        ) : (
                          <img
                            style={{
                              height: "96px",
                              width: "auto",
                            }}
                            className={"classes.popupImage"}
                            src={user.pictures[0].url}
                            alt={"popup.title"}
                          />
                        )}
                      </Box>
                    )}
                    <Button
                      size="small"
                      fontSize={FONT_SIZES.X_SMALL}
                      width="90%"
                      paddingX={0}
                      disabled={!user.isLoggedIn}
                      color={
                        !user.isLoggedIn ? COLORS.lighterGrey : COLORS.black
                      }
                      onClick={() => handleVideoLink(user.username)}
                    >
                      <Text margin={0} bold color={COLORS.themeGreen}>
                        {user.username}'s Video Channel
                      </Text>
                    </Button>
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
        <Profile userClicked={state.profile} mobile={mobileSize} />
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
