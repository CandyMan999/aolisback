import React, { useState } from "react";

import { Modal, Text, Box, Button, FONT_SIZES } from "..";
import { COLORS } from "../../constants";

const FeedBackModal = ({ onClose, state }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    onClose();
  };
  return (
    <Modal
      isLoading={loading}
      onClose={onClose}
      height={"80%"}
      width="90%"
      state={state}
    >
      <Box
        column
        width={"100%"}
        height={"100%"}
        alignItems="center"
        justifyContent="space-around"
      >
        <Text bold fontSize={FONT_SIZES.X_LARGE}>
          As a New App, We Value Your Opinion!
        </Text>
        <textarea
          name="intro"
          placeholder="How Can We Improve?"
          // value={profile.intro}
          // onChange={handleChange}
          style={{
            height: "200px",
            width: "95%",
            maxLength: 500,
            padding: "10px",
            borderRadius: "8px",
            borderColor: COLORS.deepPurple,
            borderWidth: "2px",
            backgroundColor: COLORS.lightPurple,
          }}
        />
        <Button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: `0px 2px 10px ${COLORS.pink}`,
            borderRadius: "20px",
            height: "60px",
            border: `solid 1px ${COLORS.pink}`,
          }}
          onClick={handleSubmit}
          width="60%"
          color={COLORS.black}
        >
          <Text>Submit</Text>
        </Button>
      </Box>
    </Modal>
  );
};

export default FeedBackModal;
