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
  search,
}) => {
  const [activeID, setActiveID] = useState(null);

  const onUserCardClick = (id) => {
    setActiveID(id);
  };

  const toggleModal = () => {
    dispatch({ type: "TOGGLE_VIDEO", payload: !state.showVideo });
  };

  const handleComponent = () => {
    if (!users.length && search === "Browse") {
      return (
        <Box
          display={"flex"}
          height={"50%"}
          column
          width="100%"
          justifyContent="space-around"
          alignItems="center"
        >
          <Box centerText padding={"5%"}>
            <Text center fontSize={FONT_SIZES.X_LARGE} bold>
              Sorry, there currently aren't any users. Try broadening what you
              are looking for in your profile. More users should be arriving
              soon as we are in BETA.
            </Text>
          </Box>
        </Box>
      );
    }
    if (!users.length && search === "Matches") {
      return (
        <Box
          display={"flex"}
          height={"50%"}
          column
          width="100%"
          justifyContent="space-around"
          alignItems="center"
        >
          <Box centerText padding={"5%"}>
            <Text center fontSize={FONT_SIZES.X_LARGE} bold>
              Sorry, you got no matches you UGLY FUCK!
            </Text>
          </Box>
        </Box>
      );
    }
    if (!users.length && search === "My Likes") {
      return (
        <Box
          display={"flex"}
          height={"50%"}
          column
          width="100%"
          justifyContent="space-around"
          alignItems="center"
        >
          <Box centerText padding={"5%"}>
            <Text center fontSize={FONT_SIZES.X_LARGE} bold>
              You haven't Liked anyone yet. What, you too fucking good to like
              someone? You're probably a 7 at best.. so don't be so fucking
              critical
            </Text>
          </Box>
        </Box>
      );
    }
    if (!users.length && search === "Likes Me") {
      return (
        <Box
          display={"flex"}
          height={"50%"}
          column
          width="100%"
          justifyContent="space-around"
          alignItems="center"
        >
          <Box centerText padding={"5%"}>
            <Text center fontSize={FONT_SIZES.X_LARGE} bold>
              Sorry ,No one likes you yet you LAME FUCK, how about trying to
              upgrade you profile or actually interact with some people?!
            </Text>
          </Box>
        </Box>
      );
    }
  };

  return (
    <Box width="100%" height={"100%"} column>
      <Box
        className={gridStyle(mobile)}
        style={{ display: users.length ? "grid" : "" }}
        width="100%"
      >
        {!!users.length
          ? users.map((user, i) => (
              <FlipCard
                key={`card${user.username}-${i}`}
                state={state}
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
                    currentUser={currentUser}
                    client={client}
                    key={`${user.username}-${i}-back`}
                    name={`${user.username}`}
                    onClick={() => onUserCardClick(user._id)}
                    photos={user.pictures}
                    online={user.isLoggedIn}
                    activeID={activeID}
                    openModal={toggleModal}
                    dispatch={dispatch}
                    mobile={mobile}
                  />
                }
              />
            ))
          : handleComponent()}
      </Box>
    </Box>
  );
};

const gridStyle = (mobile) =>
  css({
    // display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
    justifyItems: "center",
    paddingBottom: "0px",

    marginBottom: "0px",
    maxHeight: mobile ? undefined : "1220px",
    overflowY: !mobile ? "scroll" : undefined,
    "@media (max-width: 1757px)": {
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
    },
    "@media (max-width: 1589px)": {
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
    },
    "@media (max-width: 1412px)": {
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
    },
    "@media (max-width: 1245px)": {
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
    },
    "@media (max-width: 1090px)": {
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    },
    "@media (max-width: 907px)": {
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
    },
    "@media (max-width: 743px)": {
      gridTemplateColumns: "1fr 1fr 1fr",
    },
    "@media (max-width: 543px)": {
      gridTemplateColumns: "1fr 1fr",
    },
    "::-webkit-scrollbar": {
      display: "none",
    },
  });

export default SearchResults;
