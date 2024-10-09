import React from "react";
import { Text, Box, Icon } from "../../components";
import { COLORS } from "../../constants";
import { isMobile } from "react-device-detect";

const ReplyPreview = ({ state, dispatch }) => {
  const clearReply = () => {
    try {
      dispatch({
        type: "SET_REPLY",
        payload: { commentId: null, text: null, authorName: null },
      });
    } catch (err) {
      console.log("error clearing reply: ", err);
    }
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="8px"
      position="absolute"
      width={isMobile ? "95vw" : "98vw"}
      bottom={45}
      zIndex={200}
      style={{
        borderLeft: `4px solid ${COLORS.vividBlue}`,
        backgroundColor: COLORS.white,
        marginBottom: "10px",
        borderRadius: "10px",
        boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
      }}
    >
      <Box flex={1} overflow="hidden" column>
        {/* Author name */}
        <Text
          bold
          fontSize="14px"
          color={COLORS.darkGrey}
          margin={0}
          padding={0}
        >
          {state.reply.authorName}
        </Text>
        {/* Truncated comment text with ellipsis */}
        <Text
          fontSize="14px"
          color={COLORS.darkGrey}
          padding={0}
          margin={0}
          style={{
            maxWidth: "85vw", // Ensuring full width is used
            display: "block",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {state.reply.text}
        </Text>
      </Box>
      {/* Close button to cancel the reply */}
      <Box cursor="pointer" onClick={clearReply}>
        <Icon name="close" color={COLORS.darkGrey} />
      </Box>
    </Box>
  );
};

export default ReplyPreview;
