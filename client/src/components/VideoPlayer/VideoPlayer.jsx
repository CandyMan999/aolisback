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
  const containerRef = useRef();

  useEffect(() => {
    if (cloudinaryRef.current) return;
    cloudinaryRef.current = window.cloudinary;
    const videoPlayer = cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: "localmassagepros",
    });

    const resetContainerDimensions = () => {
      if (containerRef.current && !videoPlayer.isMaximized()) {
        containerRef.current.style.width = width;
        containerRef.current.style.height = height;
      }
    };

    videoPlayer.on("play", () => {
      if (fullScreen) {
        videoPlayer.maximize();
      }
    });

    videoPlayer.on("fullscreenchange", resetContainerDimensions);

    return () => {
      videoPlayer.exitMaximize();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius ? borderRadius : undefined,
        overflow: "hidden",
      }}
    >
      <video
        key={publicId}
        ref={videoRef}
        data-cld-public-id={publicId}
        width={width}
        height={height}
        controls={controls}
        {...props}
      />
    </div>
  );
};

export default VideoPlayer;
