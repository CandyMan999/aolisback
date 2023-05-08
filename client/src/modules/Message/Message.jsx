import React, { useContext, useState, useEffect } from "react";
import { Box, Icon, ICON_SIZES } from "../../components";
import { COLORS } from "../../constants";
import { useHistory, useLocation } from "react-router-dom";

import { useClient } from "../../client";
import Context from "../../context";

const Message = () => {
  let history = useHistory();
  const location = useLocation();
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const currentUser = state.currentUser;
  const { sentVideos, receivedVideos } = currentUser;
  const senderID = new URLSearchParams(location.search).get("sender");

  const [groupedReceived, setGroupReceived] = useState(null);

  useEffect(() => {
    if (receivedVideos && !!receivedVideos.length && !!senderID) {
      groupVideosBySender(receivedVideos);
    }
  }, [senderID]);

  const groupVideosBySender = (videos) => {
    const array = [];

    for (const video of videos) {
      const senderId = video.sender._id;

      if (senderId === senderID) {
        array.push(video);
      }
    }
    console.log("received :", array);
    setGroupReceived(array);
  };

  const handleOnClick = () => {
    history.push({
      pathname: "/message-center",
    });
  };

  return (
    <Box
      display="flex"
      margin={20}
      justifyContent="space-around"
      card
      height={"calc(100vH - 60px)"}
      width="95%"
      maxHeight={1066}
    >
      <Box onClick={handleOnClick}>
        <Icon name="back" size={ICON_SIZES.LARGE} color={COLORS.black} />
      </Box>
      Message Open for sender with ID: {senderID}
    </Box>
  );
};

export default Message;
