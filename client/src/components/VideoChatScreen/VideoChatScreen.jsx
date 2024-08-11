import React, { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";
import iOSLogo from "../../pictures/iOSLogo.png";
import { RiCameraLensFill } from "react-icons/ri";
import axios from "axios";
import notification from "../../sounds/shutter.mp3";
import Context from "../../context";
import {
  UPDATE_VIDEO_CHAT_REQUEST,
  SEND_PHONE_NUMBER,
  CALL_DURATION_MUTATION,
  FLAG_PHOTO_MUTATION,
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
  const [showSendNumberButton, setShowSendNumberButton] = useState(true);
  const [disableSendNumber, setDisableSendNumber] = useState(false);
  const [videoPermissions, setVideoPermissions] = useState(false);
  const [audioPermissions, setAudioPermissions] = useState(false);
  const [api, setApi] = useState(null);
  const [flash, setFlash] = useState(false);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    if (videoChatRequest && videoChatRequest.status === "Accept") {
      const roomName = `${videoChatRequest.sender.username}-${videoChatRequest.receiver.username}`;
      setRoomName(roomName);
      setIsMeetingStarted(true);
    }
  }, [videoChatRequest]);

  useEffect(() => {
    if (videoPermissions && audioPermissions) {
      try {
        window.ReactNativeWebView.postMessage("SCREENSHOT_WARNING");
      } catch (err) {
        console.log(err);
      }
    }
  }, [videoPermissions, audioPermissions]);

  useEffect(() => {
    if (videoChatRequest.participantLeft) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      handleShutScreen();
    }
  }, [videoChatRequest.participantLeft]);

  useEffect(() => {
    if (roomName && isMeetingStarted) {
      setTimeout(() => {
        setIsApiReady(true);
      }, 1000);
    }
  }, [roomName, isMeetingStarted]);

  const handleParticipantLeft = async () => {
    try {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      handleShutScreen();
    } catch (err) {
      console.log("error ending video call: ", err);
    }
  };

  const handleHangup = async () => {
    try {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      handleShutScreen();
      const variables = {
        _id: videoChatRequest._id,
        senderID: videoChatRequest.sender._id,
        receiverID: videoChatRequest.receiver._id,
        status: "Cancel",
        participantLeft: true,
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
      const totalVideoSecondsAvailable =
        currentUser.plan.videoMinutes + currentUser.plan.additionalMinutes;

      const remainingSeconds = totalVideoSecondsAvailable - videoSecondsUsed;

      // If remainingSeconds is less than or equal to zero, return 0 min 0 secs
      if (remainingSeconds <= 0) {
        return "0 min 0 secs";
      }
      if (currentUser.plan.planType === "Unlimited") {
        return "Unlimited";
      }

      const minutesLeft = Math.floor(remainingSeconds / 60);
      const secondsLeft = remainingSeconds % 60;

      return `${minutesLeft} min ${secondsLeft} secs`;
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
        dispatch({
          type: "UPDATE_USER_PLAN",
          payload: callDuration.user.plan,
        });
        if (
          callDuration.outOfTime &&
          callDuration.user._id === videoChatRequest.sender._id
        ) {
          if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
          handleHangup();
          window.ReactNativeWebView.postMessage("OUT_OF_TIME");
        }
      } catch (err) {
        console.log(err);
      }
    };

    intervalIdRef.current = setInterval(() => {
      sendApiCall();
    }, 10000); // 10 seconds interval
  };

  const handleImageUpload = async (image) => {
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "northShoreExpress");
      data.append("cloud_name", "aolisback");

      const res = await axios.post(
        process.env.REACT_APP_CLOUDINARY_IMAGE,
        data
      );

      return { url: res.data.url, publicId: res.data.public_id };
    } catch (err) {
      console.log(err);
    }
  };

  const playSound = () => {
    try {
      const audio = new Audio(notification);
      audio.play();
    } catch (err) {
      console.log("err playing sound:", err);
    }
  };

  const handleScreenshot = async () => {
    try {
      if (api) {
        playSound();
        setFlash(true);

        api.captureLargeVideoScreenshot().then(async (data) => {
          const base64Response = await fetch(data.dataURL);
          const blob = await base64Response.blob();

          const { url, publicId } = await handleImageUpload(blob);

          const variables = {
            url,
            publicId,
            flaggedUserID:
              videoChatRequest.receiver._id === state.currentUser._id
                ? videoChatRequest.sender._id
                : videoChatRequest.receiver._id,
          };

          const { flagPhoto } = await client.request(
            FLAG_PHOTO_MUTATION,
            variables
          );
          setFlash(false);
          if (flagPhoto) {
            window.ReactNativeWebView.postMessage("SCREEN_SHOT_SUCCESS");
          }
        });
      }
    } catch (err) {
      console.log("error with screenshot: ", err);
    }
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
        {flash && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "white",
              zIndex: 30001,
            }}
          />
        )}
        {showSendNumberButton && (
          <Box
            column
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              alignItems: "center",
            }}
          >
            <img height={100} width={100} src={iOSLogo} alt="Watermark-logo" />
            <Box column>
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
          </Box>
        )}
        {showSendNumberButton && (
          <motion.div
            style={{
              position: "absolute",
              top: 30,
              left: "45%",
              transform: "translateX(-50%)",
              zIndex: 30001,
              cursor: "pointer",
            }}
            whileTap={{ scale: 2.7 }}
            onClick={handleScreenshot}
          >
            <RiCameraLensFill size={30} color={COLORS.pink} />
          </motion.div>
        )}
        {isApiReady &&
          isMeetingStarted &&
          currentUser.expoToken &&
          videoChatRequest.receiver.expoToken &&
          showSendNumberButton && (
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: window.innerHeight - 100 }}
              dragElastic={0.2}
              onDragStart={() => setDisableSendNumber(true)}
              onDragEnd={() => setDisableSendNumber(false)}
              style={{
                position: "absolute",
                top: 20,
                right: "6%",
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
                  boxShadow: `0px 2px 10px ${COLORS.pink}`,
                  borderRadius: 25,
                  padding: 0,
                  minHeight: 40,
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
                resolution: 1080, // Set resolution to 1080p
                constraints: {
                  video: {
                    height: { ideal: 1080, max: 1080, min: 1080 }, // Force 1080p
                    width: { ideal: 1920, max: 1920, min: 1920 },
                  },
                },
                disableSimulcast: true, // Disable simulcast to prioritize highest resolution stream
                enableLayerSuspension: false, // Keep all layers active, no suspension of video layers
                p2p: {
                  enabled: true, // Ensure peer-to-peer is enabled
                  useStunTurn: true, // Use STUN/TURN for better connectivity in P2P
                  iceTransportPolicy: "all", // Allow both UDP and TCP for ICE transport
                },
                videoQuality: {
                  maxBitratesVideo: {
                    low: 200000, // 200 kbps for low quality
                    standard: 500000, // 500 kbps for standard quality
                    high: 1500000, // 1.5 Mbps for high quality
                  },
                },
                apiLogLevels: ["error"], // Only log errors
                logging: {
                  defaultLogLevel: "error", // Set default log level to error
                  loggers: {
                    "modules/RTC/TraceablePeerConnection.js": "error",
                    "modules/statistics/CallStats.js": "error",
                    "modules/xmpp/strophe.util.js": "error",
                    "modules/statistics/LocalStatsCollector.js": "error",
                  },
                },
                preferH264: true, // Prefer H.264 codec for better quality in P2P
                disableH264: false, // Ensure H.264 is not disabled
                disableAudioLevels: true, // Disable audio level processing for better performance
                enableTcc: true, // Enable transport-cc for better video quality
                enableRemb: false, // Disable REMB, using TCC instead
                useNewBandwidthAllocationStrategy: true, // Use a new strategy for bandwidth allocation
                enableLipSync: true, // Ensure lip sync is enabled for better quality
              }}
              interfaceConfigOverwrite={{
                TOOLBAR_BUTTONS: [
                  "microphone",
                  "camera",
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
                setApi(externalApi);
                externalApi.addListener("videoConferenceLeft", handleHangup);
                externalApi.addListener(
                  "participantJoined",
                  handleParticipantJoined
                );
                externalApi.addListener(
                  "participantLeft",
                  handleParticipantLeft
                );
                externalApi.addListener("toolbarButtonClicked", (event) => {
                  if (event.key === "settings") {
                    setShowSendNumberButton(false);
                    setTimeout(() => {
                      setShowSendNumberButton(true);
                    }, 30000);
                  } else {
                    setShowSendNumberButton(true);
                  }
                });

                externalApi.addListener("p2pStatusChanged", (event) => {
                  console.log("PEER 2 PEER: ", event);
                });

                externalApi.addListener("videoAvailabilityChanged", (event) => {
                  if (event.available) {
                    setVideoPermissions(true);
                  }
                });
                externalApi.addListener("audioAvailabilityChanged", (event) => {
                  if (event.available) {
                    setAudioPermissions(true);
                  }
                });
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
