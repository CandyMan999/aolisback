import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Icon, ICON_SIZES, Loading } from ".."; // Import Spinner component
import { COLORS } from "../../constants";
import Slide from "./Slide";

const PhotoSlider = ({
  height,
  images,
  width,
  withDelete,
  isUser,
  onSlideChange,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [pictures, setPictures] = useState([]);
  const [clickDirection, setClickDirection] = useState("right");
  const [loading, setLoading] = useState(true); // New loading state
  const pointerOriginRef = useRef(null);
  const ignoreClickRef = useRef(false);

  const recordPointerOrigin = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    pointerOriginRef.current = {
      time: Date.now(),
      x: event.clientX,
      y: event.clientY,
    };

    if (event.currentTarget.setPointerCapture) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch (err) {
        // ignore platforms that do not support pointer capture
      }
    }
  };

  const clearPointerOrigin = (event) => {
    if (event && event.currentTarget.releasePointerCapture) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch (err) {
        // ignore platforms that do not support pointer capture
      }
    }

    pointerOriginRef.current = null;
  };

  const handleTapNavigation = (clientX, currentTarget) => {
    if (!pictures.length || pictures.length <= 1) {
      return false;
    }

    const rect = currentTarget.getBoundingClientRect();

    if (!rect.width) {
      return false;
    }

    const relativeX = clientX - rect.left;

    if (relativeX >= rect.width / 2) {
      nextSlide();
    } else {
      prevSlide();
    }

    return true;
  };

  const handlePointerUp = (event) => {
    const origin = pointerOriginRef.current;
    clearPointerOrigin(event);

    if (!origin) {
      return;
    }

    const elapsed = Date.now() - origin.time;
    const deltaX = Math.abs(event.clientX - origin.x);
    const deltaY = Math.abs(event.clientY - origin.y);

    if (elapsed > 350 || deltaX > 15 || deltaY > 15) {
      return;
    }

    if (handleTapNavigation(event.clientX, event.currentTarget)) {
      ignoreClickRef.current = true;
      setTimeout(() => {
        ignoreClickRef.current = false;
      }, 0);

      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleClick = (event) => {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }

    if (handleTapNavigation(event.clientX, event.currentTarget)) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handlePointerCancel = (event) => {
    clearPointerOrigin(event);
  };

  useEffect(() => {
    const loadImages = async () => {
      try {
        const validImages = images.filter((image) => !!image.url);
        if (!validImages.length) {
          console.warn("No valid images found");
          setLoading(false);
          return;
        }

        const promises = validImages.map((image) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = image.url;
            img.onload = () => resolve(image);
            img.onerror = () => {
              console.error(`Failed to load image: ${image.url}`);
              reject(new Error(`Failed to load image: ${image.url}`));
            };
          });
        });

        const loadedImages = await Promise.allSettled(promises);
        const successfullyLoaded = loadedImages
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        setPictures(successfullyLoaded);
        setLoading(false);

        if (successfullyLoaded.length === 0) {
          console.warn("No images loaded successfully");
        }
      } catch (err) {
        console.error("Error loading images: ", err);
        setLoading(false);
      }
    };

    if (images && images.length > 0) {
      loadImages();
    } else {
      setLoading(false);
    }
  }, [images]);

  const currentPhoto = pictures[currentIdx];

  const changeSlide = (offset) => {
    if (!pictures.length) {
      return;
    }

    const total = pictures.length;
    const newIdx = currentIdx + offset;
    const normalizedIdx = ((newIdx % total) + total) % total;

    setCurrentIdx(normalizedIdx);

    if (onSlideChange) {
      onSlideChange(normalizedIdx);
    }
  };

  const nextSlide = () => {
    if (pictures.length <= 1) {
      return;
    }

    setClickDirection("right");
    changeSlide(1);
  };

  const prevSlide = () => {
    if (pictures.length <= 1) {
      return;
    }

    setClickDirection("left");
    changeSlide(-1);
  };

  const handleDeletePhoto = (id) => {
    if (currentIdx === pictures.length - 1) {
      setCurrentIdx(0);
    }

    setPictures([...pictures.filter((picture) => picture._id !== id)]);
  };

  return (
    <Box
      justifyContent="center"
      height={"fit-content"}
      width={"100%"}
      position={"relative"}
      background={COLORS.white}
      style={{ overflow: "hidden" }}
    >
      {loading ? ( // Show loader while loading
        <Box height={250} width={"100%"}>
          <Loading logo />
        </Box>
      ) : (
        <>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box
              justifyContent="center"
              position="relative"
              onPointerDown={recordPointerOrigin}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              onPointerLeave={handlePointerCancel}
              onClick={handleClick}
              style={{ touchAction: "manipulation" }}
            >
              {pictures.length > 0 && (
                <Box
                  position="absolute"
                  top={12}
                  width="100%"
                  justifyContent="center"
                  style={{ zIndex: 4, pointerEvents: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {pictures.map((_, index) => (
                      <span
                        key={`photo-slider-indicator-${index}`}
                        style={{
                          display: "inline-block",
                          width: 32,
                          height: 5,
                          borderRadius: 999,
                          backgroundColor: COLORS.white,
                          opacity: index === currentIdx ? 0.95 : 0.35,
                          marginRight: index === pictures.length - 1 ? 0 : 6,
                          transition: "opacity 0.3s ease",
                        }}
                      />
                    ))}
                  </div>
                </Box>
              )}

              {pictures.length && currentPhoto ? (
                <Slide
                  id={currentPhoto._id}
                  publicId={
                    currentPhoto.publicId ? currentPhoto.publicId : null
                  }
                  onDelete={handleDeletePhoto}
                  url={currentPhoto.url}
                  withDelete={withDelete}
                  clickDirection={clickDirection}
                />
              ) : (
                <Box
                  column
                  height={height}
                  width={width}
                  justifyContent="center"
                >
                  <Box justifyContent="center">
                    {!!isUser ? null : (
                      <Icon
                        name="user"
                        size={ICON_SIZES.XXX_LARGE}
                        color={COLORS.darkestGrey}
                      />
                    )}
                  </Box>
                  <Box justifyContent="center">
                    <h2>No Photos</h2>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

PhotoSlider.propTypes = {
  images: PropTypes.array,
  height: PropTypes.number,
  width: PropTypes.number,
  withDelete: PropTypes.bool,
  isUser: PropTypes.bool,
};

export default PhotoSlider;
