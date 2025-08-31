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
import { Box, Text, Button } from "../../components";
import { COLORS } from "../../constants";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { quality, format } from "@cloudinary/url-gen/actions/delivery";
import CloudflareVideo from "./cloudflareVideo";

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

  const [showOverlay, setShowOverlay] = useState(flagged); // Overlay initially shown if video is flagged

  const videoRef = useRef();
  const cloudinaryRef = useRef(
    new Cloudinary({ cloud: { cloudName: "localmassagepros" } })
  );

  const handleViewVideo = async () => {
    try {
      const variables = { _id, viewed: true };
      const { viewVideo } = await client.request(
        VIEWED_VIDEO_MUTATION,
        variables
      );

      if (viewVideo.viewed && !viewVideo.flagged) {
        window.ReactNativeWebView.postMessage("SHOW_REVIEW_REQUEST");
      }
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

  // const thumbnailUrl = useMemo(() => {
  //   return cloudinaryRef.current
  //     .video(publicId)
  //     .resize(thumbnail().height(90)) // Adjust to desired width and height
  //     .delivery(format("jpg"))
  //     .delivery(quality("auto"))
  //     .toURL();
  // }, [publicId]);

  const thumbnailUrl = useMemo(() => {
    if (!publicId) return undefined;
    return `https://videodelivery.net/${publicId}/thumbnails/thumbnail.jpg?time=0s&height=90`;
    // Example with sizing:
    // return `https://videodelivery.net/${publicId}/thumbnails/thumbnail.jpg?time=0s&height=90&fit=cover`;
  }, [publicId]);

  return (
    <Fragment>
      {location.pathname === "/message" && (
        <Box
          style={{
            // display: "block",
            backgroundColor: COLORS.black,
            borderRadius: borderRadius,
            // width: "100%",
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
              <Text
                style={{
                  marginBottom: "16px",
                  textAlign: "center",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                }}
              >
                {receiverWatching
                  ? "This video has been flagged by our AI or yourself and may include inappropriate content."
                  : "Our AI has flagged this video for Nudity, if so you will be banned!"}
              </Text>
              <Button
                onClick={handleDismissOverlay}
                style={{
                  backgroundColor: COLORS.pink,
                  color: COLORS.white,
                  padding: "8px 16px",
                  borderRadius: "4px",
                  boxShadow: `0px 2px 10px 2px ${COLORS.white}`,
                }}
              >
                <Text bold margin={0}>
                  View Anyway
                </Text>
              </Button>
            </Box>
          )}

          <CloudflareVideo
            ref={videoRef}
            uid={publicId}
            videoUrl={videoUrl}
            onPlay={receiverWatching ? handleViewVideo : undefined}
            controls={controls}
            handleFullScreen={handleFullScreen}
            loop
            style={{
              borderRadius: borderRadius || undefined,
              maxWidth: isFullScreen ? undefined : 300,
              width: "100%",
              opacity: showOverlay ? 0.5 : 1, // Dim the video if overlay is shown
            }}
          />
          {/* <CloudflareVideo
            uid={publicId} // assuming videoUrl in DB is the CF UID like "7cc10d33e7ca43139cbcde1818a39aa7"
            controls={controls}
            onPlay={receiverWatching ? handleViewVideo : undefined}
            loop
            style={{
              borderRadius: borderRadius || undefined,
              maxWidth: isFullScreen ? undefined : 300,
              width: "100%",
              height: height || 250,
              opacity: showOverlay ? 0.5 : 1,
            }}
            fullScreen={fullScreen}
            className="clickable-video"
            // You can keep fullscreen handler by wrapping in a div or using onClick here:
            onClick={handleFullScreen}
          /> */}
        </Box>
      )}
      {location.pathname === "/grid-search" && (
        <Box
          style={{
            // display: "block",
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
                Our AI has flagged this video for Nudity, if so you will be
                banned!
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

          {/* <video
            ref={videoRef}
            src={videoUrl}
            onPlay={receiverWatching ? handleViewVideo : undefined}
            controls={controls}
            onClick={handleFullScreen}
            width={width}
            loop
            height={height || 250}
            style={{
              borderRadius: borderRadius || undefined,
              maxWidth: isFullScreen ? undefined : 300,
              width: "100%",
              opacity: showOverlay ? 0.5 : 1, // Dim the video if overlay is shown
            }}
          /> */}
          {/* <CloudflareVideo
            uid={publicId} // assuming videoUrl in DB is the CF UID like "7cc10d33e7ca43139cbcde1818a39aa7"
            controls={controls}
            onPlay={receiverWatching ? handleViewVideo : undefined}
            loop
            style={{
              borderRadius: borderRadius || undefined,
              maxWidth: isFullScreen ? undefined : 300,
              width: "100%",

              opacity: showOverlay ? 0.5 : 1,
            }}
            fullScreen={fullScreen}
            className="clickable-video"
            // You can keep fullscreen handler by wrapping in a div or using onClick here:
            onClick={handleFullScreen}
          /> */}

          <CloudflareVideo
            ref={videoRef}
            uid={publicId}
            videoUrl={videoUrl}
            onPlay={receiverWatching ? handleViewVideo : undefined}
            controls={controls}
            handleFullScreen={handleFullScreen}
            loop
            style={{
              borderRadius: borderRadius || undefined,
              maxWidth: isFullScreen ? undefined : 300,
              width: "100%",
              height: height || 250,
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
