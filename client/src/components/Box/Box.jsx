import React from "react";
import styled from "@emotion/styled";
import { COLORS } from "../../constants/colors";

const Box = (props) => (
  <StyledDiv {...props} onScroll={props.onScroll}>
    {props.children}
  </StyledDiv>
);

const StyledDiv = styled.div(
  ({
    id,
    alignItems,
    background,
    backgroundColor,
    border,
    borderBottom,
    borderLeft,
    borderRadius,
    borderRight,
    borderTop,
    bottom,
    boxShadow,
    center,
    centerText,
    column,
    color,
    direction,
    display,
    isDisabled,
    flex,
    noFlex,
    flexWrap,
    height,
    hoverColor,
    hoverBackground,
    hoverBorder,
    justifyContent,
    left,
    margin,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    marginX,
    marginY,
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    onClick,
    overflowX,
    overflowY,
    padding,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingX,
    paddingY,
    position,
    right,
    top,
    textAlign,
    transition,
    width,
    zIndex,
  }) => ({
    id: id ? id : undefined,
    alignItems: center ? "center" : alignItems,
    background,
    backgroundColor,
    borderBottom: borderBottom ? borderBottom : border,
    borderLeft: borderLeft ? borderLeft : border,
    borderRadius:
      typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
    borderRight: borderRight ? borderRight : border,
    borderTop: borderTop ? borderTop : border,
    bottom: typeof bottom === "number" ? `${bottom}px` : bottom,
    boxShadow,
    cursor: !!onClick ? "pointer" : isDisabled ? "not-allowed" : undefined,
    color,
    display: noFlex ? display || undefined : "flex",
    flex,
    flexDirection: column ? "column" : direction,
    flexWrap,
    height: typeof height === "number" ? `${height}px` : height,
    hoverBorder,
    justifyContent,
    left: typeof left === "number" ? `${left}px` : left,
    marginBottom: marginBottom ? marginBottom : marginY ? marginY : margin,
    marginLeft: marginLeft ? marginLeft : marginX ? marginX : margin,
    marginRight: marginRight ? marginRight : marginX ? marginX : margin,
    marginTop: marginTop ? marginTop : marginY ? marginY : margin,
    maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
    maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
    minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
    minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
    overflowX,
    overflowY,
    paddingBottom: paddingBottom
      ? paddingBottom
      : paddingY
      ? paddingY
      : padding,
    paddingLeft: paddingLeft ? paddingLeft : paddingX ? paddingX : padding,
    paddingRight: paddingRight ? paddingRight : paddingX ? paddingX : padding,
    paddingTop: paddingTop ? paddingTop : paddingY ? paddingY : padding,
    position: position || "relative",
    right: typeof right === "number" ? `${right}px` : right,
    textAlign: centerText ? "center" : textAlign,
    top: typeof top === "number" ? `${top}px` : top,
    transition,
    width: typeof width === "number" ? `${width}px` : width,
    zIndex,
    [":hover"]: {
      color: hoverColor,
      backgroundColor: hoverBackground,
      border: hoverBorder,
    },
  }),
  ({ card }) =>
    card && {
      border: `1px solid ${COLORS.grey}`,
      borderRadius: "0.5rem",
      boxShadow: `1px 1px 1px 1px ${COLORS.lightGrey}`,
    }
);

export default Box;
