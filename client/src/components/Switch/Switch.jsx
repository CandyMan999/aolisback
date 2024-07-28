// Switch.js
import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { COLORS } from "../../constants";

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 25px;
  background-color: ${(props) =>
    props.checked ? COLORS.vividBlue : COLORS.lightGrey};
  border-radius: 25px;
  cursor: pointer;
  position: relative;
`;

const SwitchCircle = styled(motion.div)`
  width: 20px;
  height: 20px;
  background-color: ${COLORS.white};
  border-radius: 50%;
  position: absolute;
  ${"" /* border: solid 1px ${COLORS.black}, */}
  left: ${(props) => (props.checked ? "calc(100% - 20px)" : "2px")};
`;

const Switch = ({ checked, onChange }) => {
  return (
    <SwitchContainer
      style={{ border: `solid 1px ${COLORS.lightGrey}` }}
      checked={checked}
      onClick={onChange}
    >
      <SwitchCircle
        style={{ border: `solid 1px ${COLORS.lightGrey}` }}
        checked={checked}
        animate={{ x: checked ? -1 : 1 }}
        transition={{ type: "spring", stiffness: 300, duration: 0.5 }}
      />
    </SwitchContainer>
  );
};

export default Switch;
