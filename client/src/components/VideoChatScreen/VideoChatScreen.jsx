import React, { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";
import iOSLogo from "../../pictures/iOSLogo.png";
import Context from "../../context";
import {
  UPDATE_VIDEO_CHAT_REQUEST,
  SEND_PHONE_NUMBER,
  CALL_DURATION_MUTATION,
} from "../../graphql/mutations";
import { Loading, Button, Text, FONT_SIZES, Box } from "../../components";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useClient } from "../../client";

const VideoChatScreen = ({ showScreen, handleShutScreen }) => {
  const { state, dispatch } = useContext(Context);
  const client = useClient();
  const { videoChatRequest, currentUser } = state;
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showThumbsUp, setShowThumbsUp] = useState(false);
  const [disableSendNumber, setDisableSendNumber] = useState(false);
  const intervalIdRef = useRef(null); // Use useRef to store interval ID
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoChatRequest && videoChatRequest.status === "Accept") {
      const roomName = `${videoChatRequest.sender.username}-${videoChatRequest.receiver.username}`;
      setRoomName(roomName);
      setIsMeetingStarted(true);
    }
  }, [videoChatRequest]);

  useEffect(() => {
    if (roomName && isMeetingStarted) {
      setTimeout(() => {
        setIsApiReady(true);
      }, 1000);
    }
  }, [roomName, isMeetingStarted]);

  const handleParticipantLeft = async () => {
    try {
      handleHangup();

      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    } catch (err) {
      console.log("error ending video call: ", err);
    }
  };

  const handleHangup = async () => {
    try {
      handleShutScreen();

      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      const variables = {
        _id: videoChatRequest._id,
        senderID: videoChatRequest.sender._id,
        receiverID: videoChatRequest.receiver._id,
        status: "Cancel",
      };

      await client.request(UPDATE_VIDEO_CHAT_REQUEST, variables);
    } catch (err) {
      console.log("error ending video call: ", err);
    }
  };

  const handleFigureWhosExpoToken = () => {
    const user =
      videoChatRequest.receiver.username === state.currentUser.username
        ? videoChatRequest.sender
        : videoChatRequest.receiver;
    return user.expoToken;
  };

  const handleSendPhoneNumber = async () => {
    try {
      setLoading(true);
      const variables = {
        username: currentUser.username,
        phoneNumber: currentUser.phoneNumber,
        expoToken: handleFigureWhosExpoToken(),
        imageUrl: currentUser.pictures.length
          ? currentUser.pictures[0].url
          : "",
      };

      const { sendPhoneNumber: status } = await client.request(
        SEND_PHONE_NUMBER,
        variables
      );

      if (!!status) {
        setShowThumbsUp(true);
        setTimeout(() => setShowThumbsUp(false), 2000); // Show thumbs up for 2 seconds
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleTimeLeft = () => {
    try {
      const videoSecondsUsed = currentUser.plan.videoMinutesUsed;
      const totalVideoSecondsAvailable = currentUser.plan.videoMinutes;

      const remainingSeconds = totalVideoSecondsAvailable - videoSecondsUsed;

      if (remainingSeconds < 0) {
        return "0 min 0 secs"; // All available minutes are used up
      }

      const minutesLeft = Math.floor(remainingSeconds / 60);
      const secondsLeft = remainingSeconds % 60;

      return `${minutesLeft} min ${secondsLeft} secs`; // or `${minutesLeft}:${secondsLeft}`
    } catch (err) {
      console.log("err calc minutes left: ", err);
    }
  };

  const handleParticipantJoined = async () => {
    const sendApiCall = async () => {
      try {
        const variables = {
          userID: currentUser._id,
          time: 10,
        };

        const { callDuration } = await client.request(
          CALL_DURATION_MUTATION,
          variables
        );

        if (callDuration.outOfTime) {
          console.log("out of time");
          // send info via response to react app
          window.ReactNativeWebView.postMessage("OUT_OF_TIME");
        }

        dispatch({
          type: "UPDATE_USER_PLAN",
          payload: callDuration.user.plan,
        });
      } catch (err) {
        console.log(err);
      }
    };

    intervalIdRef.current = setInterval(() => {
      sendApiCall();
    }, 10000); // 10 seconds interval
  };

  // Clear interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return (
    videoChatRequest &&
    videoChatRequest.status === "Accept" && (
      <motion.div
        initial={{ height: "0vh" }}
        animate={{ height: showScreen ? "100vh" : "0vh" }}
        transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          bottom: 0,
          zIndex: 30000,
          backgroundColor: COLORS.white,
        }}
      >
        <Box column style={{ position: "absolute", top: 0, left: 0 }}>
          <img height={100} width={100} src={iOSLogo} alt="Watermark-logo" />
          <Text center paddingLeft={"2%"} bold margin={0}>
            Available Time
          </Text>
          <Text
            bold
            paddingLeft={"2%"}
            margin={0}
            center
            color={COLORS.pink}
            style={{ padding: 0 }}
            fontSize={FONT_SIZES.SMALL}
          >
            {handleTimeLeft()}
          </Text>
        </Box>

        {isApiReady &&
          isMeetingStarted &&
          currentUser.expoToken &&
          videoChatRequest.receiver.expoToken && (
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: window.innerHeight - 100 }}
              dragElastic={0.2}
              onDragStart={() => setDisableSendNumber(true)}
              onDragEnd={() => setDisableSendNumber(false)}
              style={{
                position: "absolute",
                top: 20,
                right: "10%",
                zIndex: 30001,
                width: "30%", // fixed width
              }}
            >
              <Button
                id="send-phone"
                onClick={disableSendNumber ? undefined : handleSendPhoneNumber}
                width={"100%"}
                disabled={showThumbsUp || loading}
                color={COLORS.white}
                style={{
                  borderBottom: `solid 2px ${COLORS.pink}`,
                  boxShadow: `2px 2px 4px 2px ${COLORS.pink}`,
                  borderRadius: 25,
                  padding: 0,
                  minHeight: 40,
                  // width: "30%",
                  opacity: 0.8,
                }}
              >
                {loading ? (
                  <Loading bar color={COLORS.pink} size={20} />
                ) : (
                  <Text
                    center
                    color={COLORS.pink}
                    style={{ padding: 0 }}
                    fontSize={FONT_SIZES.SMALL}
                  >
                    {showThumbsUp ? "👍" : "Send Phone #"}
                  </Text>
                )}
              </Button>
            </motion.div>
          )}

        {!isApiReady ? (
          <Loading ring color={COLORS.pink} size={250} />
        ) : (
          isMeetingStarted && (
            <JitsiMeeting
              domain="jitsi.gonechatting.com"
              roomName={roomName}
              configOverwrite={{
                prejoinPageEnabled: false,
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                disableModeratorIndicator: true,
                startScreenSharing: false,
                enableEmailInStats: false,
                disableDeepLinking: true,
                disableEndConference: true,
                enableFeaturesBasedOnToken: false,
                disableThirdPartyRequests: true,
              }}
              interfaceConfigOverwrite={{
                TOOLBAR_BUTTONS: [
                  "microphone",
                  "camera",
                  "desktop",
                  "hangup",
                  "tileview",
                  "toggle-camera",
                  "settings",
                ],
              }}
              userInfo={{
                displayName: state.currentUser.username,
              }}
              onApiReady={(externalApi) => {
                externalApi.addListener("videoConferenceLeft", handleHangup);
                externalApi.addListener(
                  "participantJoined",
                  handleParticipantJoined
                );
                externalApi.addListener(
                  "participantLeft",
                  handleParticipantLeft
                );

                externalApi.executeCommand(
                  "pinParticipant",
                  videoChatRequest.receiver.username ===
                    state.currentUser.username
                    ? videoChatRequest.sender.username
                    : videoChatRequest.receiver.username
                );
              }}
              getIFrameRef={(iframeRef) => {
                iframeRef.style.height = "100%";
              }}
            />
          )
        )}
      </motion.div>
    )
  );
};

export default VideoChatScreen;
