import React, { Fragment } from "react";
import { Box, Text, FONT_SIZES } from "../../../components";
import { COLORS } from "../../../constants";
import { formatDistanceToNow } from "date-fns";

const Message = ({
  username,
  text,
  usernameClick,
  roomId,
  messageRoomId,
  currentUser,
  authorId,
  picture,
  createdAt,
}) => (
  <Fragment>
    {roomId === messageRoomId ? (
      currentUser === authorId ? (
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          height={"fit-content"}
          minHeight={35}
          className="message"
          margin="auto"
          flexWrap="wrap"
          paddingTop={10}
        >
          <Text
            marginRight={45}
            position="absolute"
            bottom={"0px"}
            fontSize={FONT_SIZES.X_SMALL}
            color={COLORS.darkGrey}
            style={{ zIndex: 100 }}
          >
            {formatDistanceToNow(Number(createdAt))} ago
          </Text>
          <Box
            flexWrap="wrap"
            height={"fit-content"}
            marginRight={45}
            textAlign={"center"}
            className="message-text"
          >
            <Text
              paddingLeft={2}
              paddingRight={2}
              margin={"auto"}
              fontSize={FONT_SIZES.SMALL}
            >
              {text}
            </Text>
          </Box>

          <Box
            width={45}
            position={"absolute"}
            flexWrap="wrap"
            height={35}
            textAlign={"center"}
            justifyContent={"center"}
            onClick={() => usernameClick(username)}
          >
            {!!picture && (
              <img
                style={{
                  height: "20px",
                  borderRadius: "90%",
                  border: `dotted 2px ${COLORS.vividBlue}`,
                }}
                src={picture}
                alt={currentUser}
              />
            )}

            <Text
              margin={0}
              fontSize={FONT_SIZES.X_SMALL}
              className="message-username"
              style={{ marginBottom: 5 }}
            >
              {username}
            </Text>
          </Box>
        </Box>
      ) : (
        <Box
          display={"flex"}
          height={"fit-content"}
          className="message"
          margin="auto"
          flexWrap="wrap"
          paddingTop={10}
        >
          <Box
            position={"absolute"}
            width={45}
            flexWrap="wrap"
            textAlign={"center"}
            justifyContent={"center"}
            onClick={() => usernameClick(username)}
          >
            {!!picture && (
              <img
                style={{
                  height: "20px",
                  borderRadius: "90%",
                  border: `dotted 2px ${COLORS.vividBlue}`,
                }}
                src={picture}
                alt={currentUser}
              />
            )}

            <Text
              margin={0}
              fontSize={FONT_SIZES.X_SMALL}
              className="message-username"
            >
              {username}
            </Text>
          </Box>
          {/* <Text
            marginLeft={45}
            position="absolute"
            bottom={"0px"}
            fontSize={FONT_SIZES.X_SMALL}
            color={COLORS.darkGrey}
            style={{ zIndex: 100 }}
          >
            {formatDistanceToNow(Number(createdAt))} ago
          </Text> */}
          <Box
            flexWrap="wrap"
            height={"fit-content"}
            textAlign={"center"}
            className="others-message-text"
            marginLeft={45}
          >
            <Text
              paddingLeft={2}
              paddingRight={2}
              margin={"auto"}
              fontSize={FONT_SIZES.SMALL}
            >
              {text}
            </Text>
            <Text fontSize={FONT_SIZES.X_SMALL} color={COLORS.darkGrey}>
              {formatDistanceToNow(Number(createdAt))} ago
            </Text>
          </Box>
        </Box>
      )
    ) : (
      ""
    )}
  </Fragment>
);

export default Message;
