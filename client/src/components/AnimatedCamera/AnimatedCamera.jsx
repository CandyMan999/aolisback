import React, { Fragment, useContext, useState } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { COLORS } from "../../constants";
import { PiVideoCameraFill } from "react-icons/pi";
import { VIDEO_CHAT_REQUEST } from "../../graphql/mutations";
import { useClient } from "../../client";
import Context from "../../context";
import { track } from "@vercel/analytics";

const AnimatedCamera = ({ _id }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const { currentUser } = state;
  const [loading, setLoading] = useState(false);

  const handleVideoChatRequest = async () => {
    try {
      if (
        currentUser.plan.videoMinutes + currentUser.plan.additionalMinutes <=
        currentUser.plan.videoMinutesUsed
      ) {
        window.ReactNativeWebView.postMessage("BUY_MINUTES");

        return;
      }

      track("Video_Call", {
        sender: state.currentUser.username,
        receiver: _id,
      });

      setLoading(true);
      const variables = {
        senderID: state.currentUser._id,
        receiverID: _id,
        status: "Pending",
      };

      const { videoChatRequest } = await client.request(
        VIDEO_CHAT_REQUEST,
        variables
      );

      dispatch({ type: "TOGGLE_PROFILE", payload: false });
      dispatch({ type: "TOGGLE_CHAT", payload: true });

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      // Track the error for debugging in production
      track("Video_Call_Error", {
        sender: state.currentUser.username,
        receiver: _id,
        error: err.message,
      });
    }
  };

  return (
    <StyledButton
      whileTap={{ scale: 0.7 }}
      whileHover={{ scale: 1.1 }}
      onClick={loading ? undefined : handleVideoChatRequest}
      type={"button"}
      animate={{
        scale: [1, 1.3, 1], // Keyframes for scaling up and down
        color: [COLORS.pink, COLORS.pink], // Keyframes for color change
      }}
      style={{ display: "flex", flexDirection: "column" }}
      transition={{
        duration: 1.5,
        repeat: Infinity, // Repeat the animation indefinitely
        repeatType: "mirror", // Mirror the animation for smooth looping
        ease: "easeInOut", // Easing function for smooth transition
      }}
    >
      <Fragment>
        <PiVideoCameraFill size={30} />
        online
      </Fragment>
    </StyledButton>
  );
};

const StyledButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: none;
  background-color: transparent;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export default AnimatedCamera;
