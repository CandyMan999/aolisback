import React, { useContext } from "react";
import { Box, Text, Loading } from "../../components";
import { COLORS } from "../../constants";

import Context from "../../context";

const RoomList = ({ rooms, roomId, currentUser, subscribeToRoom, loading }) => {
  const { state, dispatch } = useContext(Context);

  const handleIsLoggedIn = async () => {
    try {
      if (currentUser && !currentUser.username) {
        dispatch({ type: "TOGGLE_SIGNUP", payload: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="rooms-list" onClick={() => handleIsLoggedIn()}>
      <ul>
        <h3>Rooms:</h3>
        {rooms &&
          rooms.map((room) => {
            const active = roomId === room._id ? "active" : "";
            const numberOfUsers =
              room.users && room.users.length ? room.users.length : 0;
            return (
              <Box
                borderTop={active && `solid 2px ${COLORS.themeGreen}`}
                borderBottom={active && `solid 2px ${COLORS.themeGreen}`}
                key={room._id}
                display="flex"
                isDisabled={loading}
                onClick={
                  !loading
                    ? () =>
                        !!state.currentUser.username
                          ? subscribeToRoom(room._id)
                          : dispatch({ type: "TOGGLE_LOGIN", payload: true })
                    : undefined
                }
              >
                {loading ? (
                  <Loading pulse />
                ) : (
                  <Text
                    color={active ? COLORS.themeGreen : COLORS.lightGrey}
                    textShadow={active && `-2px 2px 3px ${COLORS.textRed}`}
                    className="userNumber"
                  >
                    {room.name}: Online {numberOfUsers}
                  </Text>
                )}
              </Box>
            );
          })}
      </ul>
    </div>
  );
};

export default RoomList;
