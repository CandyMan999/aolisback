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
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        /* Safari */
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        /* IE11 */
        videoRef.current.msRequestFullscreen();
      }
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
