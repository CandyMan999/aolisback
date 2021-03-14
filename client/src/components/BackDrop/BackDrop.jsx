import React from "react";
import { Box } from "../../components";

const BackDrop = ({ onClose }) => {
  return (
    <Box
      position="fixed"
      width="100%"
      height="100%"
      top={0}
      left={0}
      background="rgba(0,0,0,0.3)"
      zIndex={100}
      onClick={onClose}
    />
  );
};

export default BackDrop;
