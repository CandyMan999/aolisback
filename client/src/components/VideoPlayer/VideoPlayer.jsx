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
import { Box, Loading, Text, Button } from "../../components";
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
  flagged,
}) => {
  const location = useLocation();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(flagged); // Overlay initially shown if video is flagged

  const videoRef = useRef();
  const cloudinaryRef = useRef(
    new Cloudinary({ cloud: { cloudName: "localmassagepros" } })
  );

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

  const handleDismissOverlay = () => {
    setShowOverlay(false);
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
            position: "relative", // To position overlay on top
          }}
        >
          {showOverlay && (
            <Box
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                borderRadius: borderRadius,
                zIndex: 10,
              }}
            >
              <Text style={{ marginBottom: "16px", textAlign: "center" }}>
                This video has been flagged by our AI or yourself and may
                include inappropriate content.
              </Text>
              <Button
                onClick={handleDismissOverlay}
                style={{
                  backgroundColor: COLORS.pink,
                  color: COLORS.white,
                  padding: "8px 16px",
                  borderRadius: "4px",
                }}
              >
                View Anyway
              </Button>
            </Box>
          )}

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
              opacity: showOverlay ? 0.5 : 1, // Dim the video if overlay is shown
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
            position: "relative", // To position overlay on top
          }}
        >
          {showOverlay && (
            <Box
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                borderRadius: borderRadius,
                zIndex: 10,
              }}
            >
              <Text style={{ marginBottom: "16px", textAlign: "center" }}>
                This video has been flagged by our AI or yourself and may
                include inappropriate content.
              </Text>
              <Button
                onClick={handleDismissOverlay}
                style={{
                  backgroundColor: COLORS.pink,
                  color: COLORS.white,
                  padding: "8px 16px",
                  borderRadius: "4px",
                }}
              >
                View Anyway
              </Button>
            </Box>
          )}

          <video
            ref={videoRef}
            src={videoUrl}
            onPlay={receiverWatching ? handleViewVideo : undefined}
            controls={controls}
            onClick={handleFullScreen}
            width={width}
            height={height || 250}
            style={{
              borderRadius: borderRadius || undefined,
              maxWidth: isFullScreen ? undefined : 300,
              width: "100%",
              opacity: showOverlay ? 0.5 : 1, // Dim the video if overlay is shown
            }}
          />
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
    </Fragment>
  );
};

export default memo(VideoPlayer);
