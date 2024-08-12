import React, { useState, useEffect } from "react";
import { Icon, Box, Text } from "../../components";
import { COLORS } from "../../constants";
import { isMobile } from "react-device-detect";

const SendMessageForm = ({
  sendMessage,
  currentUserID,
  dispatch,
  disabled,
  usernames,
}) => {
  const [message, setMessage] = useState("");
  const [filteredUsernames, setFilteredUsernames] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUsernameIndex, setSelectedUsernameIndex] = useState(0);

  useEffect(() => {
    const lastWord = message.split(" ").pop();
    if (lastWord.startsWith("@")) {
      const query = lastWord.slice(1).toLowerCase();
      const matchingUsernames = usernames.filter((username) =>
        username.toLowerCase().startsWith(query)
      );
      setFilteredUsernames(matchingUsernames);
      setShowDropdown(matchingUsernames.length > 0);
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
      } else if (e.key === "Enter" && filteredUsernames.length > 0) {
        insertUsername(filteredUsernames[selectedUsernameIndex]);
        e.preventDefault();
      }
    }
  };

  const insertUsername = (username) => {
    const words = message.split(" ");
    words.pop();
    setMessage(`${words.join(" ")} @${username} `);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  const handleIsLoggedIn = () => {
    if (!currentUserID) {
      dispatch({ type: "TOGGLE_SIGNUP", payload: true });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="send-message-form"
      onClick={handleIsLoggedIn}
      style={{ paddingBottom: "1%" }}
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
          />
          {showDropdown && (
            <Box
              position="absolute"
              bottom="100%"
              left="0"
              width="90%"
              backgroundColor="white"
              boxShadow="0px 2px 4px rgba(0, 0, 0, 0.2)"
              borderRadius="8px"
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
                  borderRadius="5px"
                  style={{
                    cursor: "pointer",
                    flexWrap: "nowrap",
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
