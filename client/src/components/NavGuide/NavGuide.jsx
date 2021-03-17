import React from "react";
import { NavLink, withRouter, Link } from "react-router-dom";
import { Box, Icon, Text, WithOutsideClickHandler, ICON_SIZES } from "..";
import { COLORS } from "../../constants";
import { FONT_SIZES } from "../Text";

class NavGuide extends React.PureComponent {
  state = {
    isExpanded: true,
    options: [
      { label: "Create Profile", route: "profile" },
      { label: "Video Chat", route: "video" },
      { label: "View Location", route: "/location" },
    ],
  };

  toggleIsExpanded = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  handleOptionClick = (option) => {
    // this.optionClick(optionClick);
    this.setState({ isExpanded: false });
  };

  render() {
    return (
      <Box width={"fit-content"}>
        <WithOutsideClickHandler
          isActive={this.state.isExpanded}
          onOutsideClick={this.toggleIsExpanded}
        >
          <Icon
            padding={0}
            active={this.state.isExpanded}
            name="threeDot"
            color={COLORS.vividBlue}
            size={ICON_SIZES.XX_LARGE}
            onClick={this.toggleIsExpanded}
          />
          {this.state.isExpanded && (
            <Box
              style={{ left: "1px" }}
              border={`1px solid ${COLORS.darkGrey}`}
              boxShadow={`1px 1px 3px ${COLORS.lightGrey}`}
              position="absolute"
              top={24}
              left={-100}
              column
              zIndex={100}
              background={COLORS.white}
            >
              {this.state.options.map((option, i) => (
                <Box
                  borderBottom={`1px solid ${COLORS.darkGrey}`}
                  center
                  key={i}
                  isDisabled={option.isDisabled}
                  onClick={
                    option.isDisabled
                      ? undefined
                      : () => this.handleOptionClick(option)
                  }
                  padding={8}
                  background={COLORS.lighterGrey}
                  hoverBackground={
                    option.isDisabled ? undefined : COLORS.lightGrey
                  }
                >
                  <NavLink style={{ textDecoration: "none" }} to={option.route}>
                    <Text
                      fontSize={FONT_SIZES.SMALL}
                      color={option.isDisabled ? COLORS.darkGrey : undefined}
                    >
                      {option.label}
                    </Text>
                  </NavLink>
                </Box>
              ))}
            </Box>
          )}
        </WithOutsideClickHandler>
      </Box>
    );
  }
}

export default NavGuide;
