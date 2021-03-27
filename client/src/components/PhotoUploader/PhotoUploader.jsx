import React, { useEffect, useState, Fragment, useContext } from "react";
import axios from "axios";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";

import { Icon, Box, Loading, Checkbox, Button, Text } from "..";

import { css } from "@emotion/css";
import { COLORS } from "../../constants";
import { ADD_PHOTO_MUTATION } from "../../graphql/mutations";
import Context from "../../context";
import { useClient } from "../../client";

const PhotoUploader = () => {
  const { state, dispatch } = useContext(Context);
  const client = useClient();
  const [image, setImages] = useState();

  useEffect(async () => {
    if (image) {
      const url = await handleImageUpload();
      const variables = { url, _id: state.currentUser._id };
      const { addPhoto } = await client.request(ADD_PHOTO_MUTATION, variables);
      dispatch({ type: "UPDATE_USER", payload: addPhoto });
      setTimeout(() => setImages(""), 2000);
    }
  }, [image]);

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "northShoreExpress");
    data.append("cloud_name", "aolisback");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/aolisback/image/upload",
      data
    );

    return res.data.url;
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
        <Text center color={COLORS.themeGreen}>
          Success add another!
        </Text>
      )}
    </Fragment>
  );
};

export default PhotoUploader;
