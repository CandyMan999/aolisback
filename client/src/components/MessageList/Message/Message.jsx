import React, { Fragment, useEffect } from "react";
import { Box, Text, FONT_SIZES } from "../../../components";
import { COLORS } from "../../../constants";
import { formatDistanceToNow } from "date-fns";
import Speech from "react-speech";
import { Icon, ICON_SIZES } from "../../../components";

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
}) => {
  const handleSpeech = async (text) => {
    let voices = await window.speechSynthesis.getVoices();
    console.log("voices: ", voices);
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    window.speechSynthesis.speak(msg);
  };

  return (
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
                <span onClick={() => handleSpeech(text)}>
                  <Speech />
                </span>

                {text}

                <Text
                  style={{ display: "flex", justifyContent: "flex-end" }}
                  fontSize={FONT_SIZES.X_SMALL}
                  color={COLORS.darkGrey}
                >
                  {formatDistanceToNow(Number(createdAt))} ago
                </Text>
              </Text>
            </Box>

            <Box
              width={45}
              position={"absolute"}
              flexWrap="wrap"
              height={35}
              textAlign={"center"}
              justifyContent={"center"}
              onClick={() => usernameClick(authorId)}
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
              onClick={() => usernameClick(authorId)}
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
                <span onClick={() => handleSpeech(text)}>
                  <Speech />
                </span>
                {text}
              </Text>
              <Text
                paddingLeft={4}
                fontSize={FONT_SIZES.X_SMALL}
                color={COLORS.darkGrey}
              >
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
};

export default Message;
