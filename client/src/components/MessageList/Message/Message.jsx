import React, { Fragment } from "react";
import { motion } from "framer-motion";
import { Box, Text, FONT_SIZES, Picture, Button } from "../../../components";
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
}) => {
  const handleSpeech = async (text, voiceType) => {
    try {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
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
            <motion.div
              style={{
                width: 45,
                position: "absolute",
                display: "flex",
                flexWrap: "wrap",
                height: 35,
                paddingLeft: 1,
                paddingRight: 1,
                textAlign: "center",
                justifyContent: "center",
              }}
              whileHover={{
                scale: 1.9,
                zIndex: 2000,
                cursor: "pointer",
                translateX: -20,
              }}
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
            </motion.div>
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
            <motion.div
              style={{
                width: 45,
                position: "absolute",
                display: "flex",
                flexWrap: "wrap",
                height: 35,

                textAlign: "center",
                justifyContent: "center",
              }}
              whileHover={{
                scale: 1.9,
                zIndex: 2000,
                cursor: "pointer",
                translateX: 20,
              }}
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
            </motion.div>

            <Box
              flexWrap="wrap"
              height={"fit-content"}
              className="others-message-text"
              marginLeft={50}
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
