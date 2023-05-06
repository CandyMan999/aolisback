import React from "react";
import { motion } from "framer-motion";
import BlinkingDot from "./BlinkingDot";
import { COLORS } from "../../constants";

const OnlineDot = ({ online }) => {
  const dotVariants = {
    start: {
      scale: 1,
      opacity: 1,

      transition: {
        duration: 0.4,
        yoyo: Infinity,
      },
    },
    end: {
      scale: 1.3,
      opacity: 0.3,

      transition: {
        duration: 0.4,
        yoyo: Infinity,
      },
    },
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <motion.div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: online ? COLORS.green : COLORS.red,
          marginRight: "5px",
        }}
        variants={online ? dotVariants : {}}
        initial="start"
        animate={online ? "end" : {}}
      />
      <motion.p
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: online ? COLORS.green : COLORS.black,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {online ? "Online" : "Offline"}
      </motion.p>
    </div>
  );
};

export default OnlineDot;
