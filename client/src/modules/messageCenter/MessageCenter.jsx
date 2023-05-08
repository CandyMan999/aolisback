import React, { useContext, useState, useEffect } from "react";
import { Box } from "../../components";
import { useHistory } from "react-router-dom";
import MessageContainer from "./MessageContainer.jsx";
import { useClient } from "../../client";
import Context from "../../context";

const MessageCenter = () => {
  let history = useHistory();
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const currentUser = state.currentUser;
  const { sentVideos, receivedVideos } = currentUser;

  const [groupedReceived, setGroupReceived] = useState(null);

  useEffect(() => {
    if (receivedVideos && !!receivedVideos.length) {
      groupVideosBySender(receivedVideos);
    }
  }, [receivedVideos]);

  const groupVideosBySender = (videos) => {
    const groups = {};

    for (const video of videos) {
      const senderUsername = video.sender.username;

      if (groups[senderUsername]) {
        groups[senderUsername].push(video);
      } else {
        groups[senderUsername] = [video];
      }
    }

    setGroupReceived(Object.values(groups));
  };

  return (
    <Box width="100%" display="flex" column>
      <MessageContainer
        history={history}
        client={client}
        dispatch={dispatch}
        currentUser={currentUser}
        receivedVideos={groupedReceived}
      />
    </Box>
  );
};

export default MessageCenter;
