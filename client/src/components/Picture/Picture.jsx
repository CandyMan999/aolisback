import React from "react";
import { Image, CloudinaryContext } from "cloudinary-react";
import { Box, Icon, ICON_SIZES } from "..";
import { COLORS } from "../../constants";

const Picture = ({ profilePic, name, height, width, marginBottom }) => {
  return !!profilePic ? (
    !!profilePic.publicId ? (
      <CloudinaryContext cloudName="localmassagepros">
        <Image
          alt={`${name}-profile-pic`}
          style={{
            borderRadius: "50%",
            height,
            width,
            marginBottom: marginBottom ? marginBottom : undefined,
          }}
          loading="lazy"
          quality="auto:best"
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
          marginBottom: marginBottom ? marginBottom : undefined,
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
        marginBottom={marginBottom ? marginBottom : undefined}
      >
        <Icon name="user" size={ICON_SIZES.XX_LARGE} color={COLORS.black} />
      </Box>
    </Box>
  );
};

export default Picture;
