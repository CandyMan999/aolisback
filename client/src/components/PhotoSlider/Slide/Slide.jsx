import React, { useContext, useState, useEffect } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { AnimatePresence, motion } from "framer-motion";

import { Box, Button, Loading } from "../..";
import { COLORS } from "../../../constants";

import { DELETE_PHOTO_MUTATION } from "../../../graphql/mutations";
import Context from "../../../context";
import { useClient } from "../../../client";

const Slide = ({
  countStr,
  height,
  id,
  url,
  width,
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
    <Box noFlex>
      {!!publicId ? (
        <AnimatePresence>
          {!photoLoaded && (
            <Box height={250} width={"100%"}>
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
          >
            {myImage && (
              <AdvancedImage
                cldImg={myImage}
                style={{
                  width: "100%",
                  height: "auto",
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
            maxWidth: mobile ? 240 : 270,
            borderRadius: 10,
            maxHeight: mobile ? 259 : 290,
            height: mobile ? 259 : 290,
            width: mobile ? 240 : 290,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      {countStr && withDelete && (
        <Box
          width="100%"
          position="absolute"
          top={8}
          center
          justifyContent="center"
        >
          <span style={{ color: COLORS.lightGrey, fontSize: "12px" }}>
            {countStr}
          </span>
        </Box>
      )}

      {withDelete && (
        <Box
          width={"100%"}
          zIndex={1}
          justifyContent="center"
          position="absolute"
          bottom={25}
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
