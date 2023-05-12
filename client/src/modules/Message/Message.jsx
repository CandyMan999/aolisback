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
} from "../../components";
import { COLORS } from "../../constants";
import { useHistory, useLocation } from "react-router-dom";
import VideoModal from "../gridSearch/video-modal";
import Profile from "../../modules/profile";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Context from "../../context";

const Message = () => {
  let history = useHistory();
  const location = useLocation();
  const { state, dispatch } = useContext(Context);
  const currentUser = state.currentUser;
  const { sentVideos, receivedVideos } = currentUser;
  const [loading, setLoading] = useState(false);
  const mobile = useMediaQuery("(max-width: 650px)");
  const senderID = new URLSearchParams(location.search).get("sender");

  const [groupedReceived, setGroupReceived] = useState(null);

  useEffect(() => {
    if (receivedVideos && !!receivedVideos.length && !!senderID) {
      groupVideosBySender(receivedVideos, sentVideos);
    }
  }, [senderID, currentUser]);

  useEffect(() => {
    console.log("state; ", state);
  }, [state]);
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
      console.log("ordered: ", data);
      setGroupReceived(data);
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

  return loading ? (
    <Loading fade size={100} />
  ) : (
    groupedReceived && !!groupedReceived.length && (
      <Fragment>
        <Box
          width="100%"
          display="flex"
          justifyContent="space-around"
          paddingX={"3%"}
          backgroundColor={COLORS.lighterGrey}
        >
          <Box marginTop={5} onClick={handleProfileClick} center width={"70%"}>
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
              height={140}
              width={140}
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
              name="back"
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
          minHeight={"60vH"}
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
                  <Box column>
                    <VideoPlayer
                      publicId={video.publicId}
                      controls={true}
                      height={100}
                      width={150}
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
          <Box width="100%">
            <Button width="100%" onClick={toggleModal}>
              Reply
            </Button>
          </Box>
        </Box>
        {state.showVideo && (
          <VideoModal
            onClose={toggleModal}
            receiverID={senderID}
            senderID={currentUser._id}
          />
        )}
        <Subscription
          subscription={CREATE_VIDEO_SUBSCRIPTION}
          onSubscriptionData={({ subscriptionData }) => {
            const { createVideo } = subscriptionData.data;
            console.log("subscription data: ", createVideo);
            if (
              (createVideo.sender._id === senderID &&
                createVideo.receiver._id === currentUser._id) ||
              (createVideo.sender._id === currentUser._id &&
                createVideo.receiver._id === senderID)
            )
              setGroupReceived([...groupedReceived, createVideo]);
          }}
        />
        <Profile mobile={mobile} userClicked={state.profile} />
      </Fragment>
    )
  );
};

export default Message;
