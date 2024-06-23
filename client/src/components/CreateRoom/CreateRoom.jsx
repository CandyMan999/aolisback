import React, { useState } from "react";
import { Box, Icon, ICON_SIZES } from "../../components";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const CreateRoom = ({
  currentUserID,
  createRoom,
  dispatch,
  currentUser,
  state,
}) => {
  const [roomName, setRoomName] = useState("");
  const [touched, setTouched] = useState(false);
  const mobile = useMediaQuery("(max-width: 950px)");
  const { showRoomList, roomId } = state;

  const handleChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const variables = {
      name: roomName,
      _id: currentUserID,
    };
    createRoom(variables);
    setRoomName("");
    // setTouched(false);
    dispatch({ type: "CREATE_ROOM", payload: false });
  };

  const handleIsLoggedIn = () => {
    if (!currentUserID) {
      dispatch({ type: "TOGGLE_SIGNUP", payload: true });
    } else {
      // dispatch({ type: "CREATE_ROOM", payload: !showRoomList });
    }
  };

  const handleCreateRoom = () => {
    dispatch({ type: "CREATE_ROOM", payload: true });
  };

  const handleClose = () => {
    dispatch({ type: "CREATE_ROOM", payload: false });
  };

  // const handleTermsAgreement = () => {
  //   if (currentUser.username && !currentUser.terms) {
  //     dispatch({ type: "SHOW_TERMS", payload: true });
  //   } else {
  //     setTouched(false);
  //     dispatch({ type: "CREATE_ROOM", payload: true });
  //   }
  // };

  const inputContainerVariants = {
    hidden: {
      width: "0%",
    },
    visible: {
      width: "40vW",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      onClick={handleIsLoggedIn}
      className="new-room-form"
      style={{ backgroundColor: "white" }}
      animate={{
        width: showRoomList ? "100vW" : "100%",
        zIndex: showRoomList ? 5000 : undefined,
      }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <Box
        border={`solid 1px ${COLORS.pink}`}
        boxShadow={`1px 1px 1px 2px rgba(0, 0, 0, 0.2)`}
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          borderRadius: "50%",
          backgroundColor: COLORS.black,
          height: "50px",
          width: "50px",
          display: showRoomList ? "none" : undefined,
        }}
      >
        <Box display="flex" width="100%" justifyContent="center">
          <Icon
            onClick={handleCreateRoom}
            name={roomId ? "chat" : "plus"}
            size={roomId ? ICON_SIZES.XXX_LARGE : ICON_SIZES.LARGE}
            color={COLORS.pink}
          />
        </Box>
      </Box>
      <motion.div
        initial="hidden"
        animate={showRoomList ? "visible" : "none"}
        variants={inputContainerVariants}
        style={{
          position: "absolute",
          bottom: "40px",
          right: "5%",
        }}
      >
        {showRoomList && (
          <form onSubmit={handleSubmit}>
            <Box
              position="absolute"
              bottom={-20}
              right={0}
              width={mobile ? "90vW" : "50%"}
            >
              <Box
                position="absolute"
                top={-12}
                left={-12}
                backgroundColor={COLORS.black}
                border={`solid 1px ${COLORS.pink}`}
                boxShadow={`1px 1px 1px 2px rgba(0, 0, 0, 0.2)`}
                borderRadius={"50%"}
                padding={3}
              >
                <Icon
                  onClick={handleClose}
                  name="close"
                  size={ICON_SIZES.MEDIUM}
                  color={COLORS.white}
                />
              </Box>

              <input
                style={{
                  width: "100%",
                  borderBottom: "none",
                  borderRadius: "20px",
                  height: "35px",
                }}
                fontSize={"10px"}
                value={roomName}
                onChange={handleChange}
                type="text"
                placeholder="Create Room"
                required
              />

              {!!roomName.length && (
                <Box position="absolute" right={4} top={5}>
                  <Icon
                    onClick={handleSubmit}
                    name="send"
                    size={ICON_SIZES.X_LARGE}
                    color={COLORS.pink}
                  />
                </Box>
              )}
            </Box>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CreateRoom;
