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
  DIRECT_UPLOAD_MUTATION,
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
  const outOfTimeRef = useRef(false);
  const [api, setApi] = useState(null);
  const [flash, setFlash] = useState(false);
  const intervalIdRef = useRef(null);
  const localPiPRef = useRef(null);
  const localStreamRef = useRef(null);

  const containerRef = useRef(null); // bounds for PIP drag

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

  useEffect(() => {
    let cancelled = false;

    const startLocalPreview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false, // Jitsi already owns audio
        });
        if (!cancelled) {
          localStreamRef.current = stream;
          if (localPiPRef.current) localPiPRef.current.srcObject = stream;
        }
      } catch (e) {
        console.log("Local PiP getUserMedia failed:", e);
      }
    };

    if (isApiReady) startLocalPreview();

    return () => {
      cancelled = true;
      localStreamRef.current?.getTracks?.().forEach((t) => t.stop());
      localStreamRef.current = null;
    };
  }, [isApiReady]);

  const stopMediaAndCall = () => {
    // stop the local PiP preview
    try {
      localStreamRef.current?.getTracks?.().forEach((t) => t.stop());
      localStreamRef.current = null;
    } catch {}

    // stop Jitsi’s capture + tear down the iframe
    try {
      if (api) {
        api.executeCommand?.("hangup");
        // dispose the iframe api instance after hangup
        setTimeout(() => api.dispose?.(), 0);
      }
    } catch {}

    // clear polling
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  const handleParticipantLeft = async () => {
    try {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      console.log("PARTICIPANT LEFT!!!!!!!!!!!!!!");
      if (outOfTimeRef.current) {
        try {
          console.log("OUT OF TIME IS FIRING!!!!!!!!!!!!");
          window.ReactNativeWebView.postMessage("OUT_OF_TIME");
        } catch (err) {
          console.log(err);
        }
      }
      handleShutScreen();
    } catch (err) {
      console.log("error ending video call: ", err);
    }
  };

  const handleHangup = async () => {
    stopMediaAndCall();
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

        if (callDuration.outOfTime) {
          outOfTimeRef.current = true;
        }

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
      // 1) Get one-time direct upload URL + Cloudflare image id
      const { directUpload } = await client.request(DIRECT_UPLOAD_MUTATION);
      const { uploadURL, id } = directUpload;

      // 2) Build form data (must be a File for CF direct upload)
      const form = new FormData();
      const file =
        image instanceof Blob
          ? new File([image], "screencap.jpg", {
              type: image.type || "image/jpeg",
            })
          : image; // already a File
      form.append("file", file);

      // 3) POST to the direct upload URL (no auth header, no manual content-type)
      const res = await fetch(uploadURL, { method: "POST", body: form });
      if (!res.ok) throw new Error(`Direct upload failed: ${res.status}`);

      // 4) Build delivery URL
      const hash = process.env.REACT_APP_CF_ACCOUNT_HASH;
      const variant = process.env.REACT_APP_CF_VARIANT || "public";
      const deliveryUrl = `https://imagedelivery.net/${hash}/${id}/${variant}`;

      return { url: deliveryUrl, publicId: id };
    } catch (err) {
      console.log("Cloudflare upload failed:", err?.message || err);
      return { url: null, publicId: null };
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
              top: 8,
              left: 8,
              alignItems: "center",
              zIndex: 50000,
              pointerEvents: "none", // ← doesn’t block Jitsi clicks
              borderRadius: 12,
              padding: 6,
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
            <div
              ref={containerRef}
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              {isApiReady && showSendNumberButton && (
                <motion.div
                  drag
                  dragConstraints={containerRef}
                  dragMomentum={false}
                  dragElastic={0}
                  style={{
                    position: "absolute",
                    bottom: 80,
                    right: 16,
                    width: "auto",
                    height: "25vh",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 6px 16px rgba(0,0,0,.35)",
                    zIndex: 40000,
                    background: "#000",
                    transform: "scaleX(-1)", // mirror like FaceTime
                  }}
                >
                  <video
                    ref={localPiPRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: "scaleX(-1)", // mirror like FaceTime
                    }}
                  />
                </motion.div>
              )}
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
                    // "tileview",
                    "toggle-camera",
                    "settings",
                  ],
                }}
                userInfo={{
                  displayName: state.currentUser.username,
                }}
                onApiReady={(externalApi) => {
                  setApi(externalApi);
                  const pinFirstRemote = () => {
                    const list = externalApi.getParticipantsInfo?.() || [];
                    const remote = list.find((p) => !p.isLocal);
                    if (remote?.participantId) {
                      externalApi.executeCommand(
                        "pinParticipant",
                        remote.participantId
                      );
                    }
                  };

                  externalApi.addListener(
                    "videoConferenceJoined",
                    pinFirstRemote
                  );
                  externalApi.addListener("participantJoined", pinFirstRemote);

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

                  externalApi.addListener(
                    "videoAvailabilityChanged",
                    (event) => {
                      if (event.available) {
                        setVideoPermissions(true);
                      }
                    }
                  );

                  externalApi.addListener(
                    "audioAvailabilityChanged",
                    (event) => {
                      if (event.available) {
                        setAudioPermissions(true);
                      }
                    }
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
            </div>
          )
        )}
      </motion.div>
    )
  );
};

export default VideoChatScreen;
