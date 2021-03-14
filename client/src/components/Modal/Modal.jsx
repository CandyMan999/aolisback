import React from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { withStyles } from "@material-ui/core/styles";

import { Box, Icon, ICON_SIZES, Loading } from "..";

import { COLORS } from "../../constants";

const Modal = ({ children, isLoading, onClose, height, width, classes }) => (
  <Box
    background={`${COLORS.darkestGrey}CC`}
    bottom={0}
    center
    justifyContent="center"
    left={0}
    position="fixed"
    right={0}
    top={0}
    zIndex={10000}
  >
    <OutsideClickHandler onOutsideClick={onClose}>
      <Box
        background={COLORS.white}
        border={`1px solid ${COLORS.grey}`}
        borderRadius={8}
        width={width || 320}
        height={height || 440}
        center
        column
        padding={16}
        justifyContent="space-around"
      >
        <Box
          top={0}
          right={5}
          position="absolute"
          onClick={onClose}
          className={classes.close}
        >
          <Icon color={COLORS.darkGrey} name="close" size={ICON_SIZES.MEDIUM} />
        </Box>

        {isLoading ? (
          <Box justifyContent="center" center centerText height="100%" column>
            <h3 style={{ color: COLORS.vividBlue }}>LOADING...</h3>
            <Loading size={180} ring />
          </Box>
        ) : (
          children
        )}
      </Box>
    </OutsideClickHandler>
  </Box>
);

const styles = {
  close: {
    color: COLORS.darkestGrey,
    margin: 0,
    padding: "4px 6px",
    borderRadius: "50%",
    cursor: "pointer",
    [":hover"]: {
      background: COLORS.lighterGrey,
    },
  },
};

export default withStyles(styles)(Modal);
