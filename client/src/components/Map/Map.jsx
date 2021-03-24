import React, { useState, useEffect, useContext, Fragment } from "react";
import ReactMapGL, { NavigationControl, Marker, Popup } from "react-map-gl";
import { Redirect, useHistory } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { GET_ALL_USERS_QUERY } from "../../graphql/queries";

import { Box, Icon, ICON_SIZES, Text } from "../../components";
import { COLORS } from "../../constants";

import Context from "../../context";
import { useClient } from "../../client";

const INITIAL_VIEWPORT = {
  latitude: 21.304026582335645,
  longitude: -157.8411131383927,
  zoom: 4,
};

const Map = ({}) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");
  let history = useHistory();
  const [popup, setPopup] = useState({ isOpen: false, id: null });
  const [users, setUsers] = useState([]);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const { state, dispatch } = useContext(Context);
  const client = useClient();
  const { location } = state.currentUser;

  useEffect(async () => {
    const { getUsers } = await client.request(GET_ALL_USERS_QUERY, {});
    setUsers([...getUsers]);
    if (!!location && location.lat) {
      setViewport({
        ...INITIAL_VIEWPORT,
        latitude: location.lat,
        longitude: location.lng,
      });
    }
  }, [popup]);

  useEffect(() => {
    if (state.userLocationId) {
      setPopup({ isOpen: true, id: state.userLocationId });
    }
  }, []);

  const handleMapClick = () => {
    setPopup({ isOpen: false, id: null });
  };

  const handleRoomClick = (roomId) => {
    dispatch({ type: "CHANGE_ROOM", payload: roomId });
    history.push("/");
  };

  return (
    <Fragment>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
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
            <Box textAlign="center">
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
                      ? COLORS.themeGreen
                      : COLORS.red
                  }
                />
              </Marker>

              {popup.id && popup.id === user._id ? (
                <Popup
                  key={user._id + i + "1"}
                  anchor="bottom"
                  latitude={user.location.lat}
                  longitude={user.location.lng}
                  closeOnClick={false}
                  onClose={() => setPopup({ isOpen: false, id: null })}
                >
                  <img
                    style={{ height: "96px", width: "auto" }}
                    className={"classes.popupImage"}
                    src={user.pictures[0].url}
                    alt={"popup.title"}
                  />

                  <Text center>{user.username}</Text>
                  {!!user.room && user.room.name && (
                    <Fragment>
                      <Text center>Currently in room</Text>
                      <Text
                        color={COLORS.themeGreen}
                        onClick={() => handleRoomClick(user.room._id)}
                        center
                      >
                        {user.room.name}
                      </Text>
                    </Fragment>
                  )}
                </Popup>
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
