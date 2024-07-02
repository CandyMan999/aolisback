import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";
import Context from "../../context";
import { Loading, Box } from "../../components";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { isMobile } from "react-device-detect";

const VideoChatScreen = ({ showScreen }) => {
  const { state } = useContext(Context);
  const { videoChatRequest } = state;
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    if (videoChatRequest && videoChatRequest.status === "Accept") {
      const roomName = `${videoChatRequest.sender.username}-${videoChatRequest.receiver.username}`;
      setRoomName(roomName);
      setIsMeetingStarted(true);
    }
  }, [videoChatRequest]);

  useEffect(() => {
    setTimeout(() => {
      setIsApiReady(true);
    }, 2000);
  }, [roomName, isMeetingStarted]);

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
          zIndex: 10000,
          backgroundColor: COLORS.white,
        }}
      >
        {isMeetingStarted && !isApiReady ? (
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
                p2p: {
                  enabled: true,
                  stunServers: [
                    { urls: "stun:167.172.254.201:3478" },
                    {
                      urls: "turn:167.172.254.201:3478?transport=udp",
                      credential: "testpassword",
                      username: "testuser",
                    },
                    {
                      urls: "turn:167.172.254.201:3478?transport=tcp",
                      credential: "testpassword",
                      username: "testuser",
                    },
                  ],
                },
              }}
              interfaceConfigOverwrite={{
                // TOOLBAR_BUTTONS: ["microphone", "camera", "desktop", "hangup"],
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                DEFAULT_REMOTE_DISPLAY_NAME: "Participant",
                MOBILE_APP_PROMO: false, // Disable mobile app promo
                filmStripOnly: true, // Show only the filmstrip

                SHOW_JITSI_WATERMARK: false,
                SHOW_BRAND_WATERMARK: false,
                SHOW_POWERED_BY: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                DEFAULT_LOGO_URL: "",
                JITSI_WATERMARK_LINK: "",
              }}
              userInfo={{
                displayName: state.currentUser.username,
              }}
              onApiReady={(externalApi) => {
                // Automatically join the meeting
                // externalApi.executeCommand("toggleAudio");
                // externalApi.executeCommand("toggleVideo");
                // Ensure the non-currentUser is the main video
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
                // if (isMobile) {
                //   iframeRef.style.width = "100vw"; // Full screen on mobile
                // }
              }}
            />
          )
        )}
      </motion.div>
    )
  );
};

export default VideoChatScreen;
