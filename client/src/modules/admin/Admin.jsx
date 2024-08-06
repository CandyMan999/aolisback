import React, { useState, useEffect } from "react";
import { Text, Button, Box, Loading } from "../../components";
import {
  GET_FLAGGED_PICTURES,
  GET_FLAGGED_VIDEOS,
} from "../../graphql/queries";
import {
  UNFLAG_PICTURE,
  UNFLAG_VIDEO,
  BAN_USER,
} from "../../graphql/mutations";
import { useClient } from "../../client";

const AdminPage = () => {
  const client = useClient();

  const [videos, setVideos] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleFetchData = async () => {
    setLoading(true);
    try {
      const { getFlaggedVideos } = await client.request(GET_FLAGGED_VIDEOS);
      setVideos(getFlaggedVideos);

      const { getFlaggedPictures } = await client.request(GET_FLAGGED_PICTURES);
      setPictures(getFlaggedPictures);
    } catch (err) {
      console.log("Error fetching flagged content: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnflagVideo = async (videoId) => {
    try {
      setSpinner(true);
      await client.request(UNFLAG_VIDEO, { videoId });
      setVideos(videos.filter((video) => video._id !== videoId));
      setSpinner(false);
    } catch (err) {
      setSpinner(false);
      console.log("Error unflagging video: ", err);
    }
  };

  const handleUnflagPicture = async (pictureId) => {
    try {
      setSpinner(true);
      await client.request(UNFLAG_PICTURE, { pictureId });
      setPictures(pictures.filter((picture) => picture._id !== pictureId));
      setSpinner(false);
    } catch (err) {
      setSpinner(false);
      console.log("Error unflagging picture: ", err);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      setSpinner(true);
      await client.request(BAN_USER, { userId });
      setVideos(videos.filter((video) => video.sender._id !== userId));
      setPictures(pictures.filter((picture) => picture.user._id !== userId));
      setSpinner(false);
    } catch (err) {
      console.log("Error banning user: ", err);
    }
  };

  if (loading) {
    return <Text center>Loading...</Text>;
  }

  return (
    <Box
      width="100%"
      column
      justifyContent="center"
      style={{ overflowY: "scroll" }}
    >
      <Text center>Admin Home</Text>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          padding: "16px",
        }}
      >
        {videos.length > 0 &&
          videos.map((video) => (
            <Box key={video._id} column justifyContent="center">
              <video
                src={video.url}
                controls
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <Text center>{`From: ${video.sender.username}`}</Text>
              <Text center> {` To: ${video.receiver.username}`}</Text>

              {spinner ? (
                <Loading ring />
              ) : (
                <Box column alignItems="center" width="100%">
                  <Button
                    onClick={() => handleUnflagVideo(video._id)}
                    width="80%"
                  >
                    Unflag
                  </Button>
                  <Button
                    onClick={() => handleBanUser(video.sender._id)}
                    width="80%"
                  >
                    Ban User
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        {pictures.length > 0 &&
          pictures.map((pic) => (
            <Box key={pic._id} column textAlign="center">
              <img
                src={pic.url}
                alt="Flagged"
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <Text>{`User: ${pic.user.username}`}</Text>
              {spinner ? (
                <Loading ring />
              ) : (
                <Box column alignItems="center" width="100%">
                  <Button
                    onClick={() => handleUnflagPicture(pic._id)}
                    width="80%"
                  >
                    Unflag
                  </Button>
                  <Button
                    onClick={() => handleBanUser(pic.user._id)}
                    width="80%"
                  >
                    Ban User
                  </Button>
                </Box>
              )}
            </Box>
          ))}
      </div>
    </Box>
  );
};

export default AdminPage;
