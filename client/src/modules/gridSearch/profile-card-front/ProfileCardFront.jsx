import React, { useState, useEffect } from "react";

import {
  Box,
  Icon,
  ICON_SIZES,
  Text,
  OnlineDot,
  Picture,
} from "../../../components";
import { COLORS } from "../../../constants";
import { getDistanceFromCoords } from "../../../utils/helpers";
import { motion } from "framer-motion";

const ProfileCardFront = ({
  online,
  photos,
  name,
  user,
  activeID,
  onClick,
  state,
}) => {
  const [distance, setDistance] = useState("No Location");

  const profilePic = photos[0];

  useEffect(() => {
    handleDistance(user);
  }, []);

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

  const handleDistance = async (user) => {
    if (
      !noLocation(state.currentUser.location.coordinates) &&
      !noLocation(user.location.coordinates)
    ) {
      const {
        location: { coordinates },
      } = state.currentUser;
      const miles = await getDistanceFromCoords(
        coordinates[1],
        coordinates[0],
        user.location.coordinates[1],
        user.location.coordinates[0]
      );

      setDistance(`${miles} miles away`);
    } else {
      setDistance("No Location");
    }
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
        borderRadius: "10px",

        justifyContent: "space-between",
        boxShadow: `0px 0px 5px 1px ${COLORS.lightGrey}`,
        border:
          activeID === user._id
            ? `3px solid ${COLORS.pink}`
            : `1px solid ${COLORS.grey}`,
      }}
      onClick={() => onClick(user._id)}
    >
      <OnlineDot online={online} />
      <Picture profilePic={profilePic} name={name} height={120} width={120} />
      <Text bold margin={0}>
        {name}
      </Text>
      <Text>
        {user.sex === "Gender_Diverse" ? "Gender Diverse" : user.sex} {user.age}
      </Text>

      <Box
        width="105%"
        background={`${COLORS.darkestGrey}22`}
        bottom={0}
        borderRadius={"0px 0px 10px 10px"}
        justifyContent="center"
        height={40}
        alignItems="center"
      >
        <Icon name="distance" color={COLORS.red} size={ICON_SIZES.LARGE} />
        <Text margin={0} paddingRight={4}>
          {distance}
        </Text>
      </Box>
    </motion.div>
  );
};

export default ProfileCardFront;
