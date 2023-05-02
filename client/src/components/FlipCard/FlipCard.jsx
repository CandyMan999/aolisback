import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box } from "../../components";

const FlipCard = ({ frontContent, backContent }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [side, setSide] = useState("front");

  const frontFaceVariants = {
    unflipped: {
      opacity: 1,
      rotateY: 0,
    },
    flipped: {
      opacity: 0,
      rotateY: -180,
    },
  };

  const backFaceVariants = {
    unflipped: {
      opacity: 0,
      rotateY: 180,
    },
    flipped: {
      opacity: 1,
      rotateY: 0,
    },
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    setSide(side === "front" ? "back" : "front");
  };

  return (
    <Box position="relative" height={300} width={170} onClick={handleCardClick}>
      <AnimatePresence>
        <motion.div
          key="front-face"
          className="flip-card-front"
          variants={frontFaceVariants}
          initial="unflipped"
          animate={isFlipped ? "flipped" : "unflipped"}
          exit="unflipped"
          transition={{ duration: 0.5 }}
          style={{
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
            position: "absolute",
          }}
        >
          {frontContent}
        </motion.div>
        <motion.div
          key="back-face"
          className="flip-card-back"
          variants={backFaceVariants}
          initial="unflipped"
          animate={isFlipped ? "flipped" : "unflipped"}
          exit="unflipped"
          transition={{ duration: 0.5 }}
          style={{
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
            position: "absolute",
          }}
        >
          {backContent}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default FlipCard;
