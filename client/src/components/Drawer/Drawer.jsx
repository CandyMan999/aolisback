// Drawer.jsx
import React, { Fragment, useEffect } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { motion } from "framer-motion";

import { Box, BackDrop, Icon, ICON_SIZES } from "..";
import { COLORS } from "../../constants";

const Drawer = ({ isOpen, onClose, children }) => {
  const mobile = useMediaQuery("(max-width: 800px)");

  // Lock body scroll when the drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Compensate for body scrollbar to avoid layout shift
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) {
      document.body.style.paddingRight = `${scrollbarW}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  return (
    <Fragment>
      {isOpen && <BackDrop onClose={onClose} mobile={mobile} />}

      <motion.div
        animate={{ width: isOpen ? (mobile ? "100%" : 800) : 0 }}
        transition={{ ease: "linear", duration: 0.5 }}
        style={{
          // Use viewport height for stability
          height: mobile ? "100vh" : "85vh",
          backgroundColor: COLORS.white,
          boxShadow: "2px 0px 5px rgba(0,0,0,0.5)",
          position: "fixed",
          bottom: 0,
          left: 0,
          borderRadius: mobile ? "" : "0px 5px 5px 0px",
          zIndex: 20000,
          // IMPORTANT: do NOT scroll this element; scroll only the inner pane
          overflow: "hidden",
          willChange: "width",
        }}
      >
        {/* Close icon stays outside the scrollable area */}
        <Box position="absolute" top={15} right={10} zIndex={20000}>
          <Icon
            clickable
            name="back"
            color={COLORS.pink}
            size={ICON_SIZES.XXX_LARGE}
            onClick={onClose}
          />
        </Box>

        {/* Single, dedicated scroll container */}
        <div
          style={{
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain", // prevent scroll chaining to body
          }}
        >
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
        </div>
      </motion.div>
    </Fragment>
  );
};

export default Drawer;
