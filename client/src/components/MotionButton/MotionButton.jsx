import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { COLORS } from "../../constants";
import { Text } from "../../components";

const StyledButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.isSelected ? COLORS.deepPurple : COLORS.lightPurple};
  border: 1px solid ${COLORS.pink};

  border-radius: 12px;
  box-shadow: ${(props) =>
    props.isSelected
      ? `0 0 10px ${COLORS.pink}`
      : `2px 2px 4px rgba(0, 0, 0, 0.3)`};
  color: ${(props) => (props.isSelected ? COLORS.white : COLORS.deepPurple)};
  cursor: pointer;
  padding: 10px 20px;
  margin: 10px;
  width: fit-content;
  height: 50px;
  outline: none;
  transform: ${(props) => (props.isSelected ? "scale(1.15)" : "scale(1)")};
  transition: transform 0.2s ease, background-color 0.2s ease,
    box-shadow 0.2s ease;
`;

const MotionButton = ({ isSelected, onClick, children }) => {
  return (
    <StyledButton
      isSelected={isSelected}
      onClick={onClick}
      animate={{ scale: isSelected ? 1.2 : 0.95 }}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.95 }}
    >
      <Text bold={isSelected ? true : false}>{children}</Text>
    </StyledButton>
  );
};

export default MotionButton;
