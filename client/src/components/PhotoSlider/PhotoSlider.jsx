import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Icon, ICON_SIZES, Loading } from ".."; // Import Spinner component
import { COLORS } from "../../constants";
import Slide from "./Slide";
import NavArrow from "./NavArrow";

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
            <Box justifyContent="center" position="relative">
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
                          width: 28,
                          height: 4,
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

              {pictures.length > 1 && (
                <>
                  <Box
                    position="absolute"
                    top={0}
                    bottom={0}
                    left={0}
                    width="50%"
                    onClick={prevSlide}
                    role="button"
                    aria-label="View previous photo"
                    style={{ zIndex: 10 }}
                  ></Box>
                  <Box
                    position="absolute"
                    top={0}
                    bottom={0}
                    right={0}
                    width="50%"
                    onClick={nextSlide}
                    role="button"
                    aria-label="View next photo"
                    style={{ zIndex: 10 }}
                  />
                </>
              )}

              {/* <Box
                position="absolute"
                row
                zIndex={10}
                top={2}
                left={10}
                marginTop={2}
                boxShadow={`2px 2px 4px 2px ${COLORS.pink}`}
                borderRadius={30}
                height={60}
                width={60}
                alignItems="center"
                justifyContent="center"
              >
                👍❤️
              </Box> */}
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
