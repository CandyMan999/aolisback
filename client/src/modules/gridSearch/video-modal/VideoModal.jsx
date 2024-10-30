import React, { useState } from "react";
import { isDesktop } from "react-device-detect";
import {
  Modal,
  VideoUploader,
  Text,
  FONT_SIZES,
  CompVideoUploader,
} from "../../../components";
import { COLORS } from "../../../constants";

const VideoModal = ({ onClose, senderID, receiverID, state, closeModal }) => {
  const [sending, setSending] = useState(false);

  const handleSending = (truthy) => {
    setSending(truthy);
  };
  return (
    <Modal dark={sending} onClose={onClose} state={state}>
      <Text
        fontSize={FONT_SIZES.X_LARGE}
        width={"100%"}
        center
        bold
        color={sending ? COLORS.white : COLORS.black}
        position={"absolute"}
        style={{ top: sending ? 60 : 20 }}
      >
        {sending ? "Sending Video..." : "Send Video Message"}
      </Text>
      {isDesktop ? (
        <CompVideoUploader
          senderID={senderID}
          receiverID={receiverID}
          handleSending={handleSending}
        />
      ) : (
        <VideoUploader
          senderID={senderID}
          closeModal={closeModal}
          receiverID={receiverID}
          handleSending={handleSending}
        />
      )}
    </Modal>
  );
};

export default VideoModal;
