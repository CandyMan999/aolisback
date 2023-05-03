import React, { useState } from "react";

import { Box, Text, FONT_SIZES, FlipCard } from "../../../components";
import ProfileCardFront from "../profile-card-front";
import ProfileCardBack from "../profile-card-back/ProfileCardBack";

import { css } from "@emotion/css";

const SearchResults = ({
  mobile,
  users,
  state,
  client,
  dispatch,
  currentUser,
}) => {
  const [activeID, setActiveID] = useState(null);

  const onUserCardClick = (id) => {
    setActiveID(id);
  };

  const handleComponent = () => {
    if (!users.length) {
      return (
        <Box display={"flex"} column justifyContent="space-around">
          <Box centerText>
            <Text fontSize={FONT_SIZES.X_LARGE} bold>
              Sorry, there currently aren't any users as we are in BETA. Please
              sign-up for our NewsLetter to be notified when new users arrive!
            </Text>
          </Box>
        </Box>
      );
    }
  };

  return (
    <Box
      className={gridStyle(mobile)}
      style={{ display: users.length ? "grid" : "" }}
      width="100%"
      height="100%"
      justifyContent="space-around"
    >
      {!!users.length
        ? users.map((user, i) => (
            <FlipCard
              frontContent={
                <ProfileCardFront
                  state={state}
                  user={user}
                  key={`${user.username}-${i}`}
                  name={`${user.username}`}
                  onClick={() => onUserCardClick(user._id)}
                  photos={user.pictures}
                  online={user.isLoggedIn}
                  activeID={activeID}
                />
              }
              backContent={
                <ProfileCardBack
                  state={state}
                  user={user}
                  key={`${user.username}-${i}`}
                  name={`${user.username}`}
                  onClick={() => onUserCardClick(user._id)}
                  photos={user.pictures}
                  online={user.isLoggedIn}
                  activeID={activeID}
                />
              }
            />
          ))
        : handleComponent()}
    </Box>
  );
};

const gridStyle = (mobile) =>
  css({
    // display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    justifyItems: "center",
    paddingBottom: "0px",
    marginBottom: "0px",
    maxHeight: mobile ? undefined : "1220px",
    overflowY: !mobile ? "scroll" : "scroll",
    "@media (max-width: 1180px)": {
      gridTemplateColumns: "1fr 1fr 1fr",
    },
    "@media (max-width: 840px)": {
      gridTemplateColumns: "1fr 1fr",
    },
    "::-webkit-scrollbar": {
      display: "none",
    },
  });

export default SearchResults;
