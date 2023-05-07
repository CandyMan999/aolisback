import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Subscription } from "react-apollo";

import { Box, Text, Button, VideoPlayer, Loading } from "../../../components";
import { COLORS } from "../../../constants";
import { GET_VIDEOS_QUERY } from "../../../graphql/queries";
import { CREATE_VIDEO_SUBSCRIPTION } from "../../../graphql/subscriptions";

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
}) => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleGetVideos();
  }, [currentUser.sentVideos]);

  const handleMessage = () => {
    openModal();
  };
  let history = useHistory();

  const handleRoomClick = (roomId) => {
    dispatch({ type: "CHANGE_ROOM", payload: roomId });
    history.push("/");
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
        <Box card column padding={5} marginTop={25} onClick={handleMessage}>
          <Text bold margin={0}>
            No Messages!
          </Text>
          <Text bold margin={0}>
            Try sending a Video Message!
          </Text>
        </Box>
      )}
      {!!user.room && online && user.room.name && (
        <Button width={"100%"}>
          <Text
            margin={0}
            onClick={() => handleRoomClick(user.room._id)}
            center
          >
            Current Room: {user.room.name}
          </Text>
        </Button>
      )}
      {loading ? (
        <Loading ring />
      ) : video ? (
        <Box style={{ display: "contents" }} key={video.publicId}>
          <VideoPlayer publicId={video.publicId} width={150} height={280} />
        </Box>
      ) : undefined}

      <Box
        width="105%"
        background={`${COLORS.vividBlue}22`}
        bottom={0}
        justifyContent="center"
        height={40}
        alignItems="center"
      >
        {/* <Icon name="distance" color={COLORS.red} size={ICON_SIZES.LARGE} /> */}
        <Text onClick={handleMessage}> Send Video Message</Text>{" "}
        {/* <Subscription
          subscription={CREATE_VIDEO_SUBSCRIPTION}
          onSubscriptionData={({ subscriptionData }) => {
            const { createVideo } = subscriptionData.data;

            setVideo(createVideo);
          }}
        /> */}
      </Box>
    </motion.div>
  );
};

export default ProfileCardBack;
