import React, { Fragment } from "react";
import { motion } from "framer-motion";

import { Box, Button } from "..";
import { COLORS } from "../../constants";

const BottomDrawer = ({ isOpen, onClose }) => {
  const BUTTONS = [
    { name: "Report", color: COLORS.red, onClick: null },
    { name: "Block", color: COLORS.red, onClick: null },
    { name: "Cancel", color: COLORS.grey, onClick: onClose },
  ];

  return (
    <Fragment>
      <motion.div
        animate={{ height: !isOpen ? 0 : "60vh" }}
        transition={{ ease: "linear", duration: 0.7 }}
        style={drawerStyle(isOpen)}
        // onClick={onClose}
      >
        <Box column width="100%" alignItems="center" paddingBottom={2}>
          {BUTTONS.map((button, index) => (
            <Button
              key={index}
              width={"80%"}
              color={button.color}
              style={{ marginTop: index === 0 ? 40 : 10 }}
              marginBottom={10}
              onClick={button.onClick}
            >
              {button.name}
            </Button>
          ))}
        </Box>
      </motion.div>
    </Fragment>
  );
};

const drawerStyle = (isOpen) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100vw",
  height: isOpen ? "60vh" : 0,
  background: "rgba(0,0,0,0.3)",
  zIndex: 1001,
  borderTopRightRadius: 30,
  borderTopLeftRadius: 30,
});

export default BottomDrawer;
