import React from "react";
import { motion } from "framer-motion";
import { Image, CloudinaryContext } from "cloudinary-react";
import { Box, Icon, ICON_SIZES } from "..";
import { COLORS } from "../../constants";
import BlinkingDot from "../OnlineDot/BlinkingDot";
const Picture = ({
  profilePic,
  name,
  height,
  width,
  marginBottom,
  border,
  marginLeft,
  withShadow,
  withShadowColor,
  onClick,
  online,
  searching,
}) => {
  // First ring (thin)
  const pulsingRingVariants = {
    start: {
      scale: 1,
      opacity: 1,
      boxShadow: `0px 0px 0px 2px ${COLORS.vividBlue}`, // Thin ring
    },
    end: {
      scale: 1.6, // Slightly expands
      opacity: 0,
      boxShadow: `0px 0px 10px 10px ${COLORS.vividBlue}`, // Same thin ring, fades
      transition: {
        duration: 2.5, // Slowed down pulse
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  // Second wider pulse overlay with the same color and larger thickness
  const ringOverlayVariants = {
    start: {
      scale: 1,
      opacity: 1,
      boxShadow: `0px 0px 0px 5px ${
        searching ? COLORS.vividBlue : COLORS.green
      }`, // Wider border, same color
    },
    end: {
      scale: 1.2, // Slightly expands (same as the first ring)
      opacity: 0,
      boxShadow: `0px 0px 10px 20px ${
        searching ? COLORS.vividBlue : COLORS.green
      }`, // Same thickness, fades
      transition: {
        duration: 2.5, // Slowed down pulse
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  return !!profilePic ? (
    !!profilePic.publicId ? (
      <CloudinaryContext cloudName="localmassagepros">
        <motion.div
          style={{ position: "relative", display: "inline-block" }}
          whileTap={{ scale: 0.7 }}
          onClick={onClick}
        >
          {/* First pulsing ring (thin) */}
          {searching && (
            <motion.div
              style={{
                position: "absolute",

                width: width, // Same size as the image
                height: height,
                borderRadius: "50%",
                zIndex: 0,
              }}
              variants={pulsingRingVariants}
              initial="start"
              animate="end"
            />
          )}

          {/* Second wider pulsing overlay for radar effect */}
          {searching && (
            <motion.div
              style={{
                position: "absolute",

                width: width, // Same size as the image
                height: height,
                borderRadius: "50%",
                zIndex: 0,
              }}
              variants={ringOverlayVariants}
              initial="start"
              animate="end"
            />
          )}

          {/* Profile Image */}
          <Image
            alt={`${name}-profile-pic`}
            style={{
              transition: "width 0.3s ease, height 0.3s ease", // Smooth transition for picture size
              borderRadius: "50%",
              backgroundColor: COLORS.black,
              marginLeft: marginLeft ? marginLeft : undefined,
              marginBottom: marginBottom ? marginBottom : undefined,
              border: `solid 1px ${COLORS.vividBlue}`,
              objectFit: "scale-down",
              boxShadow: withShadow
                ? `0px 2px 5px 2px ${
                    withShadowColor ? COLORS.pink : COLORS.darkGrey
                  }`
                : null,
              position: "relative",
              zIndex: 1, // Above the rings
            }}
            quality={100}
            publicId={profilePic.publicId}
            width={width}
            height={height}
          />
        </motion.div>
        {online && (
          <Box position="absolute" top={0}>
            <BlinkingDot online={online} />
          </Box>
        )}{" "}
      </CloudinaryContext>
    ) : (
      <motion.div
        style={{ position: "relative", display: "inline-block" }}
        whileTap={{ scale: 0.7 }}
        onClick={onClick}
      >
        {/* First pulsing ring (thin) */}
        {searching && (
          <motion.div
            style={{
              position: "absolute",

              width: width,
              height: height,
              borderRadius: "50%",
              zIndex: 0,
            }}
            variants={pulsingRingVariants}
            initial="start"
            animate="end"
          />
        )}

        {/* Second wider pulsing overlay */}
        {searching && (
          <motion.div
            style={{
              position: "absolute",
              width: width,
              height: height,
              borderRadius: "50%",
              zIndex: 0,
            }}
            variants={ringOverlayVariants}
            initial="start"
            animate="end"
          />
        )}

        {/* Fallback Image */}
        <img
          alt={`${name}-profile-pic`}
          style={{
            borderRadius: "50%",
            height,
            width,
            marginBottom: marginBottom ? marginBottom : undefined,
            imageRendering: "auto",
            objectFit: "cover",
            objectPosition: "center",
            transition: "width 0.3s ease, height 0.3s ease",
            position: "relative",
            zIndex: 1, // Above the rings
          }}
          src={profilePic.url}
        />
      </motion.div>
    )
  ) : (
    <Box>
      <Box
        borderRadius="50%"
        height={height}
        width={width}
        center
        background={COLORS.lightGrey}
        justifyContent="center"
        marginBottom={marginBottom ? marginBottom : undefined}
      >
        <Icon name="user" size={ICON_SIZES.XX_LARGE} color={COLORS.black} />
      </Box>
    </Box>
  );
};

export default Picture;
