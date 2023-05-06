import React from "react";
import { useHistory } from "react-router-dom";

import { Box, Text, Button, VideoPlayer } from "../../../components";
import { COLORS } from "../../../constants";

import { motion } from "framer-motion";

const ProfileCardBack = ({
  online,
  photos,
  name,
  user,
  activeID,
  onClick,
  openModal,
  dispatch,
}) => {
  const handleMessage = () => {
    openModal();
  };
  let history = useHistory();

  const handleRoomClick = (roomId) => {
    dispatch({ type: "CHANGE_ROOM", payload: roomId });
    history.push("/");
  };

  return (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 150,
        minWidth: 150,
        height: 280,
        margin: 4,
        alignItems: "center",
        textAlign: "center",
        marginTop: 12,

        marginBottom: 12,
        paddingLeft: 2,
        paddingRight: 2,
        cursor: "pointer",

        justifyContent: "space-between",
        boxShadow: `0px 0px 5px 1px ${COLORS.lightGrey}`,
        border:
          activeID === user._id
            ? `3px solid ${COLORS.yellow}`
            : `1px solid ${COLORS.grey}`,
      }}
      onClick={() => onClick(user._id)}
    >
      <Box card column padding={5} marginTop={25} onClick={handleMessage}>
        <Text bold margin={0}>
          No Messages!
        </Text>
        <Text bold margin={0}>
          Try sending a Video Message!
        </Text>
      </Box>
      {!!user.room && online && user.room.name && (
        <Button width={"100%"}>
          <Text
            margin={0}
            onClick={() => handleRoomClick(user.room._id)}
            center
          >
            Current Room: {user.room.name}
          </Text>
        </Button>
      )}
      {/* <VideoPlayer publicId={"k5vxaofje2szdzdne8tu"} width={150} height={280} /> */}

      <Box
        width="105%"
        background={`${COLORS.vividBlue}22`}
        bottom={0}
        justifyContent="center"
        height={40}
        alignItems="center"
      >
        {/* <Icon name="distance" color={COLORS.red} size={ICON_SIZES.LARGE} /> */}
        <Text onClick={handleMessage}> Send Video Message</Text>
      </Box>
    </motion.div>
  );
};

export default ProfileCardBack;
