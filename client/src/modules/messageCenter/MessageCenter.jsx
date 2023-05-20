import React, { useContext, useState, useEffect } from "react";
import { FETCH_ME } from "../../graphql/queries";
import { DELETE_VIDEO_MUTATION } from "../../graphql/mutations";
import { Box, Loading } from "../../components";
import { useHistory } from "react-router-dom";
import MessageContainer from "./MessageContainer.jsx";
import { useClient } from "../../client";
import Context from "../../context";
import { getToken } from "../../utils/helpers";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const MessageCenter = () => {
  let history = useHistory();
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const currentUser = state.currentUser;
  const mobile = useMediaQuery("(max-width: 650px)");
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
      await handleDeleteVideos(fetchMe._id);
      await setReceivedVideos(fetchMe.receivedVideos);

      await dispatch({ type: "LOGIN_USER", payload: fetchMe });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleDeleteVideos = async (_id) => {
    try {
      const variables = {
        _id,
      };
      const { deleteVideo } = await client.request(
        DELETE_VIDEO_MUTATION,
        variables
      );
      const sentVideos = await deleteVideo.filter(
        (video) => video.sender._id === currentUser._id
      );
      const receivedVideos = await deleteVideo.filter(
        (video) => video.receiver._id === currentUser._id
      );

      await dispatch({
        type: "UPDATE_VIDEOS",
        payload: { sentVideos, receivedVideos },
      });
    } catch (err) {
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
        <Box height={mobile ? "60vH" : "100vH"} alignItems="center">
          <Loading grid size={mobile ? 50 : 100} />
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
