import React from "react";
import { Text, FONT_SIZES, AnimatedHand } from "../../components";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";

const JoinARoom = ({ isPointingDown }) => {
  const styles = () => {
    let style = {};
    if (!isPointingDown) {
      style = {
        // textShadow:
        //   "-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black",
        color: COLORS.vividBlue,
      };
    } else {
      style = {
        textShadow:
          "-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white",
        color: "black",
      };
    }
    return style;
  };
  const letters = [
    <Text bold fontSize={FONT_SIZES.XX_LARGE} style={styles()}>
      J
    </Text>,
    <Text bold fontSize={FONT_SIZES.XX_LARGE} style={styles()}>
      o
    </Text>,
    <Text bold fontSize={FONT_SIZES.XX_LARGE} style={styles()}>
      i
    </Text>,
    <Text bold fontSize={FONT_SIZES.XX_LARGE} style={styles()}>
      n
    </Text>,

    <Text bold fontSize={FONT_SIZES.XX_LARGE} style={styles()}>
      A
    </Text>,

    <Text bold fontSize={FONT_SIZES.XX_LARGE} style={styles()}>
      R
    </Text>,
    <Text bold fontSize={FONT_SIZES.XX_LARGE} style={styles()}>
      o
    </Text>,
    <Text bold fontSize={FONT_SIZES.XX_LARGE} style={styles()}>
      o
    </Text>,
    <Text bold fontSize={FONT_SIZES.XX_LARGE} style={styles()}>
      m
    </Text>,

    <AnimatedHand isPointingDown={isPointingDown} />,
  ];
  return letters.map((letter, index) => {
    return (
      <motion.span
        key={index}
        style={{
          display: "inline-block",
          marginRight: index === 3 || index === 4 ? "10px" : undefined,
          zIndex: 200,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.2 },
        }}
        exit={{ opacity: 0, y: -20 }}
      >
        {letter}
      </motion.span>
    );
  });
};

export default JoinARoom;
