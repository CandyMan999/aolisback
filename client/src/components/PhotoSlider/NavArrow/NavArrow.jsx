import React from "react";
import { Box, Icon, ICON_SIZES } from "../..";
import { COLORS } from "../../../constants";

const NavArrow = ({ onClick, direction }) => (
  <Box
    borderRadius="50%"
    onClick={onClick}
    background={COLORS.white}
    hoverBackground={COLORS.lightBlue}
  >
    <Icon
      name={`${direction}Arrow`}
      size={ICON_SIZES.X_LARGE}
      color={COLORS.darkestGrey}
    />
  </Box>
);

export default NavArrow;
