import React from "react";
import styled from "@emotion/styled";
import { fontSizes, FONT_SIZES } from "./font-sizes";

const Text = (props) => <StyledP {...props}>{props.children}</StyledP>;

const StyledP = styled("p")(
  ({
    fontSize = FONT_SIZES.MEDIUM,
    color,
    center,
    bold,
    margin,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    marginX,
    marginY,
    lineHeight,
    textShadow,
    paddingLeft,
    paddingRight,
    position,
    bottom,
    backgroundColor,
    noWrap,
  }) => ({
    fontSize: fontSizes[fontSize],
    color,
    fontWeight: bold ? "bold" : undefined,
    textAlign: center ? "center" : undefined,
    marginBottom: marginBottom ? marginBottom : marginY ? marginY : margin,
    marginLeft: marginLeft ? marginLeft : marginX ? marginX : margin,
    marginRight: marginRight ? marginRight : marginX ? marginX : margin,
    marginTop: marginTop ? marginTop : marginY ? marginY : margin,
    lineHeight,
    textShadow,
    paddingLeft,
    paddingRight,
    position,
    bottom,
    backgroundColor,
    whiteSpace: noWrap ? "nowrap" : undefined,
  })
);

const StyledSpan = styled("span")(
  ({
    fontSize = FONT_SIZES.MEDIUM,
    color,
    center,
    bold,
    margin,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    marginX,
    marginY,
    lineHeight,
    noWrap,
  }) => ({
    fontSize: fontSizes[fontSize],
    color,
    fontWeight: bold ? "bold" : undefined,
    textAlign: center ? "center" : undefined,
    marginBottom: marginBottom ? marginBottom : marginY ? marginY : margin,
    marginLeft: marginLeft ? marginLeft : marginX ? marginX : margin,
    marginRight: marginRight ? marginRight : marginX ? marginX : margin,
    marginTop: marginTop ? marginTop : marginY ? marginY : margin,
    lineHeight,
    whiteSpace: noWrap ? "nowrap" : undefined,
  })
);

export default Text;
