import React, { useContext, useState, useEffect } from "react";
import { FETCH_ME } from "../../graphql/queries";
import { Box, Loading } from "../../components";
import { useHistory } from "react-router-dom";
import MessageContainer from "./MessageContainer.jsx";
import { useClient } from "../../client";
import Context from "../../context";
import { getToken } from "../../utils/helpers";

const MessageCenter = () => {
  let history = useHistory();
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const currentUser = state.currentUser;
  // const { sentVideos, receivedVideos } = currentUser;
  const [receivedVideos, setReceivedVideos] = useState([]);
  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [groupedReceived, setGroupReceived] = useState(null);

  useEffect(() => {
    if (token) {
      handleFetchMe();
    }
  }, [token]);

  useEffect(() => {
    if (receivedVideos && !!receivedVideos.length) {
      groupVideosBySender(receivedVideos);
    }
  }, [receivedVideos]);

  const handleFetchMe = async () => {
    try {
      setLoading(true);
      const variables = {
        token,
      };

      const { fetchMe } = await client.request(FETCH_ME, variables);

      await setReceivedVideos(fetchMe.receivedVideos);

      await dispatch({ type: "LOGIN_USER", payload: fetchMe });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const groupVideosBySender = (videos) => {
    try {
      setLoading(true);
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
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <Box width="100%" display="flex" column>
      {loading ? (
        <Box height="100vH" alignItems="center">
          <Loading grid size={100} />
        </Box>
      ) : (
        <MessageContainer
          history={history}
          client={client}
          dispatch={dispatch}
          currentUser={currentUser}
          receivedVideos={groupedReceived}
        />
      )}
    </Box>
  );
};

export default MessageCenter;
