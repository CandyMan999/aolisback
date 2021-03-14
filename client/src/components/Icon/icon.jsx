import React from "react";
import { Box } from "..";

import { COLORS } from "../../constants";

import icons from "./svgs";
import { iconSizes } from "./icon-sizes";

class Icon extends React.Component {
  render() {
    return (
      <Box center justifyContent="center">
        <Box
          padding={this.props.clickable || this.props.onClick ? 8 : undefined}
          borderRadius="100%"
          onClick={this.props.onClick}
          background={this.props.active ? COLORS.lightGrey : undefined}
          hoverBackground={
            this.props.clickable || this.props.onClick
              ? this.props.hoverColor || COLORS.lightGrey
              : undefined
          }
          center
          justifyContent="center"
        >
          <svg
            width={iconSizes[this.props.size || "medium"]}
            height={iconSizes[this.props.size || "medium"]}
            viewBox={icons[this.props.name].viewBox}
          >
            <path
              stroke={this.props.stroke}
              strokeWidth={this.props.strokeWidth}
              fill={this.props.color || COLORS.darkGrey}
              d={icons[this.props.name].path}
            />
          </svg>
        </Box>
      </Box>
    );
  }
}

export default Icon;
