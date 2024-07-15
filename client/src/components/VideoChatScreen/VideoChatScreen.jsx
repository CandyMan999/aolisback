import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";
import iOSLogo from "../../pictures/iOSLogo.png";
import Context from "../../context";
import {
  UPDATE_VIDEO_CHAT_REQUEST,
  SEND_PHONE_NUMBER,
} from "../../graphql/mutations";
import { Loading, Button, Text, FONT_SIZES } from "../../components";
import { JitsiMeeting } from "@jitsi/react-sdk";

import { useClient } from "../../client";

const VideoChatScreen = ({ showScreen, handleShutScreen }) => {
  const { state } = useContext(Context);
  const client = useClient();
  const { videoChatRequest, currentUser } = state;
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showThumbsUp, setShowThumbsUp] = useState(false);

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
    try {
      handleShutScreen();

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
        <img
          style={{ position: "absolute", top: 0, left: 0 }}
          height={100}
          width={100}
          src={iOSLogo}
          alt="Watermark-logo"
        />

        {isApiReady &&
          isMeetingStarted &&
          currentUser.expoToken &&
          videoChatRequest.receiver.expoToken && (
            <Button
              id="send-phone"
              onClick={handleSendPhoneNumber}
              width={"30%"}
              disabled={showThumbsUp || loading}
              color={COLORS.white}
              style={{
                position: "absolute",
                borderBottom: `solid 2px ${COLORS.pink}`,
                boxShadow: `2px 2px 4px 2px ${COLORS.pink}`,
                borderRadius: 25,
                padding: 0,
                bottom: 60,
                right: 10,
                minHeight: 40,
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
                buttonsWithNotifyClick: [
                  "microphone",
                  "camera",
                  "desktop",
                  "hangup",
                  "tileview",
                  "toggle-camera",
                  "settings",
                  "filmstrip",
                ],
              }}
              userInfo={{
                displayName: state.currentUser.username,
              }}
              onApiReady={(externalApi) => {
                externalApi.addListener("videoConferenceLeft", handleHangup);

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
