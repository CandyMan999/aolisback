import React, { useEffect, useState } from "react";

import {
  Box,
  Text,
  VideoPlayer,
  Loading,
  RoomLink,
  Icon,
  ICON_SIZES,
} from "../../../components";
import { COLORS } from "../../../constants";
import { GET_VIDEOS_QUERY } from "../../../graphql/queries";

import { motion } from "framer-motion";

const ProfileCardBack = ({
  online,
  currentUser,
  user,
  activeID,
  onClick,
  openModal,
  dispatch,
  client,
  mobile,
  state,
}) => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    handleGetVideos();
    setBlocked();
  }, [currentUser.sentVideos]);

  const handleMessage = async () => {
    await dispatch({ type: "UPDATE_PROFILE", payload: user });
    openModal();
  };

  const setBlocked = () => {
    setIsBlocked(false);
    user.blockedUsers.find((user) => {
      if (user._id === currentUser._id) {
        return setIsBlocked(true);
      }
    });
  };

  const handleGetVideos = async () => {
    try {
      setLoading(true);
      const variables = {
        senderID: currentUser._id,
        receiverID: user._id,
      };

      const { getVideos } = await client.request(GET_VIDEOS_QUERY, variables);
      if (getVideos) {
        const lastVideo = await getVideos.pop();

        setVideo(lastVideo);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log("err getting videos, profile card back: ", err);
    }
  };

  const handleSetProfile = async () => {
    await dispatch({ type: "UPDATE_PROFILE", payload: user });
    dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
  };

  return (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 150,
        minWidth: 150,
        height: 280,
        margin: 4,
        alignItems: "center",
        textAlign: "center",
        marginTop: 12,
        marginBottom: 12,
        paddingLeft: video ? 0 : 2,
        paddingRight: video ? 0 : 2,
        cursor: "pointer",
        borderRadius: "10px",
        justifyContent: "space-between",
        boxShadow: `0px 0px 5px 1px ${COLORS.lightGrey}`,
        border:
          activeID === user._id
            ? `3px solid ${COLORS.yellow}`
            : `1px solid ${COLORS.grey}`,
      }}
      onClick={() => onClick(user._id)}
    >
      {!!user.room && online && user.room.name && !video && (
        <Box marginTop={40}>
          <RoomLink dispatch={dispatch} user={user} video={video} />
        </Box>
      )}
      <Box position="absolute" zIndex={19} top={10} left={10}>
        <Icon
          name="back"
          size={ICON_SIZES.XX_LARGE}
          color={video ? COLORS.white : COLORS.vividBlue}
        />
      </Box>

      <Box
        position="absolute"
        top={12}
        right={5}
        zIndex={20}
        onClick={handleSetProfile}
      >
        <Icon
          name="user"
          size={ICON_SIZES.X_LARGE}
          color={video ? COLORS.white : COLORS.main}
        />
      </Box>
      {!video && !loading && (
        <Box
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          column
        >
          <Box
            height={"fit-content"}
            card
            column
            padding={5}
            marginX={3}
            onClick={handleMessage}
            background={COLORS.main}
          >
            <Text color={COLORS.white} bold margin={0}>
              No Messages...
            </Text>
            <Text color={COLORS.white} bold margin={0}>
              Try sending a Video Message!
            </Text>
          </Box>
        </Box>
      )}
      {!!user.room && online && user.room.name && video && (
        <RoomLink dispatch={dispatch} user={user} video={video} />
      )}
      {loading ? (
        <Loading ring />
      ) : video ? (
        <Box style={{ display: "contents" }} key={video.publicId}>
          <VideoPlayer
            publicId={video.publicId}
            width={150}
            height={280}
            controls={true}
            mobile={mobile}
            borderRadius="10px 10px 0px 0px"
          />
        </Box>
      ) : undefined}

      <Box
        width="105%"
        background={`${COLORS.vividBlue}22`}
        bottom={0}
        justifyContent="center"
        height={40}
        alignItems="center"
        borederRadius="0px 0px 10px 10px"
        onClick={isBlocked ? undefined : handleMessage}
      >
        {isBlocked && (
          <Icon name="block" color={COLORS.red} size={ICON_SIZES.LARGE} />
        )}
        <Text> {isBlocked ? "Blocked" : "Send Video Message"}</Text>
      </Box>
    </motion.div>
  );
};

export default ProfileCardBack;
