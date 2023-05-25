import React, { useContext } from "react";
import {
  Box,
  Text,
  Loading,
  Button,
  FONT_SIZES,
  Icon,
  ICON_SIZES,
} from "../../components";
import { COLORS } from "../../constants";

import Context from "../../context";

const RoomList = ({
  rooms,
  roomId,
  currentUser,
  subscribeToRoom,
  loading,
  mobile,
}) => {
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
      <Box display="flex" column width="100%" alignItems="center">
        <Box
          width={"100%"}
          justifyContent="space-around"
          display="flex"
          alignItems="center"
        >
          <Text
            bold
            margin={0}
            fontSize={mobile ? FONT_SIZES.LARGE : FONT_SIZES.XXX_LARGE}
            style={{
              textShadow:
                "-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white",
            }}
          >
            Rooms
          </Text>
          <Icon
            style={{ margin: 0 }}
            size={mobile ? ICON_SIZES.XX_LARGE : ICON_SIZES.XXX_LARGE}
            color={COLORS.white}
            name="chat"
          />
        </Box>

        {rooms &&
          rooms.map((room) => {
            const active = roomId === room._id ? "active" : "";
            const numberOfUsers =
              room.users && room.users.length ? room.users.length : 0;
            return (
              <Button
                borderTop={active && `solid 2px ${COLORS.vividBlue}`}
                borderBottom={active && `solid 2px ${COLORS.vividBlue}`}
                key={room._id}
                borderRadius={"50%"}
                display="flex"
                color={active ? COLORS.black : COLORS.grey}
                style={{
                  position: "relative",
                  overflowWrap: "break-word",
                  boxShadow: active
                    ? `3px 3px 8px 2px white`
                    : `3px 3px 8px 2px rgba(0, 0, 0, 0.3)`,
                }}
                justifyContent="center"
                isDisabled={loading}
                height={80}
                width={"100%"}
                onClick={
                  !loading
                    ? () =>
                        !!state.currentUser.username
                          ? subscribeToRoom(room._id)
                          : dispatch({ type: "TOGGLE_LOGIN", payload: true })
                    : undefined
                }
              >
                {active && loading ? (
                  <Box height={45} width="100%">
                    <Loading bar />
                  </Box>
                ) : (
                  <Text
                    color={active ? COLORS.vividBlue : COLORS.lightGrey}
                    textShadow={active && `-2px 2px 3px ${COLORS.textRed}`}
                    className="userNumber"
                    fontSize={mobile ? undefined : FONT_SIZES.X_LARGE}
                    width={"100%"}
                    bold
                  >
                    {room.name}
                  </Text>
                )}
                <Box
                  position="absolute"
                  top={-11}
                  right={-7}
                  border={`solid 1px ${COLORS.white}`}
                  backgroundColor={active ? COLORS.vividBlue : COLORS.lightGrey}
                  borderRadius={"50%"}
                  minWidth={20}
                  padding={3}
                  justifyContent="center"
                >
                  <Text
                    margin={0}
                    color={active ? COLORS.black : COLORS.grey}
                    // textShadow={active && `-2px 1px 1px ${COLORS.black}`}
                    className="userNumber"
                    fontSize={FONT_SIZES.X_LARGE}
                    width={"100%"}
                    bold
                  >
                    {numberOfUsers}
                  </Text>
                </Box>
              </Button>
            );
          })}
      </Box>
    </div>
  );
};

export default RoomList;
