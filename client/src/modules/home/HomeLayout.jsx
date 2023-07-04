import React from "react";
import { Box } from "../../components";

import ChatBox from "../chatBox";

const HomeLayout = ({ state }) => {
  const height = window.innerHeight;

  return (
    <Box
      justifyContent="space-around"
      height={height - 64}
      width="100vW"
      display="flex"
    >
      <ChatBox />
    </Box>
  );
};

export default HomeLayout;
