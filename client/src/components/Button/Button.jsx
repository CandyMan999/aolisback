import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";

const Button = (props) => (
  <StyledButton
    whileTap={{ scale: 0.7 }}
    whileHover={{ scale: props.dontScale ? 1 : 1.1 }}
    {...props}
    type={props.type || "submit"}
    onClick={props.disabled ? undefined : props.onClick}
  />
);

const StyledButton = styled(motion.button)(
  ({
    active,
    disabled,
    minimal,
    inverse,
    color,
    width,
    size,
    fontSize,
    // coolStyle,
    padding,
  }) => ({
    border: "none",
    borderRadius: "4px",
    fontSize: fontSize ? fontSize : "14px",
    padding: padding ? padding : size === "small" ? "4px" : "8px",
    margin: "8px 16px",
    width: width || "86px",
    cursor: disabled ? "not-allowed" : "pointer",
    color: !minimal ? COLORS.white : undefined,
    // boxShadow: coolStyle
    //   ? `2px 2px 4px 2px ${COLORS.pink}`
    //   : `2px 2px 4px 2px ${COLORS.lightGrey}`,
    transition: "color 0.4s, background-color 0.4s",

    backgroundColor: color
      ? color
      : minimal
      ? COLORS.white
      : active
      ? COLORS.vividBlue
      : disabled
      ? `${COLORS.grey}88`
      : COLORS.blue,
    [":focus"]: {
      outline: 0,
    },
  }),
  ({ critical, disabled }) =>
    critical &&
    !disabled && {
      color: COLORS.white,
      backgroundColor: COLORS.red,
    }
);

export default Button;
