import React from "react";
import styled from "@emotion/styled";
import { Box, Text, FONT_SIZES, Button, Picture } from "../../../components";
import { COLORS } from "../../../constants";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const MessageRow = styled.div`
  display: flex;
  align-items: flex-start;
  width: "100%";
`;

const MessageBubble = styled.div`
  background-color: ${(props) =>
    props.isCurrentUser ? COLORS.main : COLORS.lightGrey};
  color: ${(props) => (props.isCurrentUser ? COLORS.white : COLORS.black)};
  border-radius: ${(props) =>
    props.isCurrentUser ? "15px 15px 0 15px" : "15px 15px 15px 0"};

  padding-left: 10px;
  padding-right: 10px;
  box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.3);

  display: flex;
  flex-direction: column;
  margin-left: ${(props) => (props.isCurrentUser ? "0" : "10px")};
  margin-right: ${(props) => (props.isCurrentUser ? "10px" : "0")};
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 60px;
  height: 55px;
  margin-top: 30px;
  cursor: pointer;
`;

const Username = styled(Text)`
  font-size: 20px;
  color: ${COLORS.vividBlue};
  margin-bottom: 2px;
  font-weight: bold;
  margin-top: 2px;
  display: flex;
  flex-direction: row;
`;

const Timestamp = styled(Text)`
  font-size: 10px;
  color: ${COLORS.darkGrey};
  align-self: flex-end;
  margin-top: 5px;
  margin: 0,
  padding: 0
`;

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
      console.log("error talking: ", err);
    }
  };

  const isCurrentUser = currentUser === authorId;

  return (
    <MessageRow
      isCurrentUser={isCurrentUser}
      style={{
        display: "flex",
        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
        paddingLeft: "2%",
        paddingRight: "2%",
      }}
    >
      {!isCurrentUser && (
        <AvatarContainer onClick={() => usernameClick(authorId)}>
          <Picture
            withShadow
            profilePic={picture}
            name={picture._id}
            height={65}
            width={65}
          />
        </AvatarContainer>
      )}
      <div>
        <Username
          style={{
            justifyContent: !isCurrentUser ? "flex-start" : "flex-end",
            marginRight: isCurrentUser ? "8px" : undefined,
            marginLeft: !isCurrentUser ? "8px" : undefined,

            textShadow: `-0.5px -0.5px 0 ${COLORS.vividBlue}, 1px -0.5px 0 ${COLORS.vividBlue}, -0.5px 0.5px 0 ${COLORS.vividBlue}, 0.5px 0.5px 0 ${COLORS.vividBlue}`,
            color: COLORS.black,
          }}
        >
          {username}
        </Username>

        <MessageBubble isCurrentUser={isCurrentUser}>
          <Text fontSize={FONT_SIZES.SMALL}>
            <Button
              style={{
                border: `solid 1px ${COLORS.white}`,
                borderRadius: 6,
                width: 12,
                height: 22,
                padding: 6,
                margin: 0,
                marginRight: 4,
                backgroundColor: isCurrentUser ? COLORS.pink : COLORS.main,
              }}
              onClick={() =>
                handleSpeech(text, isCurrentUser ? "male" : "female")
              }
            />
            {text}
          </Text>
          <Timestamp
            style={{
              width: !isCurrentUser ? "100%" : undefined,
              color: isCurrentUser ? COLORS.darkerGrey : COLORS.white,
            }}
          >
            {formatDistanceToNow(Number(createdAt))} ago
          </Timestamp>
        </MessageBubble>
      </div>
      {isCurrentUser && (
        <AvatarContainer onClick={() => usernameClick(authorId)}>
          <Picture
            withShadow
            profilePic={picture}
            name={picture._id}
            height={65}
            width={65}
          />
        </AvatarContainer>
      )}
    </MessageRow>
  );
};

export default Message;
