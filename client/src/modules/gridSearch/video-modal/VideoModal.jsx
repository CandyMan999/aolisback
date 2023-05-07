import React, { useState } from "react";
import { Modal, VideoUploader, Box, Text } from "../../../components";

const VideoModal = ({ onClose, senderID, receiverID }) => {
  const [sending, setSending] = useState(false);

  const handleSending = (truthy) => {
    setSending(truthy);
  };
  return (
    <Modal onClose={onClose}>
      <Box column>
        <Text width={"100%"} center bold>
          {sending ? "Sending Video..." : "Send Video Message"}
        </Text>
        <VideoUploader
          senderID={senderID}
          receiverID={receiverID}
          handleSending={handleSending}
        />
      </Box>
    </Modal>
  );
};

export default VideoModal;
