import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Box, Text, FONT_SIZES, Loading } from "../../components";
import { COLORS } from "../../constants";
import { GET_USERS_WHO_LIKE_ME_QUERY } from "../../graphql/queries";
import { useClient } from "../../client";
import Context from "../../context";

const LikesMeCarousel = ({ viewLikes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const { currentUser } = state;

  const [likedUsers, setLikedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch liked users using GraphQL
  useEffect(() => {
    const fetchLikedUsers = async () => {
      try {
        setLoading(true);
        const variables = { userID: currentUser._id };

        const { getUsersWhoLikedMe } = await client.request(
          GET_USERS_WHO_LIKE_ME_QUERY,
          variables
        );
        // Filter users with pictures to avoid errors
        const usersWithPictures = getUsersWhoLikedMe.filter(
          (user) => user.pictures && user.pictures.length > 0
        );
        setLikedUsers(usersWithPictures);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching liked users:", err);
        setLoading(false);
      }
    };
    if (currentUser._id) {
      fetchLikedUsers();
    }
  }, [currentUser._id]);

  const handleOpenProfile = async (user) => {
    dispatch({ type: "UPDATE_PROFILE", payload: user });
    dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
  };

  const openGoPremium = async () => {
    try {
      window.ReactNativeWebView.postMessage("GO_PREMIUM");
    } catch (err) {
      console.log("error: ", err);
    }
  };

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <Box
        width="100%"
        height="150px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Loading size={50} bar />
      </Box>
    );
  }

  // Handle case where no users like the current user
  if (!likedUsers.length) {
    return null;
  }

  return (
    <Box width="100%" padding="0" column>
      {/* "New Likes" header with a bubble showing total count */}
      <Box display="flex" alignItems="center">
        <Text
          fontSize={FONT_SIZES.X_LARGE}
          bold
          color={COLORS.deepPurple}
          paddingLeft={5}
          marginY={7}
        >
          Who Likes Me?
        </Text>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          backgroundColor={COLORS.vividBlue}
          width="30px"
          height="30px"
          borderRadius="50%"
          marginLeft="10px"
        >
          <Text bold color={COLORS.white}>
            {likedUsers.length}
          </Text>
        </Box>
      </Box>

      {/* Scrollable horizontal container */}
      <Box
        display="flex"
        overflowX="auto"
        width="100%"
        height="150px"
        padding="0 10px" // Fix padding inside the scroll container
        style={{
          scrollbarWidth: "none", // Hide scrollbar on Firefox"
          "&::WebKitScrollbar": { display: "none" },
        }}
      >
        {likedUsers.map((user) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginRight: "10px", // Adjust spacing between images
              width: "100px",
              height: "120px",
              overflow: "hidden",
              flexShrink: 0, // Prevent shrinking to fit screen
            }}
            onClick={viewLikes ? () => handleOpenProfile(user) : openGoPremium}
          >
            <img
              src={user.pictures[0].url}
              alt={user.username}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "10px",
                objectFit: "cover",
                filter: viewLikes ? undefined : "blur(8px)",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/path/to/fallback-image.png"; // Replace with your fallback image
              }}
            />
            <Text
              fontSize={FONT_SIZES.SMALL}
              color={COLORS.black}
              marginTop="5px"
              center
              style={{
                filter: viewLikes ? undefined : "blur(8px)",
              }}
            >
              {user.username}
            </Text>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default LikesMeCarousel;
