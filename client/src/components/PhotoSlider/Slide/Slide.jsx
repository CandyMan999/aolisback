import React, { useContext, useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Image, Transformation, CloudinaryContext } from "cloudinary-react";
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
  const { currentUser } = state;

  const handleDeletePhoto = async (id) => {
    const variables = { photoId: id, userId: currentUser._id };
    setLoading(true);
    try {
      const { deletePhoto } = await client.request(
        DELETE_PHOTO_MUTATION,
        variables
      );

      dispatch({ type: "UPDATE_USER", payload: deletePhoto });
      setLoading(false);
      onDelete(id);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <Box noFlex>
      {!!publicId ? (
        <AnimatePresence>
          <CloudinaryContext cloudName="localmassagepros">
            <motion.div
              key={publicId}
              initial={{
                x: clickDirection === "left" ? -300 : 300,
                opacity: 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: clickDirection === "left" ? 300 : -300, opacity: 0 }}
            >
              <Image
                style={{
                  borderRadius: 10,
                  width: "100%",
                  height: "auto",
                }}
                loading="lazy"
                publicId={publicId}
                id="slide-photo"
              >
                <Transformation crop="scale" />
              </Image>
            </motion.div>
          </CloudinaryContext>
        </AnimatePresence>
      ) : (
        <Box
          style={{
            backgroundImage: `url(${url})`,
            maxWidth: mobile ? "100%" : width,
            borderRadius: 10,
            maxHeight: height,
            height: "auto",
            width: "100%",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      {countStr && (
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
