import React, { useState, useContext } from "react";
import { Button, Box, Icon, ICON_SIZES, Loading, Text } from "..";
import Context from "../../context";
import { COLORS } from "../../constants";
import { useHistory, useLocation } from "react-router-dom";

function VideoUploader({ senderID, receiverID }) {
  const { dispatch } = useContext(Context);
  const [submitting, setSubmitting] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const handleRecordButtonClick = () => {
    // Construct the new URL with updated query parameters
    const params = new URLSearchParams(location.search);
    params.set("senderID", senderID);
    params.set("receiverID", receiverID);
    params.set("videoMessage", true);

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
        <Box width="100%" column>
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
              {/* <input
                  type="file"
                  accept="video/*"
                  capture="user"
                  placeholder="Take Video"
                  onChange={handleFileChange}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    top: 15,
                    left: 50,
                  }}
                /> */}

              <Icon
                name="record"
                size={ICON_SIZES.X_LARGE}
                color={COLORS.pink}
              />
              <Text bold center color={COLORS.pink}>
                Record Video
              </Text>
            </Box>
          </Button>
          {/* {file && (
              <Box display="flex" justifyContent="center">
                <Text
                  center
                  color={!error ? COLORS.facebookBlue : COLORS.textRed}
                >
                  {!error ? "Success add another!" : error}
                </Text>
              </Box>
            )} */}
        </Box>
      )}
    </div>
  );
}

export default VideoUploader;
