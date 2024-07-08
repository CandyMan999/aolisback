import { useEffect, useRef, useState } from "react";
import { VIEWED_VIDEO_MUTATION } from "../../graphql/mutations";
import { useLocation } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedVideo } from "@cloudinary/react";

const VideoPlayer = ({
  publicId,
  width,
  height,
  controls,
  borderRadius,
  fullScreen,
  receiverWatching,
  _id,
  client,
  ...props
}) => {
  const location = useLocation();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const cloudinaryRef = useRef();

  useEffect(() => {
    if (!cloudinaryRef.current) {
      cloudinaryRef.current = new Cloudinary({
        cloud: {
          cloudName: "localmassagepros",
        },
      });
      setIsLoading(false); // Set loading to false once Cloudinary instance is ready
    }
  }, []);

  const handleViewVideo = async () => {
    try {
      const variables = {
        _id,
        viewed: true,
      };
      await client.request(VIEWED_VIDEO_MUTATION, variables);
    } catch (err) {
      console.log("err setting video watched: ", err);
    }
  };

  const handlePlay = (event) => {
    const videoPlayer = event.currentTarget;
    // if (fullScreen && !isFullScreen) {
    videoPlayer.requestFullscreen();
    setIsFullScreen(true);
    // }
    if (receiverWatching) {
      handleViewVideo();
    }
  };

  const handleFullsScreen = (event) => {
    const videoPlayer = event.currentTarget;
    if (fullScreen && !isFullScreen) {
      videoPlayer.requestFullscreen();
      setIsFullScreen(true);
    }
    if (receiverWatching) {
      handleViewVideo();
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (isLoading || !cloudinaryRef.current) {
    return null; // Show loading or null while initializing
  }

  const video = cloudinaryRef.current.video(publicId);

  return (
    <AdvancedVideo
      cldVid={video}
      controls={controls}
      // onPlay={handlePlay}
      onClick={handleFullsScreen}
      width={width}
      height={location.pathname === "/message-center" ? height : 250}
      style={{
        borderRadius: borderRadius ? borderRadius : undefined,
        maxWidth: isFullScreen ? undefined : 300,
      }}
      {...props}
    />
  );
};

export default VideoPlayer;
