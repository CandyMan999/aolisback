import React from "react";
import { Image, CloudinaryContext } from "cloudinary-react";

import { Box, Icon, ICON_SIZES, Text } from "../../../components";
import { COLORS } from "../../../constants";
import { isEqual } from "lodash";
import { motion } from "framer-motion";

const ProfileCard = ({ online, photos, name, user }) => {
  const profilePic = photos[0];
  console.log("photos: ", photos, profilePic);

  const randomVariable = () => {
    return Math.random() < 0.5
      ? Math.floor(Math.random() * 1000)
      : Math.floor(Math.random() * -1000);
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
        // border: isActive
        //   ? `3px solid ${COLORS.yellow}`
        //   : `1px solid ${COLORS.grey}`,
      }}
      // onClick={onClick}
    >
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

      {/* <Text margin={0}>${baseRate}+</Text> */}

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
          miles away
        </Text>
      </Box>
    </motion.div>
  );
};

export default ProfileCard;
