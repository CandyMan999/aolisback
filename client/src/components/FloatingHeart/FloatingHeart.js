import { motion } from "framer-motion";

import { COLORS } from "../../constants";
import { Icon, ICON_SIZES } from "../../components";

import styled from "styled-components";

const HeartIcon = styled(motion.div)`
  position: absolute;
  top: 50vh,
  left: 0,
  box-shadow: 0 0 20px 10px ${COLORS.red}50;
  border-radius: 50%;
 
`;

const moveX = () =>
  Math.random() > 0.5
    ? Math.floor(Math.random() * window.innerWidth)
    : -Math.floor(Math.random() * window.innerWidth);

const moveY = () => Math.floor(Math.random() * window.innerHeight);
const randomScale = () => {
  const SCALES = [1, 2, 3, 4, 5, 6, 7];

  return SCALES[Math.floor(Math.random() * 7)];
};

const randomColor = () => {
  const CHOICES = [
    COLORS.backgroundBlue,
    COLORS.papayaWhip,
    COLORS.pink,
    COLORS.purple,
    COLORS.backgroundGreen,
    COLORS.backgroundRed,
    COLORS.backgroundYellow,
    COLORS.blue,
    COLORS.vividBlue,
    COLORS.facebookBlue,
    COLORS.red,
    COLORS.gold,
    COLORS.yellow,
    COLORS.textBlue,
    COLORS.textYellow,
    COLORS.themeGreen,
    COLORS.googleRed,
    COLORS.darkBlue,
    COLORS.green,
    COLORS.lightBlue,
    COLORS.orange,
    COLORS.textGreen,
    COLORS.textRed,
  ];
  return CHOICES[Math.floor(Math.random() * 23)];
};
const FloatingHeart = () => {
  return (
    <HeartIcon
      animate={{
        x: [
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
          moveX(),
        ],
        y: [
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
          moveY(),
        ],
        scale: [
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
          randomScale(),
        ],
        backgroundColor: [
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
          randomColor(),
        ],
        boxShadow: [
          `0 0 20px 10px ${COLORS.red}50`,
          `0 0 50px 20px ${COLORS.vividBlue}50`,
          `0 0 80px 30px ${COLORS.orange}50`,
          `0 0 50px 20px ${COLORS.pink}50`,
          `0 0 20px 10px ${COLORS.red}50`,
          `0 0 30px 20px ${COLORS.orange}50`,
          `0 0 50px 30px ${COLORS.pink}50`,
          `0 0 30px 20px ${COLORS.orange}50`,
          `0 0 20px 10px ${COLORS.themeGreen}50`,
          `0 0 30px 20px ${COLORS.green}50`,
          `0 0 20px 10px ${COLORS.yellow}50`,
          `0 0 40px 30px ${COLORS.blue}50`,
        ],
      }}
      transition={{
        duration: 100,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <Icon name="heart" color={COLORS.red} size={ICON_SIZES.XX_LARGE} />
    </HeartIcon>
  );
};

export default FloatingHeart;
