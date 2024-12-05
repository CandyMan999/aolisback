import React, { useState, useContext, useCallback } from "react";
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

// Import react-easy-crop
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

const MyPhotos = ({ currentUser, total, completed, onClose }) => {
  const client = useClient();
  const { dispatch } = useContext(Context);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [close, setClose] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [photos, setPhotos] = useState(currentUser.pictures || []);

  // State variables for cropping
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // New state for media size
  const [mediaSize, setMediaSize] = useState({ width: 0, height: 0 });

  const handleImageUpload = async (fileBlob) => {
    const data = new FormData();
    data.append("file", fileBlob, "croppedImage.jpeg");
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
      console.error("Error uploading image:", err);
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

  // Updated handleUploadImage function
  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset previous cropping data
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);

    // Read the image file as a data URL
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result); // Set the image source for the cropper
      setShowCropper(true); // Show the cropper modal
    });
    reader.readAsDataURL(file);

    // Reset the input value to allow selecting the same file again
    event.target.value = null;
  };

  // Function to handle crop completion
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Function to generate the cropped image
  const getCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) {
      return null;
    }

    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
            blob.name = "croppedImage.jpeg";
            resolve(blob);
          },
          "image/jpeg",
          1
        );
      });
    } catch (e) {
      console.error("Failed to crop image:", e);
      return null;
    }
  }, [imageSrc, croppedAreaPixels]);

  // Utility function to create an Image object
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (error) => reject(error));
      img.src = url;
    });

  // Handle saving the cropped image
  const handleCropSave = async () => {
    setIsProcessing(true);
    try {
      const croppedImageBlob = await getCroppedImage();
      if (croppedImageBlob) {
        setLoadingIndex(photos.length);

        const { url, publicId } = await handleImageUpload(croppedImageBlob);
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
        setShowCropper(false);
        setImageSrc(null); // Reset imageSrc after closing the cropper
      } else {
        setError("Error cropping image");
      }
    } catch (err) {
      console.error(err);
      setLoadingIndex(null);
      setError("Error processing the cropped image");
      setTimeout(() => {
        setError("");
      }, 1000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setClose(true);
    setTimeout(() => {
      setClose(false);
    }, [1000]);
  };

  // Handle crop change to allow movement
  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  // Adjust zoom to fit the entire image
  const onMediaLoaded = useCallback((mediaSize) => {
    setMediaSize(mediaSize);

    // Calculate the zoom to fit the image within the cropper
    const { width, height } = mediaSize;
    const cropAreaSize = 300; // The size of the crop area (square)

    const zoomLevel = Math.min(cropAreaSize / width, cropAreaSize / height);

    setZoom(zoomLevel);
  }, []);

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
        <Box
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
          // style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          {photos.map((photo, index) => (
            <Box
              key={index}
              width="45%"
              maxWidth="250px"
              height="auto"
              minHeight="150px"
              justifyContent="center"
              alignItems="center"
              marginVertical={8}
              backgroundColor={COLORS.lightPurple}
              position="relative"
              borderRadius="10px"
              borderColor={COLORS.pink}
              borderWidth={1}
              marginTop={10}
              margin={5}
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
              width="45%"
              maxWidth="250px"
              height="auto"
              minHeight="150px"
              justifyContent="center"
              alignItems="center"
              marginVertical={8}
              backgroundColor={COLORS.lightPurple}
              position="relative"
              borderRadius="10px"
              style={{
                border: `solid 1px ${COLORS.pink}`,
                cursor: isProcessing || showCropper ? "not-allowed" : "pointer",
                minWidth: 150,
              }}
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
                disabled={isProcessing || showCropper}
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

        {/* Cropper Modal */}
        {showCropper && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              overflow: "auto",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 10,
                maxWidth: "90%",
                maxHeight: "90%",
                overflow: "auto",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "80vw",
                  height: "60vh",
                  backgroundColor: "#333",
                  overflow: "hidden",
                  margin: "0 auto",
                }}
              >
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="rect"
                  onCropChange={onCropChange}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  zoomWithScroll={true}
                  restrictPosition={false}
                  objectFit="contain"
                  showGrid={true}
                  onMediaLoaded={onMediaLoaded}
                />
              </div>
              <Box
                width="100%"
                flexDirection="row"
                justifyContent="space-between"
                marginTop={20}
              >
                <Button
                  onClick={() => {
                    setShowCropper(false);
                    setImageSrc(null); // Reset imageSrc when canceling
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: `0px 2px 10px ${COLORS.lightGrey}`,
                    borderRadius: "20px",
                    height: "60px",
                    border: `solid 1px ${COLORS.pink}`,
                  }}
                  width={"50%"}
                  disabled={isProcessing}
                  color={COLORS.red}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCropSave}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: `0px 2px 10px ${COLORS.pink}`,
                    borderRadius: "20px",
                    height: "60px",
                    border: `solid 1px ${COLORS.pink}`,
                  }}
                  width={"50%"}
                  disabled={isProcessing}
                  color={COLORS.white}
                >
                  {isProcessing ? (
                    <Loading pulse size={5} />
                  ) : (
                    <Text bold color={COLORS.black}>
                      Save Crop
                    </Text>
                  )}
                </Button>
              </Box>
            </div>
          </div>
        )}
      </Box>
    </CollapsableHeader>
  );
};

export default MyPhotos;
