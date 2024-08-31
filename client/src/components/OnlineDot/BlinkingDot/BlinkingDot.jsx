import React from "react";
import { motion } from "framer-motion";
import { COLORS } from "../../../constants";

const BlinkingDot = ({ online, inCall }) => {
  const outerDotVariants = {
    start: {
      scale: 1,
      opacity: 1,
      boxShadow: `0px 0px 0px 0px ${inCall ? COLORS.vividBlue : COLORS.green}`,
      transition: {
        duration: 1.5,
        loop: Infinity,
      },
    },
    end: {
      scale: inCall ? 2 : 1.5,
      opacity: 0,
      boxShadow: `0px 0px 20px 8px ${inCall ? COLORS.vividBlue : COLORS.green}`,
      transition: {
        duration: 2.5,
        loop: Infinity,
      },
    },
  };

  const ringOverlayVariants = {
    start: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        loop: Infinity,
      },
    },
    end: {
      scale: inCall ? 4 : 3,
      opacity: 0,
      transition: {
        duration: 2.5,
        loop: Infinity,
      },
    },
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: inCall ? COLORS.vividBlue : COLORS.green,
          margin: "4px",
        }}
      >
        <motion.div
          style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: inCall
              ? COLORS.vividBlue
              : online
              ? COLORS.green
              : COLORS.red,
            marginRight: "5px",
          }}
          variants={online || inCall ? outerDotVariants : {}}
          initial="start"
          animate={online || inCall ? "end" : {}}
        >
          {(online || inCall) && (
            <motion.div
              style={{
                width: "7px",
                height: "6px",
                borderRadius: "50%",
                border: `2px solid ${inCall ? COLORS.vividBlue : COLORS.green}`,
              }}
              variants={online ? ringOverlayVariants : {}}
              initial="start"
              animate={online ? "end" : {}}
            />
          )}
        </motion.div>
      </div>

      <motion.p
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: inCall
            ? COLORS.vividBlue
            : online
            ? COLORS.green
            : COLORS.black,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      ></motion.p>
    </div>
  );
};

export default BlinkingDot;
