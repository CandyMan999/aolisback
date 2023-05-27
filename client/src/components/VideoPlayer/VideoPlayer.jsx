import { useEffect, useRef, useState } from "react";

const VideoPlayer = ({
  publicId,
  width,
  height,
  props,
  controls,
  mobile,
  borderRadius,
  fullScreen,
}) => {
  const cloudinaryRef = useRef();
  const videoRef = useRef();
  let element;

  useEffect(() => {
    if (cloudinaryRef.current) return;
    cloudinaryRef.current = window.cloudinary;
    const videoPlayer = cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: "localmassagepros",
    });

    videoPlayer.on("play", () => {
      if (fullScreen) {
        videoPlayer.maximize();
      }
    });

    videoPlayer.on("fullscreenchange", () => {
      const maxView = videoPlayer.isMaximized();
      if (!maxView) {
        videoPlayer.exitMaximize();

        document
          .exitFullscreen()
          .then(() => console.log("Document Exited from Full screen mode"))
          .catch((err) => console.error(err));
      }
    });

    function fullscreenchanged(event) {
      if (document.fullscreenElement) {
        console.log(
          `Element: ${document.fullscreenElement.id} entered fullscreen mode.`
        );
        element = document.fullscreenElement.id;
      } else {
        const videoElement = document.getElementById(element);
        console.log("!!: ", videoElement);

        if (videoElement) {
          if (videoElement.exitFullscreen) {
            videoElement
              .exitFullscreen()
              .then(() => console.log("Document Exited from Full screen mode"))
              .catch((err) => console.error(err));
          } else if (videoElement.mozCancelFullScreen) {
            videoElement
              .mozCancelFullScreen()
              .then(() => console.log("Document Exited from Full screen mode"))
              .catch((err) => console.error(err));
          } else if (videoElement.webkitExitFullscreen) {
            videoElement
              .webkitExitFullscreen()
              .then(() => console.log("Document Exited from Full screen mode"))
              .catch((err) => console.error(err));
          } else if (videoElement.msExitFullscreen) {
            videoElement
              .msExitFullscreen()
              .then(() => console.log("Document Exited from Full screen mode"))
              .catch((err) => console.error(err));
          }
        }

        if (document.exitFullscreen) {
          document
            .exitFullscreen()
            .then(() => console.log("Document Exited from Full screen mode"))
            .catch((err) => console.error(err));
        } else if (document.mozCancelFullScreen) {
          document
            .mozCancelFullScreen()
            .then(() => console.log("Document Exited from Full screen mode"))
            .catch((err) => console.error(err));
        } else if (document.webkitExitFullscreen) {
          document
            .webkitExitFullscreen()
            .then(() => console.log("Document Exited from Full screen mode"))
            .catch((err) => console.error(err));
        } else if (document.msExitFullscreen) {
          document
            .msExitFullscreen()
            .then(() => console.log("Document Exited from Full screen mode"))
            .catch((err) => console.error(err));
        }
      }
    }

    document.addEventListener("fullscreenchange", fullscreenchanged);
  }, []);

  return (
    <video
      key={publicId}
      ref={videoRef}
      data-cld-public-id={publicId}
      width={width}
      height={height}
      controls={controls}
      style={{ borderRadius: borderRadius ? borderRadius : undefined }} // Add border radius
      {...props}
    />
  );
};

export default VideoPlayer;
