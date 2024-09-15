import React, { Fragment } from "react";

import { withStyles } from "@material-ui/core/styles";

import { Box, Icon, ICON_SIZES, Loading, BackDrop } from "..";

import { COLORS } from "../../constants";
import "./modal.css";

const Modal = ({
  children,
  isLoading,
  onClose,
  height,
  width,
  classes,
  state,
  dark,
  noPadding,
  overflow,
}) => (
  <Fragment>
    <BackDrop onClose={onClose} />
    <Box
      bottom={0}
      center
      justifyContent="center"
      left={0}
      position="fixed"
      right={0}
      top={0}
      zIndex={10000}
    >
      <Box
        background={dark ? COLORS.darkestGrey : COLORS.white}
        border={dark ? `1px solid ${COLORS.black}` : `1px solid ${COLORS.grey}`}
        borderRadius={8}
        style={{
          opacity: dark ? 0.7 : 1,
          paddingTop: noPadding ? 0 : undefined,
          overflow: overflow ? overflow : undefined,
        }}
        width={width || 320}
        height={height || 440}
        boxShadow={
          dark
            ? `2px 2px 4px 2px ${COLORS.white}`
            : `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`
        }
        center
        column
        padding={16}
        justifyContent="space-around"
      >
        {!state.showChatRequest && (
          <Box
            top={0}
            right={5}
            position="absolute"
            onClick={onClose}
            className={classes.close}
            zIndex={20}
          >
            <Icon
              color={dark ? COLORS.white : COLORS.darkGrey}
              name="close"
              size={ICON_SIZES.MEDIUM}
            />
          </Box>
        )}

        {isLoading ? (
          <Box justifyContent="center" center centerText height="100%" column>
            <h3 style={{ color: COLORS.vividBlue }}>LOADING...</h3>
            <Loading size={180} ring />
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
  </Fragment>
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
