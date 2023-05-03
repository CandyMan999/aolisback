import React, { useState, useEffect } from "react";
import { Image, CloudinaryContext } from "cloudinary-react";

import { Box, Icon, ICON_SIZES, Text, OnlineDot } from "../../../components";
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

  const randomVariable = () => {
    return Math.random() < 0.5
      ? Math.floor(Math.random() * 1000)
      : Math.floor(Math.random() * -1000);
  };

  const handleDistance = async (user) => {
    if (
      !!state.currentUser.location &&
      !!state.currentUser.location.lat &&
      !!user.location &&
      !!user.location.lat
    ) {
      const { lat, lng } = state.currentUser.location;
      const miles = await getDistanceFromCoords(
        lat,
        lng,
        user.location.lat,
        user.location.lng
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
      {!!profilePic ? (
        !!profilePic.publicId ? (
          <CloudinaryContext cloudName="localmassagepros">
            <Image
              alt={`${name}-profile-pic`}
              style={{
                borderRadius: "50%",
                height: 84,
                width: 84,
                marginBottom: "0px",
              }}
              loading="lazy"
              publicId={profilePic.publicId}
            ></Image>
          </CloudinaryContext>
        ) : (
          <img
            alt={`${name}-profile-pic`}
            style={{
              borderRadius: "50%",
              height: 84,
              width: 84,
              marginBottom: "8px",
            }}
            src={profilePic.url}
          />
        )
      ) : (
        <Box>
          <Box
            borderRadius="50%"
            height={64}
            width={64}
            center
            background={COLORS.lightGrey}
            justifyContent="center"
            marginBottom={8}
          >
            <Icon name="user" size={ICON_SIZES.XX_LARGE} color={COLORS.black} />
          </Box>
        </Box>
      )}

      <Text bold margin={0}>
        {name}
      </Text>
      <Text>
        {user.sex} {user.age}
      </Text>

      <Box
        width="105%"
        background={`${COLORS.darkestGrey}22`}
        bottom={0}
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
