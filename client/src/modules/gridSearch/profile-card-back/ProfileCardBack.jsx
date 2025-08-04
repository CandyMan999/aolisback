import React, { useEffect, useState } from "react";
import { MdVideoChat } from "react-icons/md";
import { RiUserHeartFill } from "react-icons/ri";
import {
  Box,
  Text,
  VideoPlayer,
  Loading,
  RoomLink,
  Icon,
  ICON_SIZES,
} from "../../../components";
import VideoModal from "../video-modal/VideoModal";
import { COLORS } from "../../../constants";
import { GET_VIDEOS_QUERY } from "../../../graphql/queries";
import { motion } from "framer-motion";

const SendMessageButton = ({ onClick }) => {
  return (
    <motion.div
      style={{ alignItems: "center", flexDirection: "column", display: "flex" }}
      whileTap={{ scale: 0.6 }}
      onClick={onClick}
    >
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(90deg, ${COLORS.main} 0%, ${COLORS.pink} 100%)`,
          borderRadius: "50%",
          marginTop: 15,
          cursor: "pointer",
          width: "122px",
          height: "122px",
          boxShadow: `0px 4px 6px ${COLORS.grey}`,
          border: `1px solid ${COLORS.lightGrey}`,
        }}
      >
        <Box
          style={{
            borderRadius: "50%",
            padding: "8px",
            opacity: 0.8,
          }}
        >
          <MdVideoChat size={70} color={COLORS.vividBlue} />
        </Box>
      </Box>
      <Text
        style={{
          color: COLORS.black,
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        Send Video Message
      </Text>
    </motion.div>
  );
};

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

  const handleSendVideoMessage = () => {
    try {
      if (
        currentUser.plan.messages + currentUser.plan.additionalMessages <=
        currentUser.plan.messagesSent
      ) {
        window.ReactNativeWebView.postMessage("BUY_MESSAGES");

        return;
      }

      if (mobile) {
        const receiverID = activeID;
        const senderID = currentUser._id;

        const data = {
          senderID,
          receiverID,
          videoMessage: true,
        };

        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        } else {
          console.warn("ReactNativeWebView is not available.");
        }
      } else {
        dispatch({ type: "TOGGLE_VIDEO", payload: !state.showVideo });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setBlocked = () => {
    setIsBlocked(false);
    user.blockedUsers.find((blockedUser) => {
      if (blockedUser._id === currentUser._id) {
        setIsBlocked(true);
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
        const lastVideo = getVideos.pop();
        setVideo(lastVideo);
      }
      setLoading(false);
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
        width: "100%",
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
        background: video ? COLORS.black : undefined,
        border:
          activeID === user._id
            ? `3px solid ${COLORS.pink}`
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
          color={video ? COLORS.pink : COLORS.vividBlue}
        />
      </Box>

      <motion.div
        style={{ position: "absolute", top: 12, right: 5, zIndex: 20 }}
        whileTap={{ scale: 0.3 }} // Scale down when tapped
        onClick={handleSetProfile}
      >
        <RiUserHeartFill
          size={35}
          color={video ? COLORS.pink : COLORS.vividBlue}
          style={{ padding: "5px" }}
        />
      </motion.div>

      {!video && !loading && (
        <Box
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          column
        >
          <SendMessageButton
            onClick={isBlocked ? undefined : handleSendVideoMessage}
          />
        </Box>
      )}

      {!!user.room && online && user.room.name && video && (
        <RoomLink dispatch={dispatch} user={user} video={video} />
      )}

      {loading ? (
        <Loading ring />
      ) : video ? (
        <Box
          style={{
            display: "contents",
            overflow: "hidden",
          }}
          key={video.publicId}
        >
          <VideoPlayer
            videoUrl={video.url}
            width={150}
            height={280}
            controls={true}
            fullScreen={false}
            borderRadius="8px 8px 8px 8px"
          />
          <Box position="absolute" bottom={2} zIndex={20}>
            <Text color={COLORS.white}>
              {video.viewed ? "Viewed ✅" : "Sent"}
            </Text>
          </Box>
        </Box>
      ) : undefined}

      <Box
        width="105%"
        background={`${COLORS.vividBlue}22`}
        bottom={0}
        justifyContent="center"
        height={40}
        style={{ display: video ? "none" : undefined }}
        alignItems="center"
        borderRadius="0px 0px 10px 10px"
        onClick={isBlocked ? undefined : handleSendVideoMessage}
      >
        {isBlocked && (
          <Icon name="block" color={COLORS.red} size={ICON_SIZES.LARGE} />
        )}
        <Text> {isBlocked ? "Blocked" : "No Messages Yet"}</Text>
      </Box>
    </motion.div>
  );
};

export default ProfileCardBack;
