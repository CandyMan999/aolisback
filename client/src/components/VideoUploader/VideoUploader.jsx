import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Loading, Text, Button, Box, Icon, ICON_SIZES } from "..";
import Context from "../../context";
import { COLORS } from "../../constants";
import { useClient } from "../../client";
import { SEND_VIDEO_MUTATION } from "../../graphql/mutations";

function VideoUploader({ senderID, receiverID, handleSending }) {
  const { dispatch } = useContext(Context);
  const client = useClient();
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (file) {
      imageUploader();
    }
  }, [file]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const imageUploader = async () => {
    try {
      const { url, publicId } = await handleUpload();

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
      setError(err);
    }
  };

  const getVideoResolution = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        resolve({ width: video.videoWidth, height: video.videoHeight });
      };

      video.onerror = () => {
        reject(new Error("Failed to load video metadata"));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async () => {
    try {
      setSubmitting(true);
      handleSending(true);

      const { width, height } = await getVideoResolution(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "dlxzn2uj");
      formData.append("resource_type", "video");

      // Adjust parameters for better quality based on actual resolution
      formData.append("quality", "auto:best");
      formData.append("max_duration", 60);
      formData.append("quality", "auto:best");

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
      return { url: res.data.url, publicId: res.data.public_id };
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      handleSending(false);
      setError("Cannot upload video");
    }
  };

  return (
    <div>
      {submitting ? (
        <Loading ring size={150} />
      ) : (
        <Box width="100%" column>
          <Button
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
              <input
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
              />

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
