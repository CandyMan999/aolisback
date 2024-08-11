import React, { useState, useContext } from "react";
import {
  CollapsableHeader,
  Box,
  Button,
  Text,
  Loading,
  FONT_SIZES,
} from "../../../components";
import { COLORS } from "../../../constants";
import { useClient } from "../../../client";
import {
  ADD_PHOTO_MUTATION,
  DELETE_PHOTO_MUTATION,
} from "../../../graphql/mutations";
import { FaTimesCircle } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";

import axios from "axios";
import Context from "../../../context";

const MyPhotos = ({ currentUser, total, completed, onClose }) => {
  const client = useClient();
  const { dispatch } = useContext(Context);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [close, setClose] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [photos, setPhotos] = useState(currentUser.pictures || []);

  const handleImageUpload = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "northShoreExpress");
    data.append("cloud_name", "aolisback");
    data.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
    data.append("api_secret", process.env.REACT_APP_CLOUDINARY_API_SECRET);

    try {
      const response = await axios.post(
        process.env.REACT_APP_CLOUDINARY_IMAGE,
        data
      );
      let secureUrl = response.data.secure_url;
      if (secureUrl) {
        secureUrl = response.data.url.replace("http://", "https://");
      }
      return { url: secureUrl, publicId: response.data.public_id };
    } catch (err) {
      return { url: null, publicId: null };
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      const variables = { userId: currentUser._id, photoId };
      const { deletePhoto } = await client.request(
        DELETE_PHOTO_MUTATION,
        variables
      );
      dispatch({ type: "UPDATE_USER_PHOTOS", payload: deletePhoto.pictures });
      setPhotos(deletePhoto.pictures);
    } catch (err) {
      setError("Error deleting photo");
    }
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoadingIndex(photos.length);

    try {
      const { url, publicId } = await handleImageUpload(file);
      if (url && publicId) {
        const variables = { _id: currentUser._id, url, publicId };
        const { addPhoto } = await client.request(
          ADD_PHOTO_MUTATION,
          variables
        );
        dispatch({ type: "UPDATE_USER_PHOTOS", payload: addPhoto.pictures });
        setPhotos(addPhoto.pictures);
        setSuccess("Photo uploaded successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 1000);
      } else {
        setError("Error uploading photo");
        setTimeout(() => {
          setError("");
        }, 1000);
      }
      setLoadingIndex(null);
    } catch (err) {
      setLoadingIndex(null);
      setError("Error uploading photo");
      setTimeout(() => {
        setError("");
      }, 1000);
    }
  };

  const handleClose = () => {
    setClose(true);
    setTimeout(() => {
      setClose(false);
    }, [1000]);
  };

  return (
    <CollapsableHeader
      title="My Photos"
      total={total}
      completed={completed}
      onClose={close}
    >
      <Box width={"100%"} column alignItems="center">
        <Text fontSize={FONT_SIZES.XX_LARGE} color={COLORS.main} bold center>
          Time to put a face to the name
        </Text>
        <Text fontSize={FONT_SIZES.MEDIUM} marginVertical={16} center bold>
          Let your personality shine by adding at least 4 photos. Whether it's a
          candid moment, your favorite hobby, or a place you love, share your
          story with the world.
        </Text>
        <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between">
          {photos.map((photo, index) => (
            <Box
              key={index}
              width="48%"
              height={"auto"}
              justifyContent="center"
              alignItems="center"
              marginVertical={8}
              backgroundColor={COLORS.lightPurple}
              position="relative"
              borderRadius="10px"
              borderColor={COLORS.pink}
              borderWidth={1}
              marginTop={10}
            >
              <img
                src={photo.url}
                alt={`Photo-${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <Button
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  backgroundColor: "white",
                  borderRadius: "50%",
                  height: 34,
                  width: 34,
                  // alignItems: "center",
                  // justifyContent: "center",
                }}
                onClick={() => handleDeletePhoto(photo._id)}
              >
                <FaTimesCircle
                  style={{
                    padding: 0,
                    margin: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  size={36}
                  color="red"
                />
              </Button>
            </Box>
          ))}
          {photos.length < 6 && (
            <Box
              width="48%"
              height="150px"
              justifyContent="center"
              alignItems="center"
              marginVertical={8}
              backgroundColor={COLORS.lightPurple}
              position="relative"
              borderRadius="10px"
              style={{ border: `solid 1px ${COLORS.pink}`, cursor: "pointer" }}
              as="label"
              htmlFor="upload-photo"
              marginTop={10}
            >
              {loadingIndex === photos.length ? (
                <Loading bar color={COLORS.white} />
              ) : (
                <AiOutlinePlus size={24} color={COLORS.deepPurple} />
              )}
              <input
                type="file"
                id="upload-photo"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleUploadImage}
              />
            </Box>
          )}
        </Box>
        {error && (
          <Text color="red" marginVertical={8}>
            {error}
          </Text>
        )}
        {success && (
          <Text color="green" marginVertical={8}>
            {success}
          </Text>
        )}

        <Button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: `0px 2px 10px ${COLORS.pink}`,
            borderRadius: "20px",
            height: "60px",
            border: `solid 1px ${COLORS.pink}`,
            marginTop: 30,
          }}
          width={"80%"}
          onClick={handleClose}
          color={COLORS.black}
        >
          <Box flexDirection="row" alignItems="center" justifyContent="center">
            <Text bold color={COLORS.pink} fontSize={20} paddingRight={15}>
              Close
            </Text>
          </Box>
        </Button>
      </Box>
    </CollapsableHeader>
  );
};

export default MyPhotos;
