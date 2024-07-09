import { Fragment, useEffect, useRef, useState } from "react";
import { VIEWED_VIDEO_MUTATION } from "../../graphql/mutations";
import { useLocation } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { Box, Loading, Text } from "../../components";
import { COLORS } from "../../constants";
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
  const cloudinaryRef = useRef(
    new Cloudinary({ cloud: { cloudName: "localmassagepros" } })
  );
  const videoRef = useRef();

  const handleViewVideo = async () => {
    try {
      const variables = { _id, viewed: true };
      await client.request(VIEWED_VIDEO_MUTATION, variables);
    } catch (err) {
      console.log("Error setting video watched: ", err);
    }
  };

  const handleFullScreen = (event) => {
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

  const handleSetLoading = () => {
    console.log("CAN PLAY!!!!!!");
    setIsLoading(false);
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const video = cloudinaryRef.current.video(publicId);

  const mountVideo = !isLoading && cloudinaryRef.current;
  return (
    <Fragment>
      {(isLoading || !cloudinaryRef.current) && (
        <Box
          width={150}
          height={height || 250}
          background={COLORS.lightGrey}
          borderRadius={8}
          flex
          column
          alignItems="center"
          justifyContent="center"
        >
          <Loading ring size={35} color={COLORS.pink} />
          <Text center padding={0} bold color={COLORS.white}>
            Processing HD...
          </Text>
        </Box>
      )}
      {location.pathname !== "/message-center" && !!cloudinaryRef.current && (
        <Box style={{ display: mountVideo ? "block" : "none" }}>
          <AdvancedVideo
            cldVid={video}
            ref={videoRef}
            onCanPlay={handleSetLoading}
            controls={controls}
            onClick={handleFullScreen}
            width={width}
            height={height || 250}
            style={{
              borderRadius: borderRadius || undefined,
              maxWidth: isFullScreen ? undefined : 300,
            }}
            {...props}
          />
        </Box>
      )}

      {location.pathname === "/message-center" && !!cloudinaryRef.current && (
        <Box style={{ display: mountVideo ? "block" : "none" }}>
          <AdvancedVideo
            cldVid={video}
            controls={controls}
            onCanPlay={handleSetLoading}
            width={width}
            height={height || 250}
            style={{
              borderRadius: borderRadius || undefined,
              maxWidth: isFullScreen ? undefined : 300,
            }}
            {...props}
          />
        </Box>
      )}
    </Fragment>
  );
};

export default VideoPlayer;
