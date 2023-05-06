import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Box, Icon, ICON_SIZES } from "..";
import { COLORS } from "../../constants";
import Slide from "./Slide";
import NavArrow from "./NavArrow";

const PhotoSlider = ({ height, images, width, withDelete, isUser }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [pictures, setPictures] = useState([]);
  useEffect(() => {
    if (!!images) {
      setPictures([...images]);
    }
  }, [images]);

  const currentPhoto = pictures[currentIdx];

  const changeSlide = (n) => {
    const newIdx = currentIdx + n;
    setCurrentIdx(newIdx >= 0 ? newIdx % pictures.length : pictures.length - 1);
  };

  const nextSlide = () => changeSlide(1);
  const prevSlide = () => changeSlide(-1);

  const handleDeletePhoto = (id) => {
    if (currentIdx === pictures.length - 1) {
      setCurrentIdx(0);
    }
    setPictures([...pictures.filter((picture) => picture._id !== id)]);
  };

  return (
    <Box
      justifyContent="center"
      height={height + 30}
      width={"100%"}
      background={COLORS.white}
      style={{ overflow: "hidden" }}
    >
      {pictures.length > 0 && (
        <Box
          position="absolute"
          left={2}
          column
          justifyContent="center"
          height={height + 10}
          zIndex={10}
        >
          <NavArrow direction="left" onClick={prevSlide} />
        </Box>
      )}

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        // paddingTop={border}
        // paddingBottom={border}
      >
        <Box justifyContent="center">
          {pictures.length && currentPhoto ? (
            <Slide
              id={currentPhoto._id}
              publicId={currentPhoto.publicId ? currentPhoto.publicId : null}
              onDelete={handleDeletePhoto}
              url={currentPhoto.url}
              height={height}
              width={width}
              withDelete={withDelete}
              countStr={`${currentIdx + 1} of ${pictures.length}`}
            />
          ) : (
            <Box column height={height} width={width} justifyContent="center">
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

      {pictures.length > 0 && (
        <Box
          position="absolute"
          column
          justifyContent="center"
          right={2}
          height={height + 10}
          zIndex={10}
        >
          <NavArrow direction="right" onClick={nextSlide} />
        </Box>
      )}

      {/* <Box
        position="absolute"
        background="black"
        bottom={0}
        width={"100%"}
        height={border}
      /> */}
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
