import React, { Fragment } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";
import { Loading } from "../../components";

const UnlikeButton = ({ onClick, disabled, dontScale, type, loading }) => (
  <StyledButton
    whileTap={{ scale: 0.7 }}
    whileHover={{ scale: dontScale ? 1 : 1.1 }}
    onClick={disabled ? undefined : onClick}
    type={type || "button"}
  >
    <Fragment>
      {loading ? (
        <Loading ring />
      ) : (
        <Fragment>
          <span role="img" aria-label="thumbs-down">
            👎
          </span>
          <span role="img" aria-label="broken-heart">
            💔
          </span>
        </Fragment>
      )}
    </Fragment>
  </StyledButton>
);

const StyledButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: ${COLORS.black};
  border: none;
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

  span {
    font-size: 24px;
    line-height: 1; /* Ensures emojis are aligned properly */
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export default UnlikeButton;
