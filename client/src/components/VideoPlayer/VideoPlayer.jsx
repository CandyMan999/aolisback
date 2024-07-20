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
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { quality, format } from "@cloudinary/url-gen/actions/delivery";

const VideoPlayer = ({
  videoUrl,
  publicId,
  width,
  height,
  controls,
  borderRadius,
  fullScreen,
  receiverWatching,
  _id,
  client,
}) => {
  const location = useLocation();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  const videoRef = useRef();
  const cloudinaryRef = useRef(
    new Cloudinary({ cloud: { cloudName: "localmassagepros" } })
  );

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

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const thumbnailUrl = useMemo(() => {
    return cloudinaryRef.current
      .video(publicId)
      .resize(thumbnail().height(90)) // Adjust to desired width and height
      .delivery(format("jpg"))
      .delivery(quality("auto"))
      .toURL();
  }, [publicId]);

  return (
    <Fragment>
      {location.pathname === "/message" && (
        <Box
          style={{
            display: "block",
            backgroundColor: COLORS.black,
            borderRadius: borderRadius,
            width: "100%",
            height: "fit-content",
            boxShadow: `2px 2px 4px 2px ${COLORS.pink}`,
          }}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            onPlay={receiverWatching ? handleViewVideo : undefined}
            controls={controls}
            onClick={handleFullScreen}
            style={{
              borderRadius: borderRadius || undefined,
              maxWidth: isFullScreen ? undefined : 300,
              width: "100%",
            }}
          />
        </Box>
      )}
      {location.pathname === "/grid-search" && (
        <Box
          style={{
            display: "block",
            backgroundColor: COLORS.black,
            borderRadius: borderRadius,
            height: height || 250,
            position: "relative",
          }}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            onPlay={receiverWatching ? handleViewVideo : undefined}
            onClick={handleFullScreen}
            width={width}
            height={height || 250}
            style={{
              borderRadius: borderRadius || undefined,
              maxWidth: 300,
              width: "100%",
              display: "block",
            }}
            controls={false} // Hide default controls
          />
          <button
            onClick={handlePlayPause}
            style={{
              position: "absolute",
              bottom: "0%",
              left: "25%",
              transform: "translate(-50%, -50%)",
              background: COLORS.darkerGrey,
              opacity: 0.8,
              border: "none",
              cursor: "pointer",
              borderRadius: 7,
            }}
          >
            {isPlaying ? (
              <span style={{ fontSize: "48px", color: "white" }}>❚❚</span>
            ) : (
              <span style={{ fontSize: "48px", color: "white" }}>►</span>
            )}
          </button>
        </Box>
      )}
      {location.pathname === "/message-center" && (
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
          />
        </Box>
      )}
      {/* {(isLoading || !videoUrl) && location.pathname !== "/message-center" && (
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
      )} */}
    </Fragment>
  );
};

export default memo(VideoPlayer);
