import React from "react";

import { Box, Text, FONT_SIZES } from "..";
import { COLORS } from "../../constants";

const ProgressBar = ({ completed, total, mobile }) => {
  const percentage = Math.round((100 * completed) / total);
  return (
    <Box
      width={180}
      column
      center
      paddingY={mobile ? undefined : 8}
      padding={mobile ? 8 : undefined}
    >
      <Box paddingY={mobile ? 0 : 4}>
        <Text margin={0} fontSize={FONT_SIZES.SMALL}>
          {percentage.toString()}%
        </Text>
      </Box>

      <Box
        width={mobile ? "80%" : "100%"}
        height={mobile ? 8 : 16}
        background={COLORS.darkerGrey}
        borderRadius={10}
        boxShadow={`inset 0 0 5px ${COLORS.white}`}
      >
        <Box
          width={`${percentage}%`}
          height="100%"
          background={COLORS.vividBlue}
          borderRadius={6}
          transition="width 0.3s ease-in-out"
        />
      </Box>
    </Box>
  );
};

export default ProgressBar;
