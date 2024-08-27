import React, { useState, useEffect } from "react";
import iOSLogo from "../../pictures/iOSLogo.png";
import { Loading, Text, Button, Box, Icon, ICON_SIZES, FONT_SIZES } from "..";

import { COLORS } from "../../constants";

import { useHistory, useLocation } from "react-router-dom";

const VideoUploader = ({ senderID, receiverID, handleSending }) => {
  const [submitting, setSubmitting] = useState(false);

  const history = useHistory();
  const location = useLocation();

  const handleRecordButtonClick = () => {
    // Construct the new URL with updated query parameters
    try {
      const params = new URLSearchParams(location.search);
      params.set("senderID", senderID);
      params.set("receiverID", receiverID);
      params.set("videoMessage", true);
      setSubmitting(true);

      const data = {
        senderID,
        receiverID,
        videoMessage: true,
      };
      // Navigate to the constructed URL
      history.replace({
        pathname: location.pathname,
        search: params.toString(),
      });
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      } else {
        console.warn("ReactNativeWebView is not available.");
      }
    } catch (err) {
      console.log("error sending video message");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "space-around",
        flexDirection: "column",
      }}
    >
      {submitting ? (
        <Loading ring size={150} />
      ) : (
        <Box width="100%" column flex alignItems="center" marginTop={50}>
          <img
            height={100}
            width={100}
            src={iOSLogo}
            alt="Watermark-logo"
            style={{
              paddingBottom: "10%",
            }}
          />
          <Button
            onClick={handleRecordButtonClick}
            width={"200px"}
            disabled={submitting}
            color={COLORS.white}
            style={{
              borderBottom: `solid 2px ${COLORS.pink}`,
              boxShadow: `2px 2px 4px 2px ${COLORS.pink}`,
              borderRadius: 25,
            }}
          >
            <Box justifyContent="center">
              <Icon
                name="record"
                size={ICON_SIZES.X_LARGE}
                color={COLORS.pink}
              />
              <Text bold center color={COLORS.black}>
                Record Video
              </Text>
            </Box>
          </Button>
        </Box>
      )}
      <Text
        fontSize={FONT_SIZES.MEDIUM}
        width={"100%"}
        center
        paddingX={20}
        bold
        color={COLORS.black}
      >
        Note: Users can flag messages for inappropriate content, which could
        result in you being BANNED!
      </Text>
    </div>
  );
};

export default VideoUploader;
