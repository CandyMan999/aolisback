import { useEffect, useRef } from "react";
import { browserName, isIOS } from "react-device-detect";
import { VIEWED_VIDEO_MUTATION } from "../../graphql/mutations";

const VideoPlayer = ({
  publicId,
  width,
  height,
  props,
  controls,
  mobile,
  borderRadius,
  fullScreen,
  receiverWatching,
  _id,
  client,
}) => {
  const cloudinaryRef = useRef();
  const videoRef = useRef();

  const isChromeMobile = isIOS && browserName === "Chrome" && mobile;

  useEffect(() => {
    if (cloudinaryRef.current) return;
    cloudinaryRef.current = window.cloudinary;
    const videoPlayer = cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: "localmassagepros",
    });

    videoPlayer.on("play", () => {
      if (fullScreen && !isChromeMobile) {
        videoPlayer.maximize();
      }
      if (receiverWatching) {
        handleViewVideo();
      }
    });

    videoPlayer.on("fullscreenchange", () => {
      const maxView = videoPlayer.isMaximized();
      if (!maxView) {
        videoPlayer.exitMaximize();
      }
    });
  }, []);

  const handleViewVideo = async () => {
    try {
      const variables = {
        _id,
        viewed: true,
      };
      const { viewVideo } = await client.request(
        VIEWED_VIDEO_MUTATION,
        variables
      );
    } catch (err) {
      console.log("err setting video watched: ", err);
    }
  };

  return isChromeMobile ? (
    <video
      key={publicId}
      ref={videoRef}
      data-cld-public-id={publicId}
      width={width}
      height={250}
      controls={controls}
      style={{
        borderRadius: borderRadius ? borderRadius : undefined,
        maxWidth: mobile ? 300 : undefined,
      }} // Add border radius
      {...props}
    />
  ) : (
    <video
      key={publicId}
      ref={videoRef}
      data-cld-public-id={publicId}
      width={width}
      height={height}
      controls={controls}
      playsInline={!fullScreen ? "webkit-playsinline" : undefined}
      style={{
        borderRadius: borderRadius ? borderRadius : undefined,
        maxWidth: mobile ? 300 : undefined,
      }} // Add border radius
      {...props}
    />
  );
};

export default VideoPlayer;
