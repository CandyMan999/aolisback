import React, { useEffect, useState, Fragment, useContext } from "react";
import axios from "axios";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";

import { Box, Text } from "..";

import { COLORS } from "../../constants";
import { ADD_PHOTO_MUTATION } from "../../graphql/mutations";
import Context from "../../context";
import { useClient } from "../../client";

const PhotoUploader = () => {
  const { state, dispatch } = useContext(Context);
  const client = useClient();
  const [image, setImages] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (image) {
      imageUploader();
    }
  }, [image]);

  const imageUploader = async () => {
    try {
      const { url, publicId } = await handleImageUpload();
      const variables = { url, _id: state.currentUser._id, publicId };
      const { addPhoto } = await client.request(ADD_PHOTO_MUTATION, variables);
      dispatch({ type: "UPDATE_USER", payload: addPhoto });
      setTimeout(() => setImages(""), 2000);
    } catch (err) {
      console.log(err);
      setError("file size too large");
    }
  };

  const handleImageUpload = async () => {
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "northShoreExpress");
      data.append("cloud_name", "aolisback");

      const res = await axios.post(
        process.env.REACT_APP_CLOUDINARY_IMAGE,
        data
      );

      return { url: res.data.url, publicId: res.data.public_id };
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <Box margin={5} justifyContent="center">
        <input
          accept="image/*"
          id="image"
          type="file"
          onChange={(e) => setImages(e.target.files[0])}
        />

        <label htmlFor="image">
          <AddAPhotoIcon
            style={{ color: image && COLORS.themeGreen }}
          ></AddAPhotoIcon>
        </label>
      </Box>
      {image && (
        <Text center color={!error ? COLORS.themeGreen : COLORS.textRed}>
          {!error ? "Success add another!" : error}
        </Text>
      )}
    </Fragment>
  );
};

export default PhotoUploader;
