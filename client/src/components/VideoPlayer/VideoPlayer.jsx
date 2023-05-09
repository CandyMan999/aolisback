import { useEffect, useRef } from "react";

const VideoPlayer = ({ publicId, width, height, props, controls, mobile }) => {
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
      videoRef.current.msRequestFullscreen();

      // Cleanup touchstart event listener on unmount
      return () => {
        videoRef.current.removeEventListener("touchstart", onTouchStart);
      };
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
      {...props}
    />
  );
};

export default VideoPlayer;
