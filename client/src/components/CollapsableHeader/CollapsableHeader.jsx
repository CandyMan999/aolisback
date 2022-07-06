import React, { useState, useEffect } from "react";

import { Box, Text, Icon } from "..";
import { COLORS } from "../../constants";

const CollapsableHeader = ({
  onClose,
  defaultToOpen,
  completed,
  total,
  title,
  children,
  mobile,
}) => {
  const [isVisible, setIsVisible] = useState(defaultToOpen);

  useEffect(() => {
    if (!!onClose) {
      setIsVisible(false);
    }
  }, [onClose]);

  const handleHeaderToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Box column width={"90vW"}>
      <Box
        paddingY={4}
        onClick={handleHeaderToggle}
        borderBottom={`2px solid ${
          isVisible ? COLORS.vividBlue : COLORS.lightGrey
        }`}
        justifyContent="space-between"
      >
        <Box justifyContent="space-between">
          <Text
            fontSize="xlarge"
            bold
            color={isVisible ? COLORS.darkGrey : undefined}
          >
            {title}
          </Text>
          {!!total &&
            !!total &&
            ((completed || 0) < total ? (
              <Box height="100%" center marginLeft={10}>
                {completed} / {total} field{total > 1 ? "s" : ""} complete
              </Box>
            ) : (
              <Box paddingX={8} center>
                <Icon name="check" color={COLORS.green} />
              </Box>
            ))}
        </Box>
        <Icon
          name={isVisible ? "chevronDown" : "chevronRight"}
          color={isVisible ? COLORS.vividBlue : COLORS.darkGrey}
        />
      </Box>

      <Box paddingY={16} justifyContent="center">
        {isVisible && children}
      </Box>
    </Box>
  );
};

export default CollapsableHeader;
