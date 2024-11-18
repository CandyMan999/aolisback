import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Icon, ICON_SIZES, Loading } from ".."; // Import Spinner component
import { COLORS } from "../../constants";
import Slide from "./Slide";
import NavArrow from "./NavArrow";

const PhotoSlider = ({ height, images, width, withDelete, isUser }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [pictures, setPictures] = useState([]);
  const [clickDirection, setClickDirection] = useState("right");
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    if (images && images.length > 0) {
      const loadImages = async () => {
        const promises = images.map((image) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = image.url;
            img.onload = resolve;
          });
        });

        await Promise.all(promises);
        setPictures([...images]);
        setLoading(false);
      };

      loadImages();
    } else {
      setLoading(false);
    }
  }, [images]);

  const currentPhoto = pictures[currentIdx];

  const changeSlide = (n) => {
    const newIdx = currentIdx + n;
    setCurrentIdx(newIdx >= 0 ? newIdx % pictures.length : pictures.length - 1);
  };

  const nextSlide = () => {
    setClickDirection("right");
    changeSlide(1);
  };

  const prevSlide = () => {
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
          {pictures.length > 1 && (
            <Box
              position="absolute"
              left={2}
              column
              justifyContent="center"
              height={"100%"}
              zIndex={10}
            >
              <NavArrow direction="left" onClick={prevSlide} />
            </Box>
          )}

          <Box display="flex" alignItems="center" justifyContent="center">
            <Box justifyContent="center" position="relative">
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
                  height={height}
                  width={width}
                  withDelete={withDelete}
                  clickDirection={clickDirection}
                  countStr={`${currentIdx + 1} of ${pictures.length}`}
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

          {pictures.length > 1 && (
            <Box
              position="absolute"
              column
              justifyContent="center"
              right={2}
              height={"100%"}
              zIndex={10}
            >
              <NavArrow direction="right" onClick={nextSlide} />
            </Box>
          )}
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
