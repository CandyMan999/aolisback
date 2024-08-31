import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
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
  const [changeStyle, setChangeStyle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false); // State to control visibility of the scroll button
  const mobile = useMediaQuery("(max-width: 650px)");
  const senderID = useMemo(
    () => new URLSearchParams(location.search).get("sender"),
    [location.search]
  );

  const [groupedReceived, setGroupedReceived] = useState([]);
  const [openReport, setOpenReport] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [video, setVideo] = useState(null);

  // Create a ref for the bottom of the page
  const bottomRef = useRef(null);

  useEffect(() => {
    if (receivedVideos?.length && senderID) {
      groupVideosBySender(receivedVideos, sentVideos);
    }
  }, [senderID, receivedVideos, sentVideos]);

  useEffect(() => {
    // Function to check scroll position
    const handleScroll = () => {
      const scrollTop = window.scrollY; // How much the user has scrolled
      const windowHeight = window.innerHeight; // Viewport height
      const documentHeight = document.documentElement.scrollHeight; // Total height of the document

      const scrolledPercentage = (scrollTop + windowHeight) / documentHeight;

      setChangeStyle(scrollTop > 60); // fix position the header
      setShowScrollButton(scrolledPercentage < 0.7); // Hide the button if the user has scrolled more than 70%
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup scroll event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      if (
        currentUser.plan.messages + currentUser.plan.additionalMessages <=
        currentUser.plan.messagesSent
      ) {
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

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
        style={{ overflowX: "hidden" }}
      >
        <Box
          display="flex"
          justifyContent="space-around"
          paddingX={"3%"}
          position={changeStyle ? "fixed" : "relative"}
          width={changeStyle ? "100%" : undefined}
          top={changeStyle ? 0 : undefined}
          zIndex={changeStyle ? 100 : undefined}
          backgroundColor={COLORS.lightPurple}
          style={{
            borderBottom: `solid 1px ${COLORS.deepPurple}`,
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Box
            zIndex={4}
            marginTop={5}
            onClick={handleProfileClick}
            center
            width={"70%"}
          >
            <Picture
              online={
                groupedReceived[0].sender._id === currentUser._id
                  ? groupedReceived[0].receiver.isLoggedIn
                  : groupedReceived[0].sender.isLoggedIn
              }
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
              height={mobile ? (changeStyle ? 80 : 100) : 140}
              width={mobile ? (changeStyle ? 80 : 100) : 140}
              marginBottom={8}
            />

            <Text
              paddingLeft={changeStyle ? "5%" : "2%"}
              width={"100%"}
              bold
              color={COLORS.deepPurple}
              fontSize={
                changeStyle && mobile ? FONT_SIZES.MEDIUM : FONT_SIZES.LARGE
              }
              center
              style={{
                transition: "font-size 0.3s ease, padding-left 0.3s ease", // Smooth transition for text size and padding
              }}
            >{`${
              groupedReceived[0].sender._id === currentUser._id
                ? groupedReceived[0].receiver.username
                : groupedReceived[0].sender.username
            }'s Messages`}</Text>
          </Box>

          <Box
            zIndex={20}
            column
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              name="reverse"
              size={ICON_SIZES.XXX_LARGE}
              color={COLORS.deepPurple}
              onClick={handleOnClick}
              style={{ margin: 0 }}
            />
          </Box>
        </Box>

        {/* Fixed Scroll to Bottom Button */}
        {showScrollButton && (
          <Box
            style={{
              position: "fixed",
              bottom: "3%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              onClick={scrollToBottom}
              style={{
                backgroundColor: COLORS.white,
                width: "fit-content",
                borderRadius: "50%",
                boxShadow: `0px 2px 10px 2px ${COLORS.lightGrey}`,
                border: `solid 1px ${COLORS.vividBlue}`,
                padding: "10px",
              }}
            >
              <Icon
                margin={0}
                padding={0}
                name={"arrowDown"}
                color={COLORS.vividBlue}
                size={ICON_SIZES.XXX_LARGE}
              />
            </Box>
          </Box>
        )}

        <Box
          display="flex"
          marginTop={20}
          paddingTop={changeStyle ? 120 : 0}
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
                    flagged={video.flagged}
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
              dispatch({
                type: "UPDATE_USER_PLAN",
                payload: createVideo.sender.plan,
              });
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

        {/* Element to scroll to */}
        <div ref={bottomRef} />
      </Box>
    )
  );
};

export default Message;
