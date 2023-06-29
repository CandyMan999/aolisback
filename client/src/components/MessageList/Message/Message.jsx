import React, { Fragment } from "react";
import { Box, Text, FONT_SIZES, Picture } from "../../../components";
import { COLORS } from "../../../constants";
import { formatDistanceToNow } from "date-fns";
import Speech from "react-speech";
import { Image, Transformation, CloudinaryContext } from "cloudinary-react";

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
  publicId,
}) => {
  const handleSpeech = async (text, voiceType) => {
    let voices = await window.speechSynthesis.getVoices();
    let voice;

    if (voiceType === "male") {
      // Find the American male voice
      voice = voices.find((v) => v.name === "Google US English male");
    } else {
      // Find the English American female voice
      voice = voices.find((v) => v.name === "Google UK English Female");
    }

    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.voice = voice;
    window.speechSynthesis.speak(msg);
  };

  return (
    <Fragment>
      {roomId === messageRoomId &&
        (currentUser === authorId ? (
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            height={"fit-content"}
            minHeight={55}
            className="message"
            margin="auto"
            flexWrap="wrap"
            paddingTop={10}
            marginLeft={2}
            marginRight={2}
          >
            <Box
              flexWrap="wrap"
              height={"fit-content"}
              marginRight={50}
              // textAlign={"center"}
              className="message-text"
            >
              <Text
                paddingLeft={2}
                paddingRight={2}
                margin={"auto"}
                fontSize={FONT_SIZES.SMALL}
              >
                <span onClick={() => handleSpeech(text, "male")}>
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
              paddingX={1}
              textAlign={"center"}
              justifyContent={"center"}
              onClick={() => usernameClick(authorId)}
            >
              <Picture
                profilePic={picture}
                name={picture._id}
                height={45}
                width={45}
              />

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
            minHeight={55}
            margin="auto"
            flexWrap="wrap"
            paddingTop={10}
            marginRight={2}
            marginLeft={3}
          >
            <Box
              position={"absolute"}
              width={45}
              flexWrap="wrap"
              textAlign={"center"}
              justifyContent={"center"}
              onClick={() => usernameClick(authorId)}
            >
              <Picture
                profilePic={picture}
                name={picture._id}
                height={45}
                width={45}
              />
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
              // textAlign={"center"}
              className="others-message-text"
              marginLeft={50}
            >
              <Text
                paddingLeft={2}
                paddingRight={2}
                margin={"auto"}
                fontSize={FONT_SIZES.SMALL}
              >
                <span onClick={() => handleSpeech(text, "female")}>
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
        ))}
    </Fragment>
  );
};

export default Message;
