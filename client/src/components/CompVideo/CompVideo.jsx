import React, {
  Fragment,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import axios from "axios";
import { Loading, Text, Button, Box, Icon, ICON_SIZES } from "..";
import Context from "../../context";
import { COLORS } from "../../constants";
import { useClient } from "../../client";
import { SEND_VIDEO_MUTATION } from "../../graphql/mutations";

function CompVideoUploader({ senderID, receiverID, handleSending }) {
  const { dispatch } = useContext(Context);
  const client = useClient();
  const [file, setFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedBlobRef = useRef(null);

  useEffect(() => {
    if (!!file) {
      imageUploader();
    }
  }, [file]);

  const startRecording = async () => {
    try {
      setRecording(true);
      const constraints = {
        video: {
          width: { ideal: 4096 },
          height: { ideal: 2160 },
        },
        audio: true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      const videoElement = videoRef.current;
      videoElement.srcObject = stream;
      videoElement.play();
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
    } catch (err) {
      console.log(err);
    }
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaStreamRef.current) {
      mediaRecorder.stop();
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);

        recordedBlobRef.current = new Blob(chunks, { type: e.data.type });
        setFile(recordedBlobRef.current);
      };
      setRecording(false);

      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
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
      formData.append("file", file, "recorded-video.webm");
      formData.append("upload_preset", "dlxzn2uj");
      formData.append("resource_type", "video");
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

      let url = res.data.url;
      let publicId = res.data.public_id;

      // Ensure the URL uses HTTPS and has a .mov extension
      url = url.replace(/^http:\/\//i, "https://").replace(/\.mkv$/i, ".mov");

      handleSending(false);
      return { url, publicId };
    } catch (err) {
      setSubmitting(false);
      console.log(err);
      setError(err.message);
    }
  };

  const imageUploader = async () => {
    try {
      const { url, publicId } = await handleUpload(file);

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

      if (sendVideo) {
        setSubmitting(false);
      }

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
          {!file ? (
            <Box width={320} height={440}>
              <video ref={videoRef} style={{ height: 440, width: 320 }} muted />
              <Box position="absolute" bottom={0} width={320}>
                {!recording ? (
                  <Button
                    width={"100%"}
                    onClick={startRecording}
                    disabled={submitting || recording}
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
                        color={COLORS.black}
                      />
                      <Text bold center color={COLORS.pink}>
                        Record Video
                      </Text>
                    </Box>
                  </Button>
                ) : (
                  <Button
                    width={"100%"}
                    onClick={stopRecording}
                    disabled={submitting}
                    color={COLORS.red}
                    style={{
                      borderBottom: `solid 2px ${COLORS.grey}`,
                      boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
                      borderRadius: 25,
                    }}
                  >
                    <Text bold center>
                      Stop Recording
                    </Text>
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Fragment>
              <Box display="flex" justifyContent="center">
                <Text
                  center
                  color={!error ? COLORS.facebookBlue : COLORS.textRed}
                >
                  {!error ? "Success! Add another video." : error}
                </Text>
              </Box>
            </Fragment>
          )}
        </Box>
      )}
    </div>
  );
}

export default CompVideoUploader;
