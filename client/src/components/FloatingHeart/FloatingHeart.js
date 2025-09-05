import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const HeartIcon = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 2rem; /* Default font size */
`;

const MatchText = styled(motion.div)`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-size: 3rem;
  font-family: "Cursive";
  color: pink;
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

const FloatingHeart = ({ activate, isMatch }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (activate) {
      setShow(true);
      handleSetShow();
    }
  }, [activate]);

  const handleSetShow = () => {
    setTimeout(() => {
      setShow(false);
    }, 6000);
  };

  return (
    <>
      {show &&
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
      {isMatch && (
        <MatchText
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: -100, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          exit={{ opacity: 0, transition: { delay: 3, duration: 1 } }}
        >
          IT's A Match!
        </MatchText>
      )}
    </>
  );
};

export default FloatingHeart;
