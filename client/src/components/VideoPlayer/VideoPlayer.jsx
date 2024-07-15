import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
} from "react";
import { VIEWED_VIDEO_MUTATION } from "../../graphql/mutations";
import { useLocation } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { Box, Loading, Text } from "../../components";
import { COLORS } from "../../constants";
import { AdvancedVideo } from "@cloudinary/react";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { quality, format } from "@cloudinary/url-gen/actions/delivery";

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
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      setIsFullScreen(false);
    }
  };

  const handleSetLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const video = useMemo(() => {
    return cloudinaryRef.current
      .video(publicId)
      .delivery(format("auto"))
      .delivery(quality("auto"));
  }, [publicId]);

  const thumbnailUrl = useMemo(() => {
    return cloudinaryRef.current
      .video(publicId)
      .resize(thumbnail().height(90)) // Adjust to desired width and height
      .delivery(format("jpg"))
      .delivery(quality("auto"))
      .toURL();
  }, [publicId]);

  const mountVideo = !isLoading && !!cloudinaryRef.current;

  return (
    <Fragment>
      {location.pathname === "/message" && !!cloudinaryRef.current && (
        <Box style={{ display: mountVideo ? "block" : "none" }}>
          <AdvancedVideo
            cldVid={video}
            ref={videoRef}
            onCanPlay={handleSetLoading}
            onPlay={receiverWatching ? handleViewVideo : undefined}
            controls={controls}
            onClick={handleFullScreen}
            style={{
              borderRadius: borderRadius || undefined,
              maxWidth: isFullScreen ? undefined : 300,
            }}
            {...props}
          />
        </Box>
      )}
      {location.pathname === "/grid-search" && !!cloudinaryRef.current && (
        <Box style={{ display: mountVideo ? "block" : "none" }}>
          <AdvancedVideo
            cldVid={video}
            ref={videoRef}
            onCanPlay={handleSetLoading}
            onPlay={receiverWatching ? handleViewVideo : undefined}
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
        <Box>
          <img
            src={thumbnailUrl}
            alt="Video Thumbnail"
            style={{
              borderRadius: borderRadius || undefined,
              maxWidth: "100%",
              height: "auto",
              objectFit: "cover",
              boxShadow: `2px 2px 4px 2px ${COLORS.darkGrey}`,
            }}
            {...props}
          />
        </Box>
      )}
      {(isLoading || !cloudinaryRef.current) &&
        location.pathname !== "/message-center" && (
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
    </Fragment>
  );
};

export default memo(VideoPlayer);
