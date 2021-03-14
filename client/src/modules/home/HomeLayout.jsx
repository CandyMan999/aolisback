import { Drawer } from "@material-ui/core";
import React, { Component } from "react";
import { Box, Text } from "../../components";
import { COLORS } from "../../constants";
import ChatBox from "../chatBox";

const HomeLayout = ({}) => {
  return (
    <Box
      justifyContent="space-around"
      height="calc(100vh - 64px)"
      width="100vw"
      display="flex"
    >
      <ChatBox />
    </Box>
  );
};

export default HomeLayout;
