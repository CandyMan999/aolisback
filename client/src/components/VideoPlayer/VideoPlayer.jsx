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
  const [isFullscreen, setIsFullscreen] = useState(false);
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
      const isMaximized = videoPlayer.isMaximized();
      setIsFullscreen(isMaximized);
    });

    return () => {
      videoPlayer.exitMaximize();
    };
  }, []);

  return (
    <video
      key={publicId}
      ref={videoRef}
      data-cld-public-id={publicId}
      width={isFullscreen ? "100%" : width}
      height={isFullscreen ? "100%" : height}
      data-cld-fluid={isFullscreen ? "true" : undefined}
      controls={controls}
      style={{ borderRadius: borderRadius ? borderRadius : undefined }}
      {...props}
    />
  );
};

export default VideoPlayer;
