import React, { useState } from "react";
import {
  Modal,
  VideoUploader,
  Box,
  Text,
  FONT_SIZES,
  CompVideoUploader,
} from "../../../components";

const VideoModal = ({ onClose, senderID, receiverID, state, mobile }) => {
  const [sending, setSending] = useState(false);

  const handleSending = (truthy) => {
    setSending(truthy);
  };
  return (
    <Modal onClose={onClose} state={state}>
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
      {mobile ? (
        <VideoUploader
          senderID={senderID}
          receiverID={receiverID}
          handleSending={handleSending}
        />
      ) : (
        <CompVideoUploader
          senderID={senderID}
          receiverID={receiverID}
          handleSending={handleSending}
        />
      )}
    </Modal>
  );
};

export default VideoModal;
