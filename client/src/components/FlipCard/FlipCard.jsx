import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Icon, ICON_SIZES } from "../../components";
import { COLORS } from "../../constants";

const FlipCard = ({
  frontContent,
  backContent,
  openModal,
  showModal,
  state,
}) => {
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

  const handleCardClick = async () => {
    await setSide(side === "front" ? "back" : "front");
    setIsFlipped(!isFlipped);
  };

  return (
    <Box position="relative" height={300} width={170}>
      <AnimatePresence>
        <motion.div
          onClick={handleCardClick}
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
          <Box
            position="absolute"
            zIndex={20}
            top={10}
            left={10}
            onClick={handleCardClick}
          >
            <Icon name="back" size={ICON_SIZES.LARGE} color={COLORS.black} />
          </Box>

          {backContent}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default FlipCard;
