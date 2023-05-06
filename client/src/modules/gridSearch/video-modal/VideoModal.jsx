import React from "react";
import { Modal, VideoUploader, Box, Text } from "../../../components";

const VideoModal = ({ onClose, senderID, receiverID }) => {
  return (
    <Modal onClose={onClose}>
      <Box column>
        <Text> Send Video Message</Text>
        <VideoUploader senderID={senderID} receiverID={receiverID} />
      </Box>
    </Modal>
  );
};

export default VideoModal;
