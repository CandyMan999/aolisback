import React from "react";
import {
  PulseLoader,
  BarLoader,
  FadeLoader,
  GridLoader,
  RingLoader,
} from "react-spinners";
import { motion } from "framer-motion";
import iOSLogo from "../../pictures/iOSLogo.png";

import { Box } from "..";
import { COLORS } from "../../constants";

const Loading = ({ bar, fade, grid, ring, size, color, logo, width }) => {
  let Loader = PulseLoader;

  if (bar) Loader = BarLoader;
  if (fade) Loader = FadeLoader;
  if (grid) Loader = GridLoader;
  if (ring) Loader = RingLoader;
  if (logo)
    Loader = (
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ loop: Infinity, duration: 1, ease: "linear" }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          height={size ? size : 100}
          width={size ? size : 100}
          src={iOSLogo}
          alt="Watermark-logo"
        />
      </motion.div>
    );

  return (
    <Box
      width={width ? width : "100%"}
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      {logo ? (
        Loader
      ) : (
        <Loader
          sizeUnit="px"
          size={size || 20}
          color={color || COLORS.vividBlue}
        />
      )}
    </Box>
  );
};

export default Loading;
