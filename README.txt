
4. Finish making screenshots and video
change description in wbsite public
8. Make calendar open when expanded

upload everything for production
 seed users
see if I will need to make cloudinary paid 




import React, { useState, useContext } from "react";
import { Button, Box, Icon, ICON_SIZES, Loading, Text } from "..";
import Context from "../../context";
import { COLORS } from "../../constants";
import { useHistory } from "react-router-dom"; // Assuming you are using react-router

function VideoUploader({ senderID, receiverID, handleSending }) {
  const { dispatch } = useContext(Context);
  const [submitting, setSubmitting] = useState(false);
  const history = useHistory(); // Assuming you are using react-router

  const handleRecordButtonClick = () => {
    // Generate a unique identifier
    const uniqueID = Date.now();

    // Construct the URL with query parameters
    const url = `gonechatting://capture-video?senderID=${senderID}&receiverID=${receiverID}&uniqueID=${uniqueID}`;

    // Navigate to the constructed URL
    window.location.href = url;