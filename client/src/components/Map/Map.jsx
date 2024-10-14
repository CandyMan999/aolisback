import React, {
  useState,
  useEffect,
  useContext,
  Fragment,
  useMemo,
} from "react";
import "./map.css";
import ReactMapGL, {
  NavigationControl,
  Marker,
  Popup,
  FlyToInterpolator,
} from "react-map-gl";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { GET_USERS_MAP_QUERY, FIND_USER_QUERY } from "../../graphql/queries";

import {
  Box,
  Icon,
  ICON_SIZES,
  Text,
  RoomLink,
  OnlineDot,
  Picture,
  Loading,
  Button,
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
  const [mapLoading, setMapLoading] = useState(false);

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const { state, dispatch } = useContext(Context);
  const client = useClient();
  const {
    location: { coordinates },
  } = currentUser;

  useEffect(() => {
    if (!state.userLocation._id) {
      handleGetUsers();
    }
  }, [state.userLocation._id]);

  const memoizedCoordinates = useMemo(
    () => currentUser.location.coordinates,
    [currentUser.location.coordinates[0], currentUser.location.coordinates[1]]
  );

  useEffect(() => {
    if (memoizedCoordinates !== state.userLocation.coordinates) {
      mapLoad();
    }
  }, [state.userLocation._id, memoizedCoordinates]);

  const mapLoad = async () => {
    const { _id, lat, lng } = state.userLocation;
    if (
      location.pathname === "/profile" &&
      !noLocation(currentUser.location.coordinates)
    ) {
      setPopup({ isOpen: true, id: currentUser._id });
      await handleGetUsers(currentUser._id);

      setTimeout(() => {
        handleFlyTo(
          currentUser.location.coordinates[1],
          currentUser.location.coordinates[0],
          8
        );
      }, 1000);
    } else if (!!_id && !!lat && !!lng) {
      await handleGetUsers(_id);
      setPopup({ isOpen: true, id: _id });
      setTimeout(() => {
        handleFlyTo(lat, lng, 8);
      }, 1000);
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

  const handleMapMove = async () => {
    try {
      setMapLoading(true);
      const variables = {
        latitude: viewport.latitude,
        longitude: viewport.longitude,
      };

      const { getUsersMap } = await client.request(
        GET_USERS_MAP_QUERY,
        variables
      );

      await setUsers([...getUsersMap]);
      setMapLoading(false);
    } catch (err) {
      setMapLoading(false);
      console.log(err);
    }
  };

  const handleGetUsers = async (_id) => {
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
      let foundUser = null;
      if (!!_id) {
        const found = await getUsersMap.find((user) => user._id === _id);
        if (!found) {
          const variables = {
            _id,
          };
          const { findUser } = await client.request(FIND_USER_QUERY, variables);
          foundUser = findUser;
        }
      }

      if (!!foundUser) {
        setUsers([...getUsersMap, foundUser]);
      } else {
        setUsers([...getUsersMap]);
      }

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

  // const handleMapClick = () => {
  //   setPopup({ isOpen: false, id: null });
  // };

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

  const onMapLoad = (event) => {
    const map = event.target;

    // Add 3D terrain if you want
    map.addSource("mapbox-dem", {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14,
    });

    map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

    // Add 3D buildings layer
    map.addLayer({
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 15,
      paint: {
        "fill-extrusion-color": "#aaa",
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": 0.6,
      },
    });
  };

  return (
    <Fragment>
      {loading ? (
        <Box
          width={width ? width : "100vw"}
          height={height ? height : "70vh"}
          display="flex"
          justifyContent="center"
        >
          <Loading ring size={200} />
        </Box>
      ) : (
        <ReactMapGL
          width={width ? width : "100vw"}
          height={height ? height : `calc(${window.innerHeight}px - 60px)`}
          mapStyle={"mapbox://styles/mapbox/streets-v12"}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
          onViewportChange={(newViewport) => setViewport(newViewport)}
          onLoad={onMapLoad}
          {...viewport}
          // onClick={handleMapClick}
          scrollZoom={!mobileSize}
          style={{
            overflow: "hidden",
            overscrollBehavior: "none",
          }}
        >
          <div>
            <NavigationControl
              style={{ position: "absolute", top: 10, right: 10 }}
              onViewportChange={(newViewport) => setViewport(newViewport)}
            />
            {location.pathname !== "/profile" && (
              <Box
                width={"40%"}
                position="absolute"
                bottom={0}
                left={-10}
                zIndex={900}
              >
                <Button
                  width={"100%"}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: `0px 2px 10px ${COLORS.pink}`,
                    borderRadius: "20px",
                    border: `solid 1px ${COLORS.pink}`,
                    minHeight: 60,
                  }}
                  color={COLORS.white}
                  onClick={handleMapMove}
                >
                  {mapLoading ? (
                    <Loading bar />
                  ) : (
                    <Text color={COLORS.black} bold>
                      UPDATE MAP
                    </Text>
                  )}
                </Button>
              </Box>
            )}
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
                        : COLORS.pink
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
                            borderRadius: "5px",
                            width: "fit-content",
                            padding: 10,
                          }}
                        >
                          <Picture
                            withShadow={true}
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
