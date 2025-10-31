import React, { useContext, useState, useEffect } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { Cloudinary } from "@cloudinary/url-gen";

import { AnimatePresence, motion } from "framer-motion";

import { Box, Button, Loading } from "../..";
import { COLORS } from "../../../constants";

import { DELETE_PHOTO_MUTATION } from "../../../graphql/mutations";
import Context from "../../../context";
import { useClient } from "../../../client";

const Slide = ({
  id,
  url,
  forceDimensions,
  clickDirection,
  onDelete,
  withDelete,
  publicId,
}) => {
  const mobile = useMediaQuery("(max-width: 1300px)");
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [myImage, setMyImage] = useState(null);
  const { currentUser } = state;

  const toCssDimension = (value) => {
    if (value === null || value === undefined) {
      return undefined;
    }

    return typeof value === "number" ? `${value}px` : value;
  };

  const resolvedHeight =
    forceDimensions && forceDimensions.height !== undefined
      ? forceDimensions.height
      : undefined;
  const resolvedWidth =
    forceDimensions && forceDimensions.width !== undefined
      ? forceDimensions.width
      : undefined;
  const containerHeight = toCssDimension(resolvedHeight);
  const containerWidth = toCssDimension(resolvedWidth);

  // Create a Cloudinary instance and set your cloud name.
  const cld = new Cloudinary({
    cloud: {
      cloudName: "localmassagepros",
    },
  });

  useEffect(() => {
    handleImage();
  }, [publicId]);

  const handleDeletePhoto = async (id) => {
    const variables = { photoId: id, userId: currentUser._id };

    setLoading(true);
    try {
      const { deletePhoto } = await client.request(
        DELETE_PHOTO_MUTATION,
        variables
      );

      dispatch({ type: "UPDATE_USER_PHOTOS", payload: deletePhoto.pictures });
      setLoading(false);
      onDelete(id);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleLoad = () => {
    setPhotoLoaded(true);
  };

  const handleError = () => {
    setPhotoLoaded(true);
  };

  const handleImage = () => {
    if (publicId) {
      const data = cld.image(publicId);
      if (data) {
        setMyImage(data);
      }
    }
  };

  return (
    <Box
      noFlex
      height={resolvedHeight}
      width={resolvedWidth || "100%"}
      style={{
        overflow: resolvedHeight ? "hidden" : undefined,
      }}
    >
      {!!publicId ? (
        <AnimatePresence>
          {!photoLoaded && (
            <Box height={resolvedHeight ?? 250} width={resolvedWidth || "100%"}>
              <Loading logo />
            </Box>
          )}
          <motion.div
            key={publicId}
            initial={{
              x: clickDirection === "left" ? -300 : 300,
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            exit={{
              x: clickDirection === "left" ? 300 : -300,
              opacity: 0,
              position: "absolute",
            }}
            style={{
              height: containerHeight || "100%",
              width: containerWidth || "100%",
            }}
          >
            {myImage && (
              <img
                alt={`img-${myImage.publicId}`}
                src={url}
                style={{
                  width: "100%",
                  height: containerHeight ? "100%" : "auto",
                  maxHeight: containerHeight || undefined,
                  objectFit: containerHeight ? "cover" : undefined,
                  objectPosition: containerHeight ? "center" : undefined,
                  borderBottom: `solid 2px ${COLORS.vividBlue}`,
                  display: photoLoaded ? "block" : "none",
                }}
                onLoad={handleLoad}
                onError={handleError}
              />
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        <Box
          style={{
            backgroundImage: `url(${url})`,
            maxWidth: containerWidth || (mobile ? 240 : 270),
            borderRadius: 10,
            maxHeight: containerHeight || (mobile ? 259 : 290),
            height: containerHeight || (mobile ? 259 : 290),
            width: containerWidth || (mobile ? 240 : 290),
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      {withDelete && (
        <Box
          width={"100%"}
          zIndex={6}
          justifyContent="center"
          position="absolute"
          bottom={25}
          style={{ zIndex: 1000 }}
        >
          <Button
            critical
            size="small"
            width={64}
            onClick={() => handleDeletePhoto(id)}
            disabled={loading}
          >
            Delete
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Slide;
