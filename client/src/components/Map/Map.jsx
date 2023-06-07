import React, { useState, useEffect, useContext, Fragment } from "react";
import "./map.css";
import ReactMapGL, {
  NavigationControl,
  Marker,
  Popup,
  FlyToInterpolator,
} from "react-map-gl";

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
  Loading,
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
  zoom: 2,
};

const Map = ({ zoom, width, height, currentUser, location }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const [popup, setPopup] = useState({ isOpen: false, id: null });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const { state, dispatch } = useContext(Context);
  const client = useClient();
  const {
    location: { coordinates },
  } = currentUser;

  useEffect(() => {
    window.scrollTo(0, 0);

    handleGetUsers();
  }, []);

  useEffect(() => {
    const { _id, lat, lng } = state.userLocation;
    if (!!_id && !!lat && !!lng && !loading) {
      setPopup({ isOpen: true, id: _id });

      setTimeout(() => {
        handleFlyTo(lat, lng, 8);
      }, 1000);
    }
    if (location.pathname === "/profile") {
      setPopup({ isOpen: true, id: currentUser._id });
      setTimeout(() => {
        handleFlyTo(
          currentUser.location.coordinates[1],
          currentUser.location.coordinates[0],
          8
        );
      }, 1000);
    }
  }, [state.userLocation._id, loading]);

  const handleGetUsers = async () => {
    try {
      setLoading(true);
      const variables = {
        latitude: currentUser.location.coordinates[1],
        longitude: currentUser.location.coordinates[0],
      };
      const { getUsersMap } = await client.request(
        GET_USERS_MAP_QUERY,
        variables
      );

      setUsers([...getUsersMap]);
      if (!!coordinates.length) {
        setViewport({
          ...INITIAL_VIEWPORT,
          latitude: coordinates[1],
          longitude: coordinates[0],
        });

        if (zoom) {
          setViewport({
            ...INITIAL_VIEWPORT,
            zoom,
            latitude: coordinates[1],
            longitude: coordinates[0],
          });
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleMapClick = () => {
    setPopup({ isOpen: false, id: null });
  };

  const handleSetProfile = async (user) => {
    await dispatch({ type: "UPDATE_PROFILE", payload: user });
    dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
  };

  const flyToOptions = {
    duration: "auto", // Transition duration in milliseconds
    easing: (t) => t, // Easing function for the transition
    transitionInterpolator: new FlyToInterpolator(), // Specify the FlyToInterpolator
  };

  const handleFlyTo = (lat, lng, zoom) => {
    const newViewport = {
      latitude: lat,
      longitude: lng,
      zoom,
      transitionDuration: flyToOptions.duration,
      transitionEasing: flyToOptions.easing,
      transitionInterpolator: flyToOptions.transitionInterpolator,
    };
    setViewport(newViewport);
  };

  const handleMarkerClick = (id, lat, lng) => {
    const markerZoom = viewport.zoom > 8 ? viewport.zoom : 8;
    setPopup({ isOpen: true, id });
    handleFlyTo(lat, lng, markerZoom);
  };

  const buildMarker = () => {
    return (
      <Marker
        key={`${state.userLocation._id}-marker`}
        latitude={state.userLocation.lat}
        longitude={state.userLocation.lng}
      >
        <Icon
          key={`${state.userLocation._id}-marker-icon`}
          onClick={() =>
            handleMarkerClick(
              state.userLocation._id,
              state.userLocation.lat,
              state.userLocation.lng
            )
          }
          name="pin"
          size={ICON_SIZES.X_LARGE}
          color={
            state.currentUser._id === state.userLocation._id
              ? COLORS.vividBlue
              : COLORS.red
          }
        />
      </Marker>
    );
  };
  return (
    <Fragment>
      {loading ? (
        <Box
          width={width ? width : "100vw"}
          height={height ? height : "calc(100vh - 64px)"}
        >
          <Loading fade size={150} />
        </Box>
      ) : (
        <ReactMapGL
          width={width ? width : "100vw"}
          height={height ? height : "calc(100vh - 64px)"}
          mapStyle={"mapbox://styles/mapbox/streets-v12"}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
          onViewportChange={(newViewport) => setViewport(newViewport)}
          {...viewport}
          onClick={handleMapClick}
          scrollZoom={!mobileSize}
          style={{ overflow: "hidden", overscrollBehavior: "none" }}
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
                  latitude={user.location.coordinates[1]}
                  longitude={user.location.coordinates[0]}
                >
                  <Icon
                    key={user._id + i}
                    onClick={() =>
                      handleMarkerClick(
                        user._id,
                        user.location.coordinates[1],
                        user.location.coordinates[0]
                      )
                    }
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
                  <Box width="100%" display="flex" zIndex={99}>
                    <Popup
                      key={user._id + i + "1"}
                      anchor="bottom"
                      latitude={user.location.coordinates[1]}
                      longitude={user.location.coordinates[0]}
                      closeOnClick={false}
                      onClose={() => setPopup({ isOpen: false, id: null })}
                    >
                      <OnlineDot
                        online={user.isLoggedIn}
                        style={{ marginTop: 0 }}
                      />
                      <Text
                        bold
                        fontSize={FONT_SIZES.X_LARGE}
                        margin={0}
                        center
                        marginBottom={4}
                      >
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
      )}
    </Fragment>
  );
};

export default Map;
