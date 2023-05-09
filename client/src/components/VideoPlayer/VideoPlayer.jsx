import { useEffect, useRef } from "react";

const VideoPlayer = ({ publicId, width, height, props, controls }) => {
  const cloudinaryRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    if (cloudinaryRef.current) return;
    cloudinaryRef.current = window.cloudinary;
    const videoPlayer = cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: "localmassagepros",
    });
    videoPlayer.on("play", () => {
      const onTouchStart = () => {
        videoRef.current.requestFullscreen();
        videoRef.current.msRequestFullscreen();
        videoRef.current.webkitRequestFullscreen();
      };
      videoRef.current.addEventListener("touchstart", onTouchStart);
      if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.RequestFullscreen) {
        /* Safari */
        videoRef.current.RequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        /* IE11 */
        videoRef.current.msRequestFullscreen();
        // Listen for touchstart event to enter fullscreen mode on mobile
      }
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
      data-cld-overlays="fullscreen,playpause"
      {...props}
    />
  );
};

export default VideoPlayer;
