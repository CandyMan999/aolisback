import { useEffect, useRef, useState } from "react";
import { Box } from "../../components";

const VideoPlayer = ({
  publicId,
  width,
  height,
  props,
  controls,
  mobile,
  borderRadius,
  fullScreen,
}) => {
  const cloudinaryRef = useRef();
  const videoRef = useRef();
  const isChrome = /Chrome/.test(navigator.userAgent);

  useEffect(() => {
    if (cloudinaryRef.current) return;
    cloudinaryRef.current = window.cloudinary;
    const videoPlayer = cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: "localmassagepros",
    });

    videoPlayer.on("play", () => {
      if (fullScreen && (!isChrome || !mobile)) {
        videoPlayer.maximize();
      } else if (fullScreen && isChrome && mobile) {
        mobileDimensions();
      }
    });

    videoPlayer.on("fullscreenchange", () => {
      const maxView = videoPlayer.isMaximized();
      if (!maxView && (!isChrome || !mobile)) {
        videoPlayer.exitMaximize();
      } else if (isChrome && mobile) {
        resetVideoDimensions();
      }
    });

    const mobileDimensions = () => {
      const videoElement = videoPlayer.el();
      if (videoElement) {
        videoElement.style.width = "100vw"; // Reset width
        videoElement.style.height = "100vh";
        videoElement.style.position = "absolute";
        videoElement.style.top = 0;
        videoElement.style.left = "-20px";
        videoElement.style.justifyContent = "center";
        videoElement.style.alignItems = "center";
        videoElement.style.overflow = "hidden";
        videoElement.style.zIndex = 3000;
      }
    };

    const resetVideoDimensions = () => {
      const videoElement = videoPlayer.el();
      if (videoElement) {
        videoElement.style.width = ""; // Reset width
        videoElement.style.height = "";
        videoElement.style.overflow = "hidden";
      }
    };

    return () => {
      videoPlayer.exitMaximize();
    };
  }, []);

  return (
    // <Box key={`${publicId}-container`} height={"auto"} width="auto">
    <video
      key={publicId}
      ref={videoRef}
      data-cld-public-id={publicId}
      width={width}
      height={height}
      controls={controls}
      style={{ borderRadius: borderRadius ? borderRadius : undefined }} // Add border radius
      {...props}
    />
    // </Box>
  );
};

export default VideoPlayer;
