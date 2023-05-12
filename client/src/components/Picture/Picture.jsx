import React from "react";
import { Image, CloudinaryContext } from "cloudinary-react";
import { Box, Icon, ICON_SIZES } from "..";
import { COLORS } from "../../constants";

const Picture = ({ profilePic, name, height, width }) => {
  return !!profilePic ? (
    !!profilePic.publicId ? (
      <CloudinaryContext cloudName="localmassagepros">
        <Image
          alt={`${name}-profile-pic`}
          style={{
            borderRadius: "50%",
            height,
            width,
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
          height,
          width,
          marginBottom: "8px",
        }}
        src={profilePic.url}
      />
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
        marginBottom={8}
      >
        <Icon name="user" size={ICON_SIZES.XX_LARGE} color={COLORS.black} />
      </Box>
    </Box>
  );
};

export default Picture;
