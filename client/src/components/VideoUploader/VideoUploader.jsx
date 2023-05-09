import React, { Fragment, useState, useContext, useEffect } from "react";
import axios from "axios";
import { Loading, Text, ICON_SIZES } from "..";
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

  const handleUpload = async () => {
    try {
      setSubmitting(true);
      handleSending(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "dlxzn2uj");
      formData.append("resource_type", "video");
      formData.append("max_duration", 60);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/localmassagepros/video/upload`,
        formData
      );

      setSubmitting(false);
      handleSending(false);
      return { url: res.data.url, publicId: res.data.public_id };
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {submitting ? (
        <Loading ring size={150} />
      ) : (
        <Fragment>
          <input
            type="file"
            accept="video/*"
            capture="user"
            placeholder="Take Video"
            onChange={handleFileChange}
          />
          <button disabled={submitting} onClick={handleUpload}>
            Upload
          </button>
          {file && (
            <Text center color={!error ? COLORS.themeGreen : COLORS.textRed}>
              {!error ? "Success add another!" : error}
            </Text>
          )}
        </Fragment>
      )}
    </div>
  );
}

export default VideoUploader;