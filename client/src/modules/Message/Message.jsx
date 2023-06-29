import React, { useContext, useState, useEffect, Fragment } from "react";
import { Subscription } from "react-apollo";
import { formatDistanceToNow } from "date-fns";
import { CREATE_VIDEO_SUBSCRIPTION } from "../../graphql/subscriptions";
import {
  Box,
  Icon,
  ICON_SIZES,
  VideoPlayer,
  Text,
  FONT_SIZES,
  Button,
  Loading,
  Picture,
  BottomDrawer,
} from "../../components";

import VideoModal from "../../modules/gridSearch/video-modal";
import { COLORS } from "../../constants";
import { useHistory, useLocation } from "react-router-dom";

import { useClient } from "../../client";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Context from "../../context";

const Message = () => {
  let history = useHistory();
  const location = useLocation();
  const { state, dispatch } = useContext(Context);
  const client = useClient();
  const currentUser = state.currentUser;
  const { sentVideos, receivedVideos } = currentUser;
  const [loading, setLoading] = useState(false);
  const mobile = useMediaQuery("(max-width: 650px)");
  const senderID = new URLSearchParams(location.search).get("sender");

  const [groupedReceived, setGroupReceived] = useState(null);
  const [openReport, setOpenReport] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (receivedVideos && !!receivedVideos.length && !!senderID) {
      groupVideosBySender(receivedVideos, sentVideos);
    }
  }, [senderID, currentUser]);

  const setBlocked = async (data) => {
    setIsBlocked(false);

    const user = await data.filter((video) => video.sender._id === senderID);

    user[0].sender.blockedUsers.find((user) => {
      if (user._id === currentUser._id) {
        setIsBlocked(true);
      }
    });
  };

  const groupVideosBySender = async (receivedVids, sentVids) => {
    try {
      setLoading(true);
      const array = [];

      for (const video of receivedVids) {
        const senderId = video.sender._id;

        if (senderId === senderID) {
          array.push(video);
        }
      }

      for (const video of sentVids) {
        const senderId = video.receiver._id;

        if (senderId === senderID) {
          array.push(video);
        }
      }
      const data = await orderByCreatedAt(array);

      setGroupReceived(data);
      setBlocked(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const orderByCreatedAt = (array) => {
    return array.sort((a, b) => {
      const dateA = new Date(parseInt(a.createdAt));
      const dateB = new Date(parseInt(b.createdAt));
      return dateA - dateB;
    });
  };

  const handleOnClick = () => {
    history.push({
      pathname: "/message-center",
    });
  };

  const handleProfileClick = async () => {
    const user = await groupedReceived.filter(
      (video) => video.sender._id === senderID
    );

    await dispatch({ type: "UPDATE_PROFILE", payload: user[0].sender });
    await dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
  };

  const toggleModal = () => {
    dispatch({ type: "TOGGLE_VIDEO", payload: !state.showVideo });
  };

  const handleToggleBottomDrawer = (payload) => {
    setVideo(payload);
    setOpenReport(!openReport);
  };

  return loading ? (
    <Loading fade size={100} />
  ) : (
    groupedReceived && !!groupedReceived.length && (
      <Box
        display="flex"
        column
        minHeight={"80vh"}
        width="100%"
        justifyContent="space-between"
      >
        <Box
          display="flex"
          justifyContent="space-around"
          paddingX={"3%"}
          backgroundColor={COLORS.lighterGrey}
        >
          <Box
            zIndex={4}
            marginTop={5}
            onClick={handleProfileClick}
            center
            width={"70%"}
          >
            <Picture
              profilePic={
                groupedReceived[0].sender._id === currentUser._id
                  ? groupedReceived[0].receiver.pictures[0]
                  : groupedReceived[0].sender.pictures[0]
              }
              name={
                groupedReceived[0].sender._id === currentUser._id
                  ? groupedReceived[0].receiver.username
                  : groupedReceived[0].sender.username
              }
              height={mobile ? 120 : 140}
              width={mobile ? 120 : 140}
              marginBottom={8}
            />
            <Text
              paddingLeft={"2%"}
              width={"100%"}
              bold
              fontSize={FONT_SIZES.X_LARGE}
              center
            >{`${
              groupedReceived[0].sender._id === currentUser._id
                ? groupedReceived[0].receiver.username
                : groupedReceived[0].sender.username
            }'s Messages`}</Text>
          </Box>

          <Box zIndex={20}>
            <Icon
              name="reverse"
              size={ICON_SIZES.XXX_LARGE}
              color={COLORS.black}
              onClick={handleOnClick}
            />
          </Box>
        </Box>

        <Box
          display="flex"
          margin={20}
          justifyContent="space-around"
          height={"auto"}
          // minHeight={"60vH"}
          width="auto"
          column
        >
          {groupedReceived &&
            !!groupedReceived.length &&
            groupedReceived.map((video, i) => {
              return (
                <Box
                  key={`${video.publicId}-${i}`}
                  width="100%"
                  display="flex"
                  justifyContent={
                    video.sender._id === currentUser._id
                      ? "flex-end"
                      : undefined
                  }
                >
                  <Box
                    column
                    maxWidth={300}
                    alignItems="center"
                    display="flex"
                    marginTop={20}
                  >
                    {video.sender._id !== currentUser._id && (
                      <Box position={"absolute"} top={-20} right={0}>
                        <Icon
                          style={{ zIndex: 1000 }}
                          name="threeDot"
                          size={ICON_SIZES.LARGE}
                          color={COLORS.vividBlue}
                          onClick={() => handleToggleBottomDrawer(video)}
                        />
                      </Box>
                    )}

                    <VideoPlayer
                      publicId={video.publicId}
                      controls={true}
                      height={100}
                      width={"auto"}
                      borderRadius={"10px"}
                      fullScreen={true}
                      mobile={mobile}
                      receiverWatching={video.receiver._id === currentUser._id}
                      _id={video._id}
                      client={client}
                    />

                    <Text center bold margin={0}>
                      {video.sender._id === currentUser._id
                        ? "Sent Video "
                        : "Received Video "}
                    </Text>
                    <Text
                      color={COLORS.facebookBlue}
                      margin={0}
                      center
                      fontSize={FONT_SIZES.SMALL}
                    >
                      {formatDistanceToNow(Number(video.createdAt))} ago
                    </Text>
                  </Box>
                </Box>
              );
            })}
        </Box>
        <Box width="100%" justifyContent="center">
          <Button
            disabled={isBlocked}
            width="70%"
            onClick={toggleModal}
            style={{
              borderBottom: `solid 2px ${COLORS.grey}`,
              boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
            }}
          >
            {isBlocked ? (
              <Box justifyContent={"center"} width={"90%"}>
                <Icon name="block" size={ICON_SIZES.LARGE} />{" "}
                <Text fontSize={FONT_SIZES.LARGE} bold margin={2}>
                  Blocked
                </Text>
              </Box>
            ) : (
              <Text fontSize={FONT_SIZES.LARGE} bold margin={2}>
                Reply
              </Text>
            )}
          </Button>
        </Box>

        {state.showVideo && location.pathname === "/message" && (
          <VideoModal
            onClose={toggleModal}
            receiverID={senderID}
            senderID={currentUser._id}
            state={state}
            mobile={mobile}
          />
        )}
        <Subscription
          subscription={CREATE_VIDEO_SUBSCRIPTION}
          onSubscriptionData={({ subscriptionData }) => {
            const { createVideo } = subscriptionData.data;

            if (
              (createVideo.sender._id === senderID &&
                createVideo.receiver._id === currentUser._id) ||
              (createVideo.sender._id === currentUser._id &&
                createVideo.receiver._id === senderID)
            ) {
              const existingVideo = groupedReceived.find(
                (video) => video._id === createVideo._id
              );

              if (existingVideo) {
                const updatedGroupReceived = groupedReceived.filter(
                  (video) => video._id !== createVideo._id
                );
                const insertIndex = groupedReceived.findIndex(
                  (video) => video._id === createVideo._id
                );
                setVideo(createVideo);
                setGroupReceived([
                  ...updatedGroupReceived.slice(0, insertIndex),
                  createVideo,
                  ...updatedGroupReceived.slice(insertIndex),
                ]);
                return;
              }

              setGroupReceived([...groupedReceived, createVideo]);
            }
          }}
        />

        <BottomDrawer
          isOpen={openReport}
          onClose={handleToggleBottomDrawer}
          client={client}
          dispatch={dispatch}
          video={video}
          currentUser={currentUser}
          blockID={senderID}
          blockedUsers={currentUser.blockedUsers}
        />
      </Box>
    )
  );
};

export default Message;
