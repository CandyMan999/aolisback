import React, { Fragment, Children } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { motion } from "framer-motion";

import { Box, Text, BackDrop, Icon, ICON_SIZES } from "..";
import { COLORS } from "../../constants";

const Drawer = ({ isOpen, onClose, title, children }) => {
  const mobile = useMediaQuery("(max-width: 650px)");

  return (
    <Fragment>
      {isOpen && <BackDrop onClose={onClose} />}

      <motion.div
        animate={{ width: isOpen ? (mobile ? 300 : 800) : 0 }}
        transition={{ ease: "linear", duration: 0.5 }}
        style={{
          height: "80%",
          backgroundColor: COLORS.darkestGrey,
          boxShadow: "2px 0px 5px rgba(0,0,0,0.5)",
          position: "fixed",
          top: 100,
          left: 0,
          borderRadius: "0px 5px 5px 0px",
          zIndex: 200,
          overflow: "scroll",
        }}
      >
        <Box position="absolute" top={6} right={6} zIndex={2}>
          <Icon
            clickable
            name="close"
            color={COLORS.white}
            size={ICON_SIZES.LARGE}
            onClick={onClose}
          />
        </Box>
        {isOpen && (
          <Box
            position="absolute"
            column
            top={6}
            width="100%"
            justifyContent="center"
          >
            <Text center color={COLORS.white} bold>
              {title}
            </Text>
            {children}
          </Box>
        )}
      </motion.div>
    </Fragment>
  );
};

export default Drawer;
