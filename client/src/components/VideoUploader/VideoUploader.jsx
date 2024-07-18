import React, { useState, useEffect } from "react";
import iOSLogo from "../../pictures/iOSLogo.png";
import { Loading, Text, Button, Box, Icon, ICON_SIZES } from "..";
import { COLORS } from "../../constants";
import { useHistory, useLocation } from "react-router-dom";

function VideoUploader({ senderID, receiverID, handleSending }) {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fileURI = params.get("videoURI");
    if (fileURI) {
      setFile(fileURI);
    }
  }, [location.search]);

  const handleRecordButtonClick = () => {
    // Clear existing query parameters and set new ones
    const params = new URLSearchParams();
    params.set("senderID", senderID);
    params.set("receiverID", receiverID);
    params.set("videoMessage", true);
    setSubmitting(true);

    // Navigate to the constructed URL
    history.replace({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  return (
    <div>
      {submitting ? (
        <Loading ring size={150} />
      ) : (
        <Box width="100%" column alignItems="center">
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
    </div>
  );
}

export default VideoUploader;
