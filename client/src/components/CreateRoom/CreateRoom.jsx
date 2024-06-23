import React, { useState } from "react";
import { Box, Icon, ICON_SIZES, Text } from "../../components";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const CreateRoom = ({ currentUserID, createRoom, dispatch, state }) => {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");

  const mobile = useMediaQuery("(max-width: 950px)");
  const { showRoomList, roomId } = state;

  const handleChange = (e) => {
    const value = e.target.value;
    const words = value.trim().split(/\s+/);

    if (words.length > 3) {
      setError("Too Many Words!");
    } else if (words.some((word) => word.length > 15)) {
      setError("Too Long!");
    } else {
      setError("");
    }

    setRoomName(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) return;

    const variables = {
      name: roomName.trim(),
      _id: currentUserID,
    };
    createRoom(variables);
    setRoomName("");
    dispatch({ type: "CREATE_ROOM", payload: false });
  };

  const handleIsLoggedIn = () => {
    if (!currentUserID) {
      dispatch({ type: "TOGGLE_SIGNUP", payload: true });
    }
  };

  const handleCreateRoom = () => {
    dispatch({ type: "CREATE_ROOM", payload: true });
  };

  const handleClose = () => {
    dispatch({ type: "CREATE_ROOM", payload: false });
  };

  const inputContainerVariants = {
    hidden: {
      width: "0%",
    },
    visible: {
      width: "40vw",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box column>
      <motion.div
        onClick={handleIsLoggedIn}
        className="new-room-form"
        style={{ backgroundColor: "white" }}
        animate={{
          width: showRoomList ? "100vw" : "100%",
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
                width={mobile ? "90vw" : "50%"}
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

                {error && (
                  <Box
                    position="absolute"
                    top={-30}
                    left={30}
                    width="100%"
                    textAlign="center"
                    color={COLORS.red}
                    fontSize="14px" // Adjust font size as needed
                  >
                    <Text>{error}</Text>
                  </Box>
                )}

                <input
                  style={{
                    width: "100%",
                    borderBottom: "none",
                    borderRadius: "20px",
                    height: "35px",
                    textAlign: "center",
                    fontSize: 20,
                  }}
                  value={roomName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Create Room"
                  required
                />
                {!!roomName.length && !error && (
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
    </Box>
  );
};

export default CreateRoom;
