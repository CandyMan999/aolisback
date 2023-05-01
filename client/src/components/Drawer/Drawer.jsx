import React, { Fragment } from "react";
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
        animate={{ width: isOpen ? (mobile ? "100%" : 800) : 0 }}
        transition={{ ease: "linear", duration: 0.5 }}
        style={{
          height: mobile ? "100%" : `85%`,
          backgroundColor: COLORS.white,
          boxShadow: "2px 0px 5px rgba(0,0,0,0.5)",
          position: "fixed",
          top: mobile ? 0 : 100,
          left: 0,
          borderRadius: mobile ? "" : "0px 5px 5px 0px",
          zIndex: 200,
          overflow: "scroll",
        }}
      >
        <Box position="absolute" top={30} left={10} zIndex={20000}>
          <Icon
            clickable
            name="back"
            color={COLORS.black}
            size={ICON_SIZES.XX_LARGE}
            onClick={onClose}
          />
        </Box>
        {isOpen && (
          <Box position="absolute" column width="100%" justifyContent="center">
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
