import React, { useContext, useState } from "react";
import {
  Box,
  Text,
  Loading,
  Button,
  FONT_SIZES,
  Icon,
  ICON_SIZES,
  JoinARoom,
} from "../../components";
import { COLORS } from "../../constants";
import { motion } from "framer-motion";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Context from "../../context";

const RoomList = ({
  rooms,
  roomId,
  currentUser,
  subscribeToRoom,
  loading,
  showRoomList,
}) => {
  const { state, dispatch } = useContext(Context);
  const mobile = useMediaQuery("(max-width: 950px)");
  const [touched, setTouched] = useState(false);

  const handleTermsAgreement = () => {
    if (currentUser.username && !currentUser.terms) {
      dispatch({ type: "SHOW_TERMS", payload: true });
    }
    // setTouched(!touched);
  };

  return (
    <motion.div
      onClick={() => handleTermsAgreement()}
      style={{
        marginRight: 15,

        flexDirection: "column",
        alignItems: "center",
        height: "100%",
      }}
      animate={{
        width: showRoomList ? "100vW" : "25%",
        zIndex: showRoomList && roomId ? 5000 : undefined,
        postion: showRoomList ? "fixed" : undefined,
      }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <Box
        display="flex"
        column
        // width={showRoomList ? "100vW" : "100%"}
        alignItems="center"
      >
        {(roomId || mobile) && !showRoomList && (
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
                textShadow: `-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white`,
              }}
            >
              Rooms
            </Text>
            <Icon
              style={{ margin: 0 }}
              size={mobile ? ICON_SIZES.XX_LARGE : ICON_SIZES.XXX_LARGE}
              color={COLORS.pink}
              name="chat"
            />
          </Box>
        )}
        {(!roomId && !mobile) ||
          (showRoomList && (
            <Box alignItems="center">
              <JoinARoom isPointingDown={true} />
            </Box>
          ))}

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
                display="flex"
                dontScale={true}
                color={active ? COLORS.deepPurple : COLORS.lightPurple}
                style={{
                  border: `solid 1px ${COLORS.pink}`,
                  position: "relative",
                  overflowWrap: "break-word",
                  boxShadow: active
                    ? `3px 3px 8px 2px ${COLORS.pink}`
                    : `3px 3px 8px 2px rgba(0, 0, 0, 0.3)`,
                  borderRadius: 10,
                }}
                justifyContent="center"
                isDisabled={loading}
                height={80}
                width={"90%"}
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
                  <Box height={20} width="100%">
                    <Loading bar />
                  </Box>
                ) : (
                  <Text
                    color={active ? COLORS.white : COLORS.darkGrey}
                    className="userNumber"
                    fontSize={mobile ? undefined : FONT_SIZES.X_LARGE}
                    width={"100%"}
                    bold
                    margin={0}
                  >
                    {room.name}
                  </Text>
                )}
                <Box
                  position="absolute"
                  top={-11}
                  right={-7}
                  style={{ transition: "background-color 0.4s" }}
                  border={`solid 1px ${active ? COLORS.pink : COLORS.darkGrey}`}
                  backgroundColor={
                    active ? COLORS.lightPurple : COLORS.lightGrey
                  }
                  borderRadius={"50%"}
                  minWidth={20}
                  minHeight={20}
                  alignItems="center"
                  padding={3}
                  justifyContent="center"
                >
                  <Text
                    margin={0}
                    color={active ? COLORS.white : COLORS.darkGrey}
                    className="userNumber"
                    fontSize={mobile ? FONT_SIZES.SMALL : FONT_SIZES.X_LARGE}
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
    </motion.div>
  );
};

export default RoomList;
