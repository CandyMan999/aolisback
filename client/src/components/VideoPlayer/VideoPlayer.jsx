import { useEffect, useRef, useState } from "react";
import { browserName, isIOS, isAndroid } from "react-device-detect";
import { VIEWED_VIDEO_MUTATION } from "../../graphql/mutations";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const isChromeMobile = isIOS && browserName === "Chrome" && mobile;

  useEffect(() => {
    if (cloudinaryRef.current) return;
    cloudinaryRef.current = window.cloudinary;
    const videoPlayer = cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: "localmassagepros",
    });

    videoPlayer.on("play", () => {
      if ((fullScreen && !isChromeMobile) || isAndroid) {
        videoPlayer.maximize();
        setIsFullScreen(true);
      }
      if (receiverWatching) {
        handleViewVideo();
      }
    });

    videoPlayer.on("fullscreenchange", () => {
      const maxView = videoPlayer.isMaximized();
      if (!maxView) {
        videoPlayer.exitMaximize();
        setIsFullScreen(false);
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

  return isChromeMobile || isAndroid ? (
    <video
      key={publicId}
      ref={videoRef}
      data-cld-public-id={publicId}
      width={width}
      height={location.pathname === "/message-center" ? height : 250}
      controls={controls}
      style={{
        borderRadius: borderRadius ? borderRadius : undefined,
        maxWidth: mobile && !isFullScreen && !isAndroid ? 300 : undefined,
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
        maxWidth: mobile && !isFullScreen ? 300 : undefined,
      }} // Add border radius
      {...props}
    />
  );
};

export default VideoPlayer;
