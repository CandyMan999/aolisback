import React, { Fragment } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { motion } from "framer-motion";

import { Box, BackDrop, Icon, ICON_SIZES } from "..";
import { COLORS } from "../../constants";

const Drawer = ({ isOpen, onClose, children }) => {
  const mobile = useMediaQuery("(max-width: 800px)");

  return (
    <Fragment>
      {isOpen && <BackDrop onClose={onClose} mobile={mobile} />}

      <motion.div
        animate={{ width: isOpen ? (mobile ? "100%" : 800) : 0 }}
        transition={{ ease: "linear", duration: 0.5 }}
        style={{
          height: mobile ? "100%" : `85%`,
          backgroundColor: COLORS.white,
          boxShadow: "2px 0px 5px rgba(0,0,0,0.5)",
          position: "fixed",
          bottom: 0,
          left: 0,
          borderRadius: mobile ? "" : "0px 5px 5px 0px",
          zIndex: 20000,
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        <Box position="absolute" top={15} right={10} zIndex={20000}>
          <Icon
            clickable
            name="back"
            color={COLORS.pink}
            size={ICON_SIZES.XXX_LARGE}
            onClick={onClose}
          />
        </Box>
        {isOpen && (
          <Box
            column
            width="100%"
            justifyContent="space-between"
            minHeight={"100%"}
          >
            {children}
          </Box>
        )}
      </motion.div>
    </Fragment>
  );
};

export default Drawer;
