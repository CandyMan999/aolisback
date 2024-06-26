import React from "react";
import { motion } from "framer-motion";
import { Icon, ICON_SIZES } from "../../components";
import { COLORS } from "../../constants";

const AnimatedHand = ({ isPointingDown }) => {
  return (
    <motion.div
      style={{ position: "relative", zIndex: 2 }}
      animate={{
        scale: [1, 2, 2, 1, 1],
        rotate: [0, 0, 720, 720, 0],
        zIndex: [0, 20000, 20000, 20000, 0],
      }}
      transition={{
        duration: 1,

        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
        loop: Infinity,
        repeatDelay: 1,
      }}
    >
      <Icon
        style={{ bottom: 0 }}
        name={isPointingDown ? "handPointDown" : "handpointRight"}
        size={ICON_SIZES.XXX_LARGE}
        color={COLORS.vividBlue}
      />
    </motion.div>
  );
};

export default AnimatedHand;
