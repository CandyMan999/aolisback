import React, { useState, useContext } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Text,
  FONT_SIZES,
  Picture,
  Span,
  ICON_SIZES,
  Icon,
} from "../../../components";
import { COLORS } from "../../../constants";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import Context from "../../../context";

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
  box-shadow: ${(props) =>
    props.hasMention && !props.isCurrentUser
      ? `2px 2px 8px 2px ${COLORS.pink}`
      : "2px 2px 4px 2px rgba(0, 0, 0, 0.3)"};
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

const Username = styled(Box)`
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
  commentId,
  currentUserID,
  currentUser,
  authorId,
  picture,
  createdAt,
  replyToAuthor,
  replyToText,
  voteCount,
  voteToKick,
}) => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(Context);
  const [expandReply, setExpandReply] = useState(false);

  const handleSpeech = async (text, gender) => {
    try {
      setLoading(true);
      const open = process.env.REACT_APP_OPEN_AI;
      const url = "https://api.openai.com/v1/audio/speech";

      const data = {
        model: "tts-1",
        input: text,
        voice: gender === "female" ? "shimmer" : "echo",
      };

      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${open}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
      });

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching or playing speech:", error);
    }
  };

  const isCurrentUser = currentUserID === authorId;

  // Function to check for mention
  const checkForMention = (text) => {
    const words = text.split(" ");
    const isMentioned = words.some((word) => {
      // Trim spaces and remove trailing special characters from the word
      const trimmedWord = word.trim().replace(/[.,!?;:()]/g, "");
      if (trimmedWord === `@${currentUser.username}`) {
        return true; // Stop further checks and return true if a match is found
      }
      return false;
    });
    return isMentioned;
  };

  const hasMention = checkForMention(text);

  const handleCommentReply = async (commentId, text, authorName) => {
    try {
      dispatch({ type: "SET_REPLY", payload: { commentId, text, authorName } });
    } catch (err) {
      console.log("error setting reply to state");
    }
  };

  const handleExpandReply = () => {
    try {
      setExpandReply(!expandReply);
    } catch (err) {
      console.log("err expanding reply: ", err);
    }
  };

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
            withShadowColor={hasMention && !isCurrentUser}
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
            textWrapMode: "nowrap",
            alignItems: "center",
          }}
        >
          {isCurrentUser && (
            <Icon
              name="speaker"
              size={ICON_SIZES.LARGE}
              color={loading ? COLORS.lightGrey : COLORS.pink}
              marginRight={4}
              onClick={() =>
                loading
                  ? undefined
                  : handleSpeech(text, isCurrentUser ? "female" : "male")
              }
            />
          )}
          {username}
          {!isCurrentUser && (
            <Box
              display="flex"
              alignItems="center"
              width={"100%"}
              justifyContent="space-between"
            >
              <Icon
                name="speaker"
                size={ICON_SIZES.LARGE}
                color={loading ? COLORS.lightGrey : COLORS.pink}
                marginLeft={4}
                onClick={() =>
                  loading
                    ? undefined
                    : handleSpeech(text, !isCurrentUser ? "male" : "female")
                }
              />
              {username !== "CandyMan🍭" && (
                <Box display="flex" alignItems="flex-end" marginLeft={20}>
                  <Icon
                    name="out"
                    size={ICON_SIZES.X_LARGE}
                    color={COLORS.pink}
                    onClick={() => voteToKick(authorId)}
                  />
                  <Span
                    style={{ marginLeft: 2, fontSize: 12, color: COLORS.pink }}
                  >
                    {voteCount}
                  </Span>
                </Box>
              )}
            </Box>
          )}
        </Username>

        <MessageBubble isCurrentUser={isCurrentUser} hasMention={hasMention}>
          {replyToAuthor && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              paddingTop="6px"
              paddingLeft="8px"
              width={"100%"}
              onClick={handleExpandReply}
              style={{
                borderLeft: `4px solid ${
                  isCurrentUser ? COLORS.white : COLORS.pink
                }`,
                borderRadius: "2px 0px 0px 0px",
              }}
            >
              <Box
                flex={1}
                overflow="hidden"
                column
                style={{ transition: "all 0.3s ease-in-out" }}
              >
                {/* Author name */}
                <Text
                  bold
                  fontSize={FONT_SIZES.SMALL}
                  color={COLORS.darkGrey}
                  margin={0}
                  padding={0}
                >
                  Reply to {replyToAuthor}
                </Text>
                {/* Truncated comment text with ellipsis */}
                <Text
                  fontSize={FONT_SIZES.SMALL}
                  color={COLORS.darkGrey}
                  padding={0}
                  margin={0}
                  style={{
                    maxWidth: "70vw", // I ned this to be better, maybe the max width should be somewhere else
                    display: "block",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: !expandReply ? "nowrap" : "wrap",
                  }}
                >
                  {replyToText}
                </Text>
              </Box>
            </Box>
          )}
          <Box>
            <Text
              marginBottom={0}
              fontSize={FONT_SIZES.SMALL}
              style={{ marginBottom: 2 }}
            >
              {text}
            </Text>
          </Box>
          <Box>
            <Span
              style={{
                fontSize: 10,
                alignSelf: "flex-end",
                marginTop: 5,
                margin: 0,
                justifyContent: "space-between",
                paddingBottom: 5,
                width: !isCurrentUser ? "100%" : undefined,
                color: isCurrentUser ? COLORS.darkerGrey : COLORS.white,
              }}
            >
              {formatDistanceToNow(Number(createdAt))} ago
            </Span>
            {!isCurrentUser && (
              <Icon
                name="reverse"
                size={ICON_SIZES.LARGE}
                color={COLORS.pink}
                marginLeft={20}
                onClick={() => handleCommentReply(commentId, text, username)}
              />
            )}
          </Box>
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
