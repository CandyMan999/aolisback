import React, { useState } from "react";

import {
  Box,
  Text,
  FONT_SIZES,
  FlipCard,
  Button,
  Loading,
} from "../../../components";
import { COLORS } from "../../../constants";
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
  fetchData,
  skip,
  spinner,
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
          height={"100%"}
          column
          width="100%"
          alignItems="center"
          textAlign="center"
          marginTop="50px"
          backgroundColor={COLORS.lightPurple}
        >
          <Box centerText padding={"5%"}>
            <Text
              center
              fontSize={FONT_SIZES.X_LARGE}
              bold
              color={COLORS.deepPurple}
            >
              Sorry, there currently aren't any users. Try broadening what you
              are looking for in your profile. More users should be arriving
              soon since we JUST LAUNCHED.
            </Text>
          </Box>
        </Box>
      );
    }
    if (!users.length && search === "Matches") {
      return (
        <Box
          display={"flex"}
          height={"100%"}
          column
          width="100%"
          alignItems="center"
          textAlign="center"
          marginTop="50px"
          backgroundColor={COLORS.lightPurple}
        >
          <Box centerText padding={"5%"}>
            <Text
              center
              fontSize={FONT_SIZES.X_LARGE}
              bold
              color={COLORS.deepPurple}
            >
              No matches yet? Don't worry! Take the initiative and send some
              likes and video messages. Our community is growing rapidly since
              our recent launch, so stay active and new matches will come your
              way soon.
            </Text>
          </Box>
        </Box>
      );
    }
    if (!users.length && search === "My Likes") {
      return (
        <Box
          display={"flex"}
          height={"100%"}
          column
          width="100%"
          alignItems="center"
          textAlign="center"
          marginTop="50px"
          backgroundColor={COLORS.lightPurple}
        >
          <Box centerText padding={"5%"}>
            <Text
              center
              fontSize={FONT_SIZES.X_LARGE}
              bold
              color={COLORS.deepPurple}
            >
              You haven't liked anyone yet! Get out there and start mingling.
              With our recent launch, more users are joining every day,
              increasing your chances of reeling in connections.
            </Text>
          </Box>
        </Box>
      );
    }
    if (!users.length && search === "Likes Me") {
      return (
        <Box
          display={"flex"}
          height={"100%"}
          column
          width="100%"
          alignItems="center"
          textAlign="center"
          marginTop="50px"
          backgroundColor={COLORS.lightPurple}
        >
          <Box centerText padding={"5%"}>
            <Text
              center
              fontSize={FONT_SIZES.X_LARGE}
              bold
              color={COLORS.deepPurple}
            >
              It looks like you haven't received any likes yet. Don't be
              discouraged! Take the initiative and start sending likes and video
              messages to connect with others. Remember, Gone Chatting is a new
              and growing community. More users are joining every day,
              increasing your chances of reeling in connections. Stay active and
              keep engaging!
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
        {users.length
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
      {users.length && search === "Browse" && users.length % 50 === 0 && (
        <Box width="100%" display="flex" justifyContent="center">
          <Button
            onClick={() => fetchData(true)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `0px 2px 10px ${COLORS.pink}`,
              borderRadius: "20px",
              border: `solid 1px ${COLORS.pink}`,
              marginTop: 40,
              height: 60,
            }}
            disabled={spinner}
            width="80%"
            color={spinner ? COLORS.white : COLORS.black}
          >
            {spinner ? (
              <Loading logo size={50} />
            ) : (
              <Text
                bold
                fontSize={FONT_SIZES.X_LARGE}
                margin={5}
                color={COLORS.vividBlue}
              >
                Load More
              </Text>
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
};

const gridStyle = (mobile) =>
  css({
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
    justifyItems: "center",
    paddingBottom: "0px",

    marginBottom: "0px",
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
