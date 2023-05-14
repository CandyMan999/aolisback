import React, { useState } from "react";
import {
  Modal,
  VideoUploader,
  Box,
  Text,
  FONT_SIZES,
} from "../../../components";

const VideoModal = ({ onClose, senderID, receiverID }) => {
  const [sending, setSending] = useState(false);

  const handleSending = (truthy) => {
    setSending(truthy);
  };
  return (
    <Modal onClose={onClose}>
      <Text
        fontSize={FONT_SIZES.X_LARGE}
        width={"100%"}
        center
        bold
        position={"absolute"}
        style={{ top: sending ? 60 : 20 }}
      >
        {sending ? "Sending Video..." : "Send Video Message"}
      </Text>
      <VideoUploader
        senderID={senderID}
        receiverID={receiverID}
        handleSending={handleSending}
      />
    </Modal>
  );
};

export default VideoModal;
