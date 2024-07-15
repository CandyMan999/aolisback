import React from "react";
import { motion } from "framer-motion";
import { Image, CloudinaryContext } from "cloudinary-react";
import { Box, Icon, ICON_SIZES } from "..";
import { COLORS } from "../../constants";

const Picture = ({
  profilePic,
  name,
  height,
  width,
  marginBottom,
  border,
  marginLeft,
  withShadow,
}) => {
  return !!profilePic ? (
    !!profilePic.publicId ? (
      <CloudinaryContext cloudName="localmassagepros">
        <motion.div whileTap={{ scale: 0.7 }}>
          <Image
            alt={`${name}-profile-pic`}
            style={{
              borderRadius: "50%",
              backgroundColor: COLORS.black,
              marginLeft: marginLeft ? marginLeft : undefined,
              marginBottom: marginBottom ? marginBottom : undefined,
              border: `solid 1px ${COLORS.vividBlue}`,
              objectFit: "scale-down",
              boxShadow: withShadow
                ? `2px 2px 4px 2px ${COLORS.darkGrey}`
                : null,
            }}
            quality={100}
            publicId={profilePic.publicId}
            width={width}
            height={height}
          />
        </motion.div>
      </CloudinaryContext>
    ) : (
      <motion.div whileTap={{ scale: 0.7 }}>
        <img
          alt={`${name}-profile-pic`}
          style={{
            borderRadius: "50%",
            height,
            width,
            marginBottom: marginBottom ? marginBottom : undefined,
            imageRendering: "auto", // or "crisp-edges" or "pixelated"
            objectFit: "cover", // or "contain" or "none"
            objectPosition: "center",
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
