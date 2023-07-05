import React, { Fragment } from "react";
import { Box, Text, FONT_SIZES, Picture, Button } from "../../../components";
import { COLORS } from "../../../constants";
import { formatDistanceToNow } from "date-fns";
import Speech from "react-speech";

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
    console.log("firing");

    try {
      let voices = await window.speechSynthesis.getVoices();

      voices = await voices.filter((v) => v.lang === "en-US");
      let voice;

      if (voiceType === "male") {
        voice = voices[0];
      } else {
        voice = voices[1];
      }

      const msg = new SpeechSynthesisUtterance();
      msg.text = text;
      msg.voice = voice;
      msg.lang = "en-US";
      msg.default = true;
      msg.localService = true;

      await window.speechSynthesis.speak(msg);
    } catch (err) {
      console.log("error talking:  ", err);
    }
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
              className="message-text"
            >
              <Text
                paddingLeft={2}
                paddingRight={2}
                fontSize={FONT_SIZES.SMALL}
                marginY={"auto"}
              >
                {/* <span onClick={() => handleSpeech(text, "male")}>
                  <Speech />
                </span> */}
                <Button
                  style={{
                    border: `solid 1px ${COLORS.white}`,
                    borderRadius: 6,
                    width: 12,
                    height: 22,
                    padding: 6,
                    margin: 0,
                    marginRight: 4,
                    backgroundColor: COLORS.lightGrey,
                  }}
                  onClick={() => handleSpeech(text, "male")}
                />
                {text}
                <Text
                  fontSize={FONT_SIZES.X_SMALL}
                  color={COLORS.darkGrey}
                  style={{
                    width: "100%",
                    justifyContent: "flex-start",
                    display: "flex",
                  }}
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
              // justifyContent="flex-end"
            >
              <Text
                paddingLeft={2}
                paddingRight={2}
                fontSize={FONT_SIZES.SMALL}
                marginY="auto"
              >
                <Button
                  style={{
                    border: `solid 1px ${COLORS.white}`,
                    borderRadius: 6,
                    width: 14,
                    height: 22,
                    padding: 6,
                    margin: 0,
                    marginRight: 4,
                    backgroundColor: COLORS.main,
                  }}
                  onClick={() => handleSpeech(text, "female")}
                />

                {text}
              </Text>

              <Text
                paddingLeft={4}
                fontSize={FONT_SIZES.X_SMALL}
                color={COLORS.darkGrey}
                marginRight={2}
                style={{
                  width: "100%",
                  justifyContent: "flex-end",
                  display: "flex",
                }}
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
