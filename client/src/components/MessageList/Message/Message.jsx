import React from "react";
import styled from "@emotion/styled";
import {
  Box,
  Text,
  FONT_SIZES,
  Button,
  Picture,
  Span,
  ICON_SIZES,
  Icon,
} from "../../../components";
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
  font-size: 15px;
  color: ${COLORS.vividBlue};
  margin-bottom: 2px;
  font-weight: bold;
  margin-top: 15px;
  display: flex;
  flex-direction: row;
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
          {isCurrentUser && (
            <Icon
              name="speaker"
              size={ICON_SIZES.LARGE}
              color={COLORS.pink}
              // alignSelf={"flex-start"}
              // marginTop={5}
              marginRight={4}
              onClick={() =>
                handleSpeech(text, isCurrentUser ? "male" : "female")
              }
            />
          )}
          {username}
          {!isCurrentUser && (
            <Icon
              name="speaker"
              size={ICON_SIZES.LARGE}
              color={COLORS.pink}
              // alignSelf={"flex-start"}
              // marginTop={5}
              marginLeft={4}
              onClick={() =>
                handleSpeech(text, isCurrentUser ? "male" : "female")
              }
            />
          )}
        </Username>

        <MessageBubble isCurrentUser={isCurrentUser}>
          <Box>
            <Text fontSize={FONT_SIZES.SMALL}>{text}</Text>
          </Box>
          <Span
            style={{
              fontSize: 10,
              alignSelf: "flex-end",
              marginTop: 5,
              margin: 0,
              paddingBottom: 5,
              width: !isCurrentUser ? "100%" : undefined,
              color: isCurrentUser ? COLORS.darkerGrey : COLORS.white,
            }}
          >
            {formatDistanceToNow(Number(createdAt))} ago
          </Span>
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
