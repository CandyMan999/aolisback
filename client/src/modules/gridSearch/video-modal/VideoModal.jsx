import React, { useState } from "react";

import {
  Modal,
  Text,
  FONT_SIZES,
  CompVideoUploader,
} from "../../../components";
import { COLORS } from "../../../constants";

const VideoModal = ({ onClose, senderID, receiverID, state }) => {
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

      <CompVideoUploader
        senderID={senderID}
        receiverID={receiverID}
        handleSending={handleSending}
      />
    </Modal>
  );
};

export default VideoModal;
