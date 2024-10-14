import React, { useState, useEffect, useRef } from "react";
import { Icon, Box, Text } from "../../components";
import { COLORS } from "../../constants";
import { isMobile } from "react-device-detect";

const SendMessageForm = ({
  sendMessage,
  currentUserID,
  dispatch,
  disabled,
  usernames,
  state,
}) => {
  const [message, setMessage] = useState("");
  const [filteredUsernames, setFilteredUsernames] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUsernameIndex, setSelectedUsernameIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0 });
  const inputRef = useRef(null);

  // Focus the input when state.reply.commentId is true
  useEffect(() => {
    if (state.reply.commentId && inputRef.current) {
      inputRef.current.focus();
      setMessage(`@${state.reply.authorName} `);
    }
    if (!state.reply.commentId) {
      setMessage("");
    }
  }, [state.reply.commentId]);

  useEffect(() => {
    const lastWord = message.split(" ").pop();
    if (lastWord.startsWith("@")) {
      const query = lastWord.slice(1).toLowerCase();
      const matchingUsernames = usernames.filter((username) =>
        username.toLowerCase().startsWith(query)
      );
      setFilteredUsernames(matchingUsernames);
      setShowDropdown(matchingUsernames.length > 0);

      if (inputRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const cursorPosition = calculateCursorPosition(inputRect);
        setDropdownPosition({ left: cursorPosition });
      }
    } else {
      setShowDropdown(false);
    }
  }, [message, usernames]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (showDropdown) {
      if (e.key === "ArrowRight") {
        setSelectedUsernameIndex(
          (prevIndex) => (prevIndex + 1) % filteredUsernames.length
        );
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        setSelectedUsernameIndex(
          (prevIndex) =>
            (prevIndex - 1 + filteredUsernames.length) %
            filteredUsernames.length
        );
        e.preventDefault();
      } else if (
        (e.key === "Enter" || e.key === " ") &&
        filteredUsernames.length > 0
      ) {
        insertUsername(filteredUsernames[selectedUsernameIndex]);
        e.preventDefault();
      }
    }
  };

  const calculateCursorPosition = (inputRect) => {
    const inputWidth = inputRect.width;
    const maxCursorX = inputRect.left + inputWidth * 0.7;
    const cursorX = inputRect.left + inputRef.current.selectionStart * 7;
    return Math.min(cursorX, maxCursorX);
  };

  const insertUsername = (username) => {
    const words = message.split(" ");
    words.pop();
    setMessage(`${words.join(" ")} @${username} `);
    setShowDropdown(false);
    inputRef.current.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
    clearReply();
  };

  const handleIsLoggedIn = () => {
    if (!currentUserID) {
      dispatch({ type: "TOGGLE_SIGNUP", payload: true });
    }
  };

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
    <form
      onSubmit={handleSubmit}
      className="send-message-form"
      onClick={handleIsLoggedIn}
      // style={{ paddingBottom: "1%" }}
    >
      <Box
        position="relative"
        width={"90%"}
        height={"100%"}
        display="flex"
        alignItems="center"
      >
        <Box
          flex={1}
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: "20px",
            marginLeft: "1%",
            boxShadow: `0px 1px 8px 4px ${
              message ? COLORS.vividBlue : `rgba(0, 0, 0, 0.3)`
            }`,
          }}
        >
          <input
            disabled={disabled}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{
              border: "none",
              flex: 1,
              height: "100%",
              padding: "10px",
              borderRadius: "20px",
              outline: "none",
            }}
            value={message}
            placeholder="Type your message and hit ENTER"
            type="text"
            ref={inputRef}
          />
          {showDropdown && (
            <Box
              position="absolute"
              bottom="100%"
              left={dropdownPosition.left}
              width="90%"
              backgroundColor="white"
              style={{
                boxShadow: `2px 2px 4px 2px ${COLORS.lightGrey}`,
                border: `dotted 2px ${COLORS.pink}`,
              }}
              borderRadius="20px 20px 20px 0px"
              zIndex={1000}
              padding="10px"
              overflowX="auto"
              whiteSpace="nowrap"
            >
              {filteredUsernames.map((username, index) => (
                <Box
                  key={username}
                  display="flex"
                  paddingX="10px"
                  marginX="5px"
                  backgroundColor={
                    index === selectedUsernameIndex
                      ? COLORS.lightPurple
                      : "transparent"
                  }
                  color={
                    index === selectedUsernameIndex
                      ? COLORS.white
                      : COLORS.black
                  }
                  borderRadius="15px"
                  style={{
                    cursor: "pointer",
                    flexWrap: "nowrap",
                    boxShadow:
                      index === selectedUsernameIndex
                        ? `2px 2px 4px 2px ${COLORS.pink}`
                        : `2px 2px 4px 2px ${COLORS.lighterGrey}`,
                  }}
                  onClick={() => insertUsername(username)}
                >
                  <Text padding={0} style={{ width: "max-content" }}>
                    {username}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {!isMobile && (
          <Box
            position="absolute"
            right={5}
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding="0 10px"
            backgroundColor={message ? COLORS.lightPurple : undefined}
            borderRadius={10}
            style={{
              transition: "background-color 0.4s",
              cursor: "pointer",
            }}
            onClick={handleSubmit}
          >
            <Icon name="send" color={message ? COLORS.pink : undefined} />
          </Box>
        )}
      </Box>
    </form>
  );
};

export default SendMessageForm;
