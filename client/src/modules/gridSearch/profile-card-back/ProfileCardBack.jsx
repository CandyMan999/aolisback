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
  photos,
  name,
  currentUser,
  user,
  activeID,
  onClick,
  openModal,
  dispatch,
  client,
  mobile,
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
        paddingLeft: 2,
        paddingRight: 2,
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
      {!video && (
        <Box height="100%" display="flex" alignItems="center">
          <Box
            height={"fit-content"}
            card
            column
            padding={5}
            marginTop={25}
            onClick={handleMessage}
          >
            <Text bold margin={0}>
              No Messages!
            </Text>
            <Text bold margin={0}>
              Try sending a Video Message!
            </Text>
          </Box>
        </Box>
      )}
      {!!user.room && online && user.room.name && (
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
