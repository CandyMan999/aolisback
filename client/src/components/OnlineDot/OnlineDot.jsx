import React from "react";
import { motion } from "framer-motion";

import { COLORS } from "../../constants";

const OnlineDot = ({ online }) => {
  const outerDotVariants = {
    start: {
      scale: 1,
      opacity: 1,
      boxShadow: `0px 0px 0px 0px ${COLORS.green}`,
      transition: {
        duration: 1.5,
        loop: Infinity,
      },
    },
    end: {
      scale: 1.5,
      opacity: 0,
      boxShadow: `0px 0px 20px 8px ${COLORS.green}`,
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
      scale: 3,
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
          backgroundColor: COLORS.green,
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
            backgroundColor: online ? COLORS.green : COLORS.red,
            marginRight: "5px",
          }}
          variants={online ? outerDotVariants : {}}
          initial="start"
          animate={online ? "end" : {}}
        >
          {online && (
            <motion.div
              style={{
                width: "7px",
                height: "6px",
                borderRadius: "50%",
                border: `2px solid ${COLORS.green}`,
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
