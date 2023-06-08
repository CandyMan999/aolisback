import React from "react";

import { Box, ProgressBar, Text, FONT_SIZES } from "../../components";
import { COLORS } from "../../constants";

const ProfileProgressSummary = ({ mobile, completed, total }) => {
  return (
    <Box
      borderRadius={8}
      border={`1px solid ${COLORS.darkGrey}`}
      padding={mobile ? 4 : 16}
      height={mobile ? "fit-content" : 120}
      width={mobile ? 160 : 240}
      justifyContent="center"
      center
      column
    >
      <Text
        color={COLORS.darkBlue}
        bold
        margin={0}
        width={mobile ? "100%" : undefined}
        fontSize={mobile ? FONT_SIZES.SMALL : undefined}
      >
        My Profile Progress
      </Text>
      <ProgressBar mobile={mobile} completed={completed} total={total} />
      <Text
        margin={mobile ? 0 : undefined}
        fontSize={mobile ? FONT_SIZES.MEDIUM : undefined}
      >
        {completed.toString()} / {total} complete
      </Text>
    </Box>
  );
};

export default ProfileProgressSummary;
