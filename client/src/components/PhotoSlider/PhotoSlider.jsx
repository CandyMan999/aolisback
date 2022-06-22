import React, { useState, useEffect } from "react";

import { Box, Icon, ICON_SIZES } from "..";
import { COLORS } from "../../constants";
import Slide from "./Slide";
import NavArrow from "./NavArrow";

// interface Props {
//   images: any[];
//   height: number;
//   width: number;
//   withDelete?: boolean;
//   isUser?: boolean;
// }

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

  const border = (height + 10) * 0.1;

  return (
    <Box
      justifyContent="center"
      height={height + 10}
      width={"70vW"}
      border="3px solid #ccc"
      background={COLORS.white}
    >
      <Box
        position="absolute"
        background="black"
        width={"100%"}
        height={border}
      />

      {pictures.length && (
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
        position="absolute"
        justifyContent="center"
        paddingTop={border}
        paddingBottom={border}
      >
        <Box justifyContent="center">
          {pictures.length && currentPhoto ? (
            <Slide
              id={currentPhoto._id}
              onDelete={handleDeletePhoto}
              url={currentPhoto.url}
              height={height - border}
              width={width - border}
              withDelete={withDelete}
              countStr={`${currentIdx + 1} of ${pictures.length}`}
            />
          ) : (
            <Box
              column
              position={"absolute"}
              justifyContent="center"
              height={height}
              width={width}
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

      {pictures.length && (
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

      <Box
        position="absolute"
        background="black"
        bottom={0}
        width={"100%"}
        height={border}
      />
    </Box>
  );
};

export default PhotoSlider;
