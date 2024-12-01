// MatchScreen.js

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import { COLORS } from "../../constants";
import { Box, Text, FONT_SIZES } from "../../components";

// Styled Components
const Overlay = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  background: #fff;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: ${(props) => (props.showScreen === true ? "60vh" : "0vh")};
  border-top-left-radius: 20px; /* Rounded top-left corner */
  border-top-right-radius: 20px; /* Rounded top-right corner */
  overflow: hidden; /* Prevent overflow during animation */
`;

const CardsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 250px;
  margin-top: -50px;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: ${(props) =>
    props.custom === "left" ? "rotate(-18deg)" : "rotate(18deg)"};
  margin: 0 10px;
`;

const UserCard = styled(motion.div)`
  width: 170px;
  height: 220px;
  background-image: url("${(props) => props.image}");
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Username = styled.h2`
  font-size: 20px;
  color: #333;
  margin-top: 10px;
  transform: ${(props) =>
    props.custom === "left" ? "rotate(15deg)" : "rotate(-15deg)"};
`;

const MatchTextContainer = styled(motion.div)`
  width: 300px;
  height: 100px;
  margin-bottom: 20px;
`;

const CloseIcon = styled(AiOutlineClose)`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 30px;
  color: #333;
  cursor: pointer;
`;

// Animation Variants
const overlayVariants = {
  hidden: { height: 0 },
  visible: { height: "60vh", transition: { duration: 0.2 } },
};

const cardVariants = {
  initial: (custom) => ({
    x: custom === "left" ? "-100vw" : "100vw",
    rotate: 0,
  }),
  animate: {
    x: 0,
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.5, duration: 0.5 },
  },
};
const HeartIcon = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 2rem; /* Default font size */
`;

const moveX = () => Math.random() * window.innerWidth;
const moveY = () => Math.random() * window.innerHeight;
const randomScale = () => Math.random() * 1.5 + 0.5; // Random scale between 0.5 and 2
const randomEmoji = () => {
  const EMOJIS = [
    "❤️",
    "💛",
    "💚",
    "💙",
    "💜",
    "🧡",
    "💖",
    "💗",
    "💓",
    "💞",
    "💘",
    "💕",
    "❤️‍🔥",
    "🫶",
    "💋",
  ];
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
};

const MatchScreen = ({ matchedUser, currentUser, onClose, showScreen }) => {
  // Ensure image URLs are correct
  const currentUserImage = currentUser.pictures[0]?.url;
  const matchedUserImage = matchedUser?.pictures[0]?.url;
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    setShowHearts(true);
  }, []);

  return (
    <AnimatePresence>
      {matchedUser && showScreen && (
        <Overlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <CloseIcon onClick={onClose} />
          <MatchTextContainer
            variants={textVariants}
            initial="hidden"
            animate="visible"
            style={{ position: "absolute", top: 0 }}
          >
            <svg width="300" height="100">
              <defs>
                <path
                  id="curve"
                  d="M50,100 Q150,0 250,100"
                  fill="transparent"
                />
              </defs>
              <text
                width="300"
                style={{
                  fontFamily: "Cursive",
                  fontSize: "48px",
                  fill: COLORS.pink,
                  fontWeight: "bolder",
                }}
              >
                <textPath
                  xlinkHref="#curve"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  It's a Match!
                </textPath>
              </text>
            </svg>
          </MatchTextContainer>
          <CardsContainer style={{ marginTop: 30 }}>
            <CardWrapper custom="left">
              <UserCard
                custom="left"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                image={currentUserImage}
                style={{ zIndex: 2 }}
              />
              <Username custom="left">{currentUser.username}</Username>
            </CardWrapper>
            {/* <Box
              style={{
                position: "fixed",
                top: 0,
                zIndex: -10,
              }}
            >
              <Text style={{ fontSize: "300px" }}>💘</Text>
            </Box> */}
            <CardWrapper custom="right">
              <UserCard
                custom="right"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                image={matchedUserImage}
                style={{ zIndex: 1 }}
              />
              <Username custom="right">{matchedUser.username}</Username>
            </CardWrapper>
          </CardsContainer>
          {showHearts &&
            Array.from({ length: 20 }, (_, index) => (
              <HeartIcon
                key={index}
                initial={{ x: moveX(), opacity: 1, visibility: "visible" }}
                animate={{
                  x: [moveX(), moveX(), moveX(), moveX(), moveX()],
                  y: [moveY(), -600],
                  scale: [randomScale(), randomScale()],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                style={{ fontSize: `${randomScale()}rem` }}
              >
                {randomEmoji()}
              </HeartIcon>
            ))}
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default MatchScreen;
