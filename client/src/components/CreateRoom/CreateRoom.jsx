import React, { useState } from "react";
import { Box, Icon, ICON_SIZES } from "../../components";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";

const CreateRoom = ({ currentUserID, createRoom, dispatch }) => {
  const [roomName, setRoomName] = useState("");
  const [touched, setTouched] = useState(false);

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
    setTouched(false);
  };

  const handleIsLoggedIn = () => {
    if (!currentUserID) {
      dispatch({ type: "TOGGLE_SIGNUP", payload: true });
    } else {
      setTouched(!touched);
    }
  };

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
      onClick={!touched ? handleIsLoggedIn : undefined}
      className="new-room-form"
      animate={{ width: touched ? "50vW" : "100%" }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <Box
        onClick={handleIsLoggedIn}
        boxShadow={`1px 1px 1px 2px rgba(0, 0, 0, 0.2)`}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          backgroundColor: COLORS.white,
          height: "60px",
          width: "60px",
          display: touched ? "none" : undefined,
        }}
      >
        <Box display="flex" width="100%" justifyContent="center">
          <Icon
            onClick={() => setTouched(false)}
            name="pencil"
            size={ICON_SIZES.X_LARGE}
            color={COLORS.grey}
          />
        </Box>
      </Box>
      <motion.div
        initial="hidden"
        animate={touched ? "visible" : "none"}
        variants={inputContainerVariants}
        style={{
          position: "absolute",
          bottom: "40px",
          right: "5%",
        }}
      >
        {touched && (
          <form onSubmit={handleSubmit}>
            <Box
              position="absolute"
              top={-12}
              left={-12}
              backgroundColor={COLORS.white}
              border={`solid 1px ${COLORS.grey}`}
              boxShadow={`1px 1px 1px 2px rgba(0, 0, 0, 0.2)`}
              borderRadius={"50%"}
              padding={3}
            >
              <Icon
                onClick={() => setTouched(false)}
                name="close"
                size={ICON_SIZES.MEDIUM}
                color={COLORS.grey}
              />
            </Box>

            <input
              style={{
                width: "100%",
                borderBottom: "none",
                borderRadius: "20px",
                height: "30px",
              }}
              fontSize={"10px"}
              value={roomName}
              onChange={handleChange}
              type="text"
              placeholder="Create Room"
              required
            />

            {!!roomName.length && (
              <Box position="absolute" right={4} top={3}>
                <Icon
                  onClick={handleSubmit}
                  name="send"
                  size={ICON_SIZES.X_LARGE}
                  color={COLORS.vividBlue}
                />
              </Box>
            )}
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CreateRoom;
