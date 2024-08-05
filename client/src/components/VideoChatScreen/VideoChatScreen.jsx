import React, { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";
import iOSLogo from "../../pictures/iOSLogo.png";
import { FaCamera } from "react-icons/fa";
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
  const [showSendNumberButton, setShowSendNumberButton] = useState(true);
  const [disableSendNumber, setDisableSendNumber] = useState(false);
  const [videoPermissions, setVideoPermissions] = useState(false);
  const [audioPermissions, setAudioPermissions] = useState(false);
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

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  const captureScreenshot = async () => {
    try {
      const storedCanvas = document.createElement("canvas");
      const storedCanvasContext = storedCanvas.getContext("2d");

      const vids = document
        .querySelector("#jitsiConferenceFrame0")
        .contentWindow.document.querySelectorAll("video#largeVideo");
      if (vids.length > 0) {
        const video = vids[0];
        video.play();

        storedCanvas.height = parseInt(video.videoHeight, 10);
        storedCanvas.width = parseInt(video.videoWidth, 10);
        storedCanvasContext.drawImage(
          video,
          0,
          0,
          video.videoWidth,
          video.videoHeight
        );

        storedCanvas.toBlob(
          (blob) => {
            console.debug(blob);

            var data = new FormData();
            data.append("file", blob);
            console.log("data: ", data);
          }
          //   // Example API URL - replace with your actual API URL
          //   const S3_API_URL = "https://your-api-url.com/upload";

          //   fetch(S3_API_URL, {
          //     method: 'POST',
          //     body: data
          //   }).then(response => {
          //     if (response.ok) {
          //       console.log("Screenshot uploaded successfully");
          //     } else {
          //       console.error("Screenshot upload failed");
          //     }
          //   }).catch(error => {
          //     console.error("Error uploading screenshot:", error);
          //   });
          // },
          // 'image/png',
          // 1.0,
        );
      } else {
        console.error("Video element not found");
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

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
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 30001,
            cursor: "pointer",
          }}
          onClick={captureScreenshot}
        >
          <FaCamera size={30} color={COLORS.pink} />
        </div>
      </motion.div>
    )
  );
};

export default VideoChatScreen;
