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
      const onTouchStart = () => {};

      videoRef.current.addEventListener("touchstart", onTouchStart);
      if (fullScreen) {
        videoPlayer.maximize();
      }

      // Cleanup touchstart event listener on unmount
      return () => {
        videoRef.current.removeEventListener("touchstart", onTouchStart);
      };
    });
    videoPlayer.on("ended", () => {
      videoPlayer.exitMaximize();
    });
    videoPlayer.on("pause", () => {
      videoPlayer.exitMaximize();
    });
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
