import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  Fragment,
} from "react";
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
  Span,
} from "../../components";

import VideoModal from "../../modules/gridSearch/video-modal";
import { COLORS } from "../../constants";
import { useHistory, useLocation } from "react-router-dom";
import { useClient } from "../../client";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Context from "../../context";

const Message = () => {
  const history = useHistory();
  const location = useLocation();
  const { state, dispatch } = useContext(Context);
  const client = useClient();
  const currentUser = state.currentUser;
  const { sentVideos, receivedVideos } = currentUser;
  const [loading, setLoading] = useState(false);
  const mobile = useMediaQuery("(max-width: 650px)");
  const senderID = useMemo(
    () => new URLSearchParams(location.search).get("sender"),
    [location.search]
  );

  const [groupedReceived, setGroupedReceived] = useState([]);
  const [openReport, setOpenReport] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (receivedVideos?.length && senderID) {
      groupVideosBySender(receivedVideos, sentVideos);
    }
  }, [senderID, receivedVideos, sentVideos]);

  const setBlocked = async (data) => {
    setIsBlocked(false);
    const user = data.find((video) => video.sender._id === senderID);

    if (
      user?.sender.blockedUsers.some((user) => user._id === currentUser._id)
    ) {
      setIsBlocked(true);
    }
  };

  const groupVideosBySender = async (receivedVids, sentVids) => {
    setLoading(true);
    try {
      const array = [
        ...receivedVids.filter((video) => video.sender._id === senderID),
        ...sentVids.filter((video) => video.receiver._id === senderID),
      ];

      const data = orderByCreatedAt(array);
      setGroupedReceived(data);
      await setBlocked(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const orderByCreatedAt = (array) => {
    return array.sort(
      (a, b) =>
        new Date(parseInt(a.createdAt)) - new Date(parseInt(b.createdAt))
    );
  };

  const handleOnClick = () => {
    history.push({ pathname: "/message-center" });
  };

  const handleProfileClick = async () => {
    const user = groupedReceived.find((video) => video.sender._id === senderID);
    if (user) {
      dispatch({ type: "UPDATE_PROFILE", payload: user.sender });
      dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
    }
  };

  const toggleModal = () => {
    try {
      if (currentUser.plan.messages <= currentUser.plan.messagesSent) {
        window.ReactNativeWebView.postMessage("BUY_MESSAGES");

        return;
      }
      dispatch({ type: "TOGGLE_VIDEO", payload: !state.showVideo });
    } catch (err) {
      console.log(err);
    }
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
              withShadow={true}
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
          marginTop={20}
          justifyContent="space-around"
          height={"auto"}
          width="100vw"
          column
        >
          {groupedReceived.map((video, i) => {
            const isSender = video.sender._id === currentUser._id;
            const verb = isSender ? "Sent" : "Received";
            const action =
              !video.viewed && !isSender
                ? "Watch Me"
                : video.viewed
                ? "Viewed ✅"
                : "Sent";

            return (
              <Box
                key={`${video.publicId}-${i}`}
                width={mobile ? "95%" : "98%"}
                display="flex"
                justifyContent={isSender ? "flex-end" : "flex-start"}
                padding="10px"
              >
                <Box
                  column
                  maxWidth={300}
                  alignItems="center"
                  display="flex"
                  marginTop={20}
                >
                  {!isSender && (
                    <Box position={"absolute"} top={-30} right={0}>
                      <Icon
                        style={{ zIndex: 1000 }}
                        name="threeDot"
                        size={ICON_SIZES.XX_LARGE}
                        color={COLORS.vividBlue}
                        onClick={() => handleToggleBottomDrawer(video)}
                      />
                    </Box>
                  )}

                  <VideoPlayer
                    videoUrl={video.url}
                    publicId={video.publicId}
                    controls={true}
                    height={250}
                    width={"auto"}
                    borderRadius={"10px"}
                    fullScreen={true}
                    receiverWatching={video.receiver._id === currentUser._id}
                    _id={video._id}
                    client={client}
                  />

                  <Text center bold margin={0} marginTop={5}>
                    {verb} Video{" "}
                    <Span
                      fontSize={FONT_SIZES.SMALL}
                      color={COLORS.facebookBlue}
                    >
                      {formatDistanceToNow(Number(video.createdAt))} ago
                    </Span>
                  </Text>
                  <Text
                    color={COLORS.facebookBlue}
                    margin={0}
                    center
                    fontSize={FONT_SIZES.SMALL}
                  >
                    {action}
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
            color={isBlocked ? COLORS.lightGrey : COLORS.white}
            style={{
              borderBottom: `solid 2px ${COLORS.pink}`,
              boxShadow: `2px 2px 4px 2px ${COLORS.pink}`,
              borderRadius: 25,
              marginBottom: "5%",
            }}
          >
            {isBlocked ? (
              <Box
                justifyContent={"center"}
                width={"90%"}
                style={{ alignItems: "center" }}
              >
                <Icon
                  name="block"
                  size={ICON_SIZES.LARGE}
                  color={COLORS.textRed}
                />{" "}
                <Text
                  fontSize={FONT_SIZES.LARGE}
                  bold
                  margin={2}
                  color={COLORS.black}
                  center
                >
                  Blocked
                </Text>
              </Box>
            ) : (
              <Text
                fontSize={FONT_SIZES.LARGE}
                bold
                margin={2}
                color={COLORS.black}
              >
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
                setGroupedReceived([
                  ...updatedGroupReceived.slice(0, insertIndex),
                  createVideo,
                  ...updatedGroupReceived.slice(insertIndex),
                ]);
                return;
              }

              setGroupedReceived([...groupedReceived, createVideo]);
              setLoading(false);
              dispatch({ type: "TOGGLE_VIDEO", payload: false });
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
