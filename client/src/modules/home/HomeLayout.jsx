import React from "react";
import { Box } from "../../components";

import ChatBox from "../chatBox";

const HomeLayout = () => {
  return (
    <Box
      justifyContent="space-around"
      height="calc(100vh - 64px)"
      width="100vW"
      display="flex"
    >
      <ChatBox />
    </Box>
  );
};

export default HomeLayout;
