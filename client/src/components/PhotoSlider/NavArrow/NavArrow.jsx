import React from "react";
import { Box, Icon, ICON_SIZES } from "../..";
import { COLORS } from "../../../constants";

const NavArrow = ({ onClick, direction }) => (
  <Box
    borderRadius="50%"
    onClick={onClick}
    background={COLORS.white}
    hoverBackground={COLORS.vividBlue}
  >
    <Icon
      padding={0}
      name={`${direction}Arrow`}
      size={ICON_SIZES.XX_LARGE}
      color={COLORS.darkestGrey}
    />
  </Box>
);

export default NavArrow;
