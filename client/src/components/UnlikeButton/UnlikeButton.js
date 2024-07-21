import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";

const UnlikeButton = ({ onClick, disabled, dontScale, type }) => (
  <StyledButton
    whileTap={{ scale: 0.7 }}
    whileHover={{ scale: dontScale ? 1 : 1.1 }}
    onClick={disabled ? undefined : onClick}
    type={type || "button"}
  >
    👎💔
  </StyledButton>
);

const StyledButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: ${COLORS.black};
  border: none;
  flex-direction: row;
  border-radius: 40px;
  box-shadow: 2px 2px 4px 2px ${COLORS.pink};
  height: 80px;
  width: 80px;
  font-size: 24px;
  cursor: pointer;
  outline: none;
  position: absolute;
  top: 2px;
  left: 10px;
  margin-top: 2px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export default UnlikeButton;
