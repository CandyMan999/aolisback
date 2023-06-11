import React from "react";
import { Box } from "..";

import { COLORS } from "../../constants";

import icons from "./svgs";
import { iconSizes } from "./icon-sizes";

class Icon extends React.Component {
  render() {
    return (
      <Box center justifyContent="center" margin={this.props.margin || ""}>
        <Box
          right={this.props.right || ""}
          top={this.props.top || ""}
          position={this.props.position || ""}
          padding={
            this.props.padding === 0
              ? 0
              : this.props.clickable || this.props.onClick
              ? this.props.padding
              : 8
          }
          paddingTop={this.props.padding || ""}
          borderRadius="100%"
          onClick={this.props.onClick}
          background={this.props.active ? COLORS.lightGrey : undefined}
          hoverBackground={
            this.props.clickable || this.props.onClick
              ? this.props.hoverColor || COLORS.white
              : undefined
          }
          center
          justifyContent="center"
          marginTop={this.props.marginTop || ""}
          marginLeft={this.props.marginLeft || ""}
          marginRight={this.props.marginRight || ""}
        >
          <svg
            width={iconSizes[this.props.size || "medium"]}
            height={iconSizes[this.props.size || "medium"]}
            viewBox={icons[this.props.name].viewBox}
          >
            {icons[this.props.name].poly && (
              <polygon
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.fill || COLORS.darkGrey}
                points={icons[this.props.name].poly}
              />
            )}
            {icons[this.props.name].poly2 && (
              <polygon
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.fill || COLORS.darkGrey}
                points={icons[this.props.name].poly2}
              />
            )}
            {icons[this.props.name].poly3 && (
              <polygon
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.fill || COLORS.darkGrey}
                points={icons[this.props.name].poly3}
              />
            )}
            <path
              stroke={this.props.stroke}
              strokeWidth={this.props.strokeWidth}
              fill={this.props.color || COLORS.darkGrey}
              d={icons[this.props.name].path}
            />
            {icons[this.props.name].path2 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path2}
              />
            )}
            {icons[this.props.name].path3 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path3}
              />
            )}
            {icons[this.props.name].path4 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path4}
              />
            )}
            {icons[this.props.name].path5 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path5}
              />
            )}
            {icons[this.props.name].path6 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path6}
              />
            )}
            {icons[this.props.name].path7 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path7}
              />
            )}
            {icons[this.props.name].path8 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path8}
              />
            )}
            {icons[this.props.name].path9 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path9}
              />
            )}
            {icons[this.props.name].path10 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path10}
              />
            )}
            {icons[this.props.name].path11 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path11}
              />
            )}
            {icons[this.props.name].path12 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path12}
              />
            )}
            {icons[this.props.name].path13 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path13}
              />
            )}
            {icons[this.props.name].path13 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path13}
              />
            )}
            {icons[this.props.name].path14 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path14}
              />
            )}
            {icons[this.props.name].path15 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path15}
              />
            )}
            {icons[this.props.name].path16 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path16}
              />
            )}
            {icons[this.props.name].path17 && (
              <path
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.color || COLORS.darkGrey}
                d={icons[this.props.name].path17}
              />
            )}
          </svg>
          {this.props.children}
        </Box>
      </Box>
    );
  }
}

export default Icon;
