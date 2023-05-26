import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (cloudinaryRef.current) return;
    cloudinaryRef.current = window.cloudinary;
    const videoPlayer = cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: "localmassagepros",
    });

    videoPlayer.on("play", () => {
      if (fullScreen) {
        videoPlayer.maximize();
      }
    });
    videoPlayer.on("fullscreenchange", () => {
      const maxView = videoPlayer.isMaximized();
      if (!maxView) {
        resetVideoDimensions(); // Reset video dimensions after closing
        videoPlayer.exitMaximize();
      }
    });

    const resetVideoDimensions = () => {
      const videoElement = videoPlayer.el();
      if (videoElement) {
        videoElement.style.width = ""; // Reset width
        videoElement.style.height = "";
        videoElement.style.overflow = "hidden";

        videoElement.style.className =
          "video-js vjs_video_738-dimensions vjs-controls-enabled vjs-workinghover vjs-v7 cld-video-player cld-video-player-vjs_video_738 cld-video-player-skin-dark vjs-contextmenu vjs-context-menu vjs-http-source-selector vjs-has-started vjs-paused vjs-ended vjs-user-inactive";
      }
    };

    return () => {
      videoPlayer.exitMaximize();
    };
  }, []);

  return (
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
  );
};

export default VideoPlayer;
