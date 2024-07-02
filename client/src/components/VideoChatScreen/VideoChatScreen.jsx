import React, { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";
import iOSLogo from "../../pictures/iOSLogo.png";
import Context from "../../context";
import { UPDATE_VIDEO_CHAT_REQUEST } from "../../graphql/mutations";
import { Loading, Button, Text, Box } from "../../components";
import { JitsiMeeting } from "@jitsi/react-sdk";

import { useClient } from "../../client";

const VideoChatScreen = ({ showScreen, handleShutScreen }) => {
  const { state } = useContext(Context);
  const client = useClient();
  const { videoChatRequest } = state;
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [roomName, setRoomName] = useState("");

  const [showButton, setShowButton] = useState(null);

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

  const handleHangup = async () => {
    console.log("Call has ended");
    try {
      handleShutScreen();

      const variables = {
        _id: videoChatRequest._id,
        senderID: videoChatRequest.sender._id,
        receiverID: videoChatRequest.receiver._id,
        status: "Cancel",
      };

      console.log("variables: ", variables);
      const data = await client.request(UPDATE_VIDEO_CHAT_REQUEST, variables);

      console.log("success end room: ", data);
    } catch (err) {
      console.log("error ending video call: ", err);
    }
  };

  return (
    videoChatRequest &&
    videoChatRequest.status === "Accept" && (
      <motion.div
        onClick={() => console.log("screen clicked")}
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
        <img
          style={{ position: "absolute", top: 0, left: 0 }}
          height={100}
          width={100}
          src={iOSLogo}
          alt="Watermark-logo"
        />
        <Box
          style={{
            alignContent: "center",
            justifyContent: "center",
            width: "100vW",
            position: "absolute",
            top: "5%",
          }}
        >
          {isApiReady && isMeetingStarted && (
            <Button
              width={"30%"}
              color={COLORS.white}
              style={{
                borderBottom: `solid 2px ${COLORS.pink}`,
                boxShadow: `2px 2px 4px 2px ${COLORS.pink}`,
                borderRadius: 25,
                opacity: 0.6,
                padding: 0,
              }}
            >
              <Text center color={COLORS.pink}>
                Send Phone #
              </Text>
            </Button>
          )}
        </Box>

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
                TOOLBAR_BUTTONS: [
                  "microphone",
                  "camera",
                  "desktop",
                  "hangup",
                  "tileview",
                ],
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
                externalApi.addListener("videoConferenceLeft", handleHangup);
                // Add custom button to the toolbar
                externalApi.executeCommand("overwriteConfig", {
                  config: {
                    customToolbarButtons: [
                      {
                        icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", // Path to your custom icon
                        id: "custom-toolbar-button",
                        text: "Custom Toolbar Button",
                      },
                    ],
                  },
                });

                externalApi.addListener("toolbarButtonClicked", ({ key }) => {
                  if (key === "custom-toolbar-button") {
                    alert("Custom Toolbar Button Clicked");
                    // Your custom action here
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
                // iframeRef.contentWindow.addEventListener("click", (event) => {
                //   console.log("Clicked inside Jitsi iframe");
                //   // Handle click event within the iframe context if necessary
                // });
              }}
            />
          )
        )}
      </motion.div>
    )
  );
};

export default VideoChatScreen;
