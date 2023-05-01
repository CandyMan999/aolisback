import React from "react";
import { Box, FloatingHeart } from "../../components";
import { range } from "lodash";

import ChatBox from "../chatBox";

const HomeLayout = ({ state }) => {
  const height = window.innerHeight;

  console.log("State: ", state);

  return (
    <Box
      justifyContent="space-around"
      height={height - 64}
      width="100vW"
      display="flex"
    >
      {state &&
        state.currentUser &&
        !state.currentUser.username &&
        range(4).map((index) => <FloatingHeart key={index} />)}

      <ChatBox />
    </Box>
  );
};

export default HomeLayout;
