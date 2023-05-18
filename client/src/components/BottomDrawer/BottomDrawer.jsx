import React, { Fragment, useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Box, Button, Text } from "..";
import { COLORS } from "../../constants";

const BottomDrawer = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const BUTTONS = [
    {
      name: "Report",
      color: COLORS.white,
      onClick: null,
      textColor: COLORS.red,
      marginTop: 20,
      marginBottom: 0,
      borderBottom: `solid 2px ${COLORS.black}`,
      boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
    },
    {
      name: "Block",
      color: COLORS.white,
      onClick: null,
      textColor: COLORS.red,
      marginTop: 0,
      marginBottom: 0,
      borderBottom: `solid 2px ${COLORS.black}`,
      boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
    },
    {
      name: "Cancel",
      color: COLORS.grey,
      onClick: onClose,
      textColor: COLORS.white,
      marginTop: 20,
      marginBottom: undefined,
      borderBottom: undefined,
      boxShadow: undefined,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Fragment>
      <motion.div
        animate={{
          height: !isOpen ? 0 : "30vh",
          background: !isOpen ? "rgba(0,0,0,0.0)" : "rgba(0,0,0,0.3)",
        }}
        transition={{ ease: "linear", duration: 0.7 }}
        style={drawerStyle(isOpen)}
      >
        <Box column width="100%" alignItems="center" paddingBottom={2}>
          {mounted &&
            BUTTONS.map((button, index) => (
              <Button
                key={index}
                width={"90%"}
                color={button.color}
                style={{
                  marginTop: button.marginTop,
                  marginBottom: button.marginBottom,
                  borderBottom: button.borderBottom,
                  boxShadow: button.boxShadow,
                }}
                onClick={button.onClick}
              >
                <Text bold color={button.textColor}>
                  {button.name}
                </Text>
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
  zIndex: 1001,
  borderTopRightRadius: 30,
  borderTopLeftRadius: 30,
});

export default BottomDrawer;
