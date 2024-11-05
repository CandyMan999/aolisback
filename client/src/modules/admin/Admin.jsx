import React, { useState, useEffect } from "react";
import { Text, Button, Box, Loading } from "../../components";
import {
  GET_FLAGGED_PICTURES,
  GET_FLAGGED_VIDEOS,
  GET_REAL_USERS,
} from "../../graphql/queries";
import {
  UNFLAG_PICTURE,
  UNFLAG_VIDEO,
  BAN_USER,
  DELETE_USER_MUTATION,
  DELETE_SEEDERS_MUTATION,
} from "../../graphql/mutations";
import { useClient } from "../../client";
import { COLORS } from "../../constants";

const AdminPage = () => {
  const client = useClient();
  const [users, setUsers] = useState([]);
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

      const { getRealUsers } = await client.request(GET_REAL_USERS);
      setUsers(getRealUsers);

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

  const handleDeleteUser = async (userId) => {
    try {
      setSpinner(true);

      const varibables = {
        _id: userId,
      };
      const { deleteUser } = await client.request(
        DELETE_USER_MUTATION,
        varibables
      );

      console.log("data: ", deleteUser);
      if (deleteUser.status) {
        console.log("succeess deleting");
        setUsers(users.filter((user) => user._id !== userId)); // Remove user from state
        setSpinner(false);
      }
    } catch (err) {
      setSpinner(false);
      console.log("Error deleting user: ", err);
    }
  };

  const handleDeleteSeeders = async () => {
    try {
      setSpinner(true);

      const { deleteSeeders } = await client.request(DELETE_SEEDERS_MUTATION);

      console.log("data: ", deleteSeeders);
      if (deleteSeeders.status) {
        console.log("succeess deleting seeders");

        setSpinner(false);
      }
    } catch (err) {
      setSpinner(false);
      console.log("Error deleting user: ", err);
    }
  };

  if (loading) {
    return <Text center>Loading...</Text>;
  }
  console.log("users:", users);
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
        {users.length > 0 &&
          users.map((user) => (
            <Box
              key={user._id}
              column
              alignItems="center"
              textAlign="center"
              background={COLORS.lightPurple}
            >
              {user.pictures.length > 0 && (
                <img
                  src={user.pictures[0].url} // Display the first picture
                  alt={user.username}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              )}
              <Text>{user.username}</Text>
              <Text>{user.phoneNumber ? user.phoneNumber : "NO #"}</Text>
              <Text>
                {user.googleId
                  ? "Account with Google"
                  : user.appleId
                  ? "Account with Apple"
                  : user.email}
              </Text>

              <Text>Banned: {user.isBanned ? "Yes" : "No"}</Text>
              {user.lookingFor && (
                <Box width="80%" column>
                  <Text>
                    Looking For: age: {user.lookingFor.ageRange.lowEnd}-
                    {user.lookingFor.ageRange.highEnd}
                  </Text>
                  <Text>sex: {user.lookingFor.sex}</Text>
                </Box>
              )}
              {spinner ? (
                <Loading ring />
              ) : (
                <Button onClick={() => handleDeleteUser(user._id)} width="80%">
                  Delete User
                </Button>
              )}
            </Box>
          ))}
      </div>
      <Box wodth="100%" justifyContent="center">
        <Button width="50%" color={COLORS.pink} onClick={handleDeleteSeeders}>
          <Text bold>Delete Seeders</Text>
        </Button>
      </Box>
    </Box>
  );
};

export default AdminPage;
