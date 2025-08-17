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

  const handleImageUpload = async (image) => {
    try {
      const form = new FormData();
      // if `image` is a URI string in RN/web, wrap it properly:
      const filePart =
        typeof image === "string"
          ? { uri: image, name: "upload.jpg", type: "image/jpeg" }
          : image;

      form.append("file", filePart);

      const res = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.REACT_APP_CF_ACCOUNT_ID}/images/v1`,
        form,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_CF_API_TOKEN}`,
            ...(form.getHeaders ? form.getHeaders() : {}),
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      const { id, variants } = res.data.result;

      // Cloudflare already gives you ready-to-use URLs in `variants`
      // Use the first variant or pick the one you want
      const deliveryUrl = variants[0];

      return { url: deliveryUrl, publicId: id };
    } catch (err) {
      console.error(
        "Cloudflare upload failed:",
        err.response?.data || err.message
      );
      return { url: null, publicId: null };
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
