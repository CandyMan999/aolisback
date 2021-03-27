import React, { useContext, useState } from "react";

import { Box, Button } from "../..";
import { COLORS } from "../../../constants";

import { DELETE_PHOTO_MUTATION } from "../../../graphql/mutations";
import Context from "../../../context";
import { useClient } from "../../../client";

const Slide = ({ countStr, height, id, url, width, onDelete, withDelete }) => {
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
      <img src={url} width={"auto"} height={height} />

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
          bottom={0}
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
