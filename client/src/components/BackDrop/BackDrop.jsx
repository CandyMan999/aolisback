import React from "react";
import { Box } from "../../components";
import "./backDrop.css";

const BackDrop = ({ onClose, mobile }) => {
  return (
    <Box
      id="backDrop"
      position="fixed"
      width="100%"
      height="100%"
      top={0}
      left={0}
      background="rgba(0,0,0,0.3)"
      zIndex={100}
      onClick={mobile ? undefined : onClose}
    />
  );
};

export default BackDrop;
