import React, { useContext, useState } from "react";
import { NavLink, withRouter, Link } from "react-router-dom";
import { Box, Icon, Text, WithOutsideClickHandler, ICON_SIZES } from "..";
import { COLORS } from "../../constants";
import { FONT_SIZES } from "../Text";
import Context from "../../context";

const NavGuide = ({}) => {
  const { state, dispatch } = useContext(Context);
  const [isExpanded, setIsExpanded] = useState(false);

  const options = [
    { label: "Create Profile", route: "profile" },
    { label: "My Video Channel", route: "video" },
    { label: "View All Users Location", route: "location" },
  ];

  const toggleIsExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionClick = (option) => {
    // this.optionClick(optionClick);
    setIsExpanded(false);
    dispatch({ type: "JOIN_CHANNEL", payload: null });
  };

  return (
    <Box width={"fit-content"}>
      <WithOutsideClickHandler
        isActive={isExpanded}
        onOutsideClick={toggleIsExpanded}
      >
        <Icon
          padding={0}
          active={isExpanded}
          name="threeDot"
          color={COLORS.vividBlue}
          size={ICON_SIZES.XX_LARGE}
          onClick={toggleIsExpanded}
        />
        {isExpanded && (
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
            {options.map((option, i) => (
              <Box
                borderBottom={`1px solid ${COLORS.darkGrey}`}
                center
                key={i}
                isDisabled={option.isDisabled}
                onClick={
                  option.isDisabled
                    ? undefined
                    : () => handleOptionClick(option)
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
};

export default NavGuide;
