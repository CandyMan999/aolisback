import React, { useState, useContext, useEffect } from "react";
import { Subscription } from "react-apollo";
import { Loading, Text, Button, Box, Icon, ICON_SIZES } from "..";
import Context from "../../context";
import { COLORS } from "../../constants";

import { CREATE_VIDEO_SUBSCRIPTION } from "../../graphql/subscriptions";
import { useHistory, useLocation } from "react-router-dom";

function VideoUploader({ senderID, receiverID, handleSending }) {
  const { dispatch, state } = useContext(Context);

  const currentUser = state;
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
    // Construct the new URL with updated query parameters
    const params = new URLSearchParams(location.search);
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
        </Box>
      )}

      <Subscription
        subscription={CREATE_VIDEO_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { createVideo } = subscriptionData.data;

          if (createVideo.sender._id === currentUser._id) {
            dispatch({ type: "UPDATE_USER_VIDEO", payload: createVideo });

            dispatch({ type: "TOGGLE_VIDEO", payload: false });
          }
        }}
      />
    </div>
  );
}

export default VideoUploader;
