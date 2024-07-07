import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Loading, Text, Button, Box, Icon, ICON_SIZES } from "..";
import Context from "../../context";
import { COLORS } from "../../constants";
import { useClient } from "../../client";
import { SEND_VIDEO_MUTATION } from "../../graphql/mutations";
import { useHistory, useLocation } from "react-router-dom";

function VideoUploader({ senderID, receiverID, handleSending }) {
  const { dispatch } = useContext(Context);
  const client = useClient();
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fileURI = params.get("videoURI");
    if (fileURI) {
      setFile(fileURI);
    }
  }, [location.search]);

  useEffect(() => {
    if (file) {
      imageUploader(file);
    }
  }, [file]);

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

  const getVideoResolution = (fileURI) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        resolve({ width: video.videoWidth, height: video.videoHeight });
      };

      video.onerror = () => {
        reject(new Error("Failed to load video metadata"));
      };

      video.src = fileURI;
    });
  };

  const handleUpload = async (fileURI) => {
    try {
      setSubmitting(true);
      handleSending(true);

      const { width, height } = await getVideoResolution(fileURI);

      const formData = new FormData();
      formData.append("file", {
        uri: fileURI,
        name: "app-recorded-video.mp4",
      });
      formData.append("upload_preset", "dlxzn2uj");
      formData.append("resource_type", "video");

      // Adjust parameters for better quality based on actual resolution
      formData.append("quality", "auto:best");
      formData.append("max_duration", 60);
      formData.append("width", width);
      formData.append("height", height);
      formData.append("crop", "limit");
      formData.append("video_codec", "auto");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/localmassagepros/video/upload`,
        formData
      );

      setSubmitting(false);
      handleSending(false);
      return { url: res.data.secure_url, publicId: res.data.public_id };
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      handleSending(false);
      setError("Cannot upload video");
    }
  };

  const imageUploader = async (fileURI) => {
    try {
      const { url, publicId } = await handleUpload(fileURI);

      const variables = {
        url,
        publicId,
        senderID,
        receiverID,
      };

      const { sendVideo } = await client.request(
        SEND_VIDEO_MUTATION,
        variables
      );

      dispatch({ type: "UPDATE_USER_VIDEO", payload: sendVideo });

      dispatch({ type: "TOGGLE_VIDEO", payload: false });
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
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
          {file && (
            <Box display="flex" justifyContent="center">
              <Text
                center
                color={!error ? COLORS.facebookBlue : COLORS.textRed}
              >
                {!error ? "Success add another!" : error}
              </Text>
            </Box>
          )}
        </Box>
      )}
    </div>
  );
}

export default VideoUploader;
