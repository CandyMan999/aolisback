import { useEffect, useRef } from "react";

const VideoPlayer = ({ publicId, width, height, props }) => {
  const cloudinaryRef = useRef();
  const videoRef = useRef();
  useEffect(() => {
    if (cloudinaryRef.current) return;
    cloudinaryRef.current = window.cloudinary;
    cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: "localmassagepros",
    });
  }, []);
  return (
    <video
      key={publicId}
      ref={videoRef}
      data-cld-public-id={publicId}
      width={width}
      height={height}
      controls
      {...props}
    />
  );
};

export default VideoPlayer;
