import React from "react";
import { Box, NavScreen } from "../../components";

import ChatBox from "../chatBox";

const HomeLayout = ({ state, dispatch }) => {
  const height = window.innerHeight;

  return (
    <Box
      justifyContent="space-around"
      height={height - 60}
      width="100vW"
      display="flex"
    >
      <NavScreen
        showScreen={state.currentUser.username && state.showNavScreen}
        dispatch={dispatch}
      />
      <ChatBox />
    </Box>
  );
};

export default HomeLayout;
