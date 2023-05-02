import React, { useState } from "react";
import { Image, CloudinaryContext } from "cloudinary-react";

import {
  Box,
  Icon,
  ICON_SIZES,
  Text,
  OnlineDot,
  Button,
} from "../../../components";
import { COLORS } from "../../../constants";
import { isEqual } from "lodash";
import { motion } from "framer-motion";

const ProfileCardBack = ({ online, photos, name, user, activeID, onClick }) => {
  const randomVariable = () => {
    return Math.random() < 0.5
      ? Math.floor(Math.random() * 1000)
      : Math.floor(Math.random() * -1000);
  };

  const handleMessage = () => {
    alert("Video Message in Progress");
  };

  return (
    <motion.div
      animate={{
        x: [randomVariable(), 0],
        y: [randomVariable(), 0],
      }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        times: [0, 0.2],
      }}
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
      <OnlineDot online={online} />

      <Text bold margin={0}>
        Back
      </Text>

      <Box
        width="105%"
        background={`${COLORS.vividBlue}22`}
        bottom={0}
        justifyContent="center"
        height={40}
        alignItems="center"
      >
        <Text onClick={handleMessage}> Send Video Message</Text>
      </Box>
    </motion.div>
  );
};

export default ProfileCardBack;
