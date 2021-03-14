import React from "react";
import {
  PulseLoader,
  BarLoader,
  FadeLoader,
  GridLoader,
  RingLoader,
} from "react-spinners";

import { Box } from "..";
import { COLORS } from "../../constants";

const Loading = ({ bar, fade, grid, ring, size, color }) => {
  let Loader = PulseLoader;

  if (bar) Loader = BarLoader;
  if (fade) Loader = FadeLoader;
  if (grid) Loader = GridLoader;
  if (ring) Loader = RingLoader;

  return (
    <Box width="100%" height="100%" justifyContent="center" center>
      <Loader
        sizeUnit="px"
        size={size || 20}
        color={color || COLORS.vividBlue}
      />
    </Box>
  );
};

export default Loading;
