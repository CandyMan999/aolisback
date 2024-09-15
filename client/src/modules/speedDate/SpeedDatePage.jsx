import React, { useContext, useEffect, useState } from "react";
import { Subscription } from "react-apollo";
import { Box, Text, Picture, Loading } from "../../components";
import {
  ADD_TO_QUEUE_MUTATION,
  MATCH_USER_MUTATION,
} from "../../graphql/mutations";
import { USER_MATCHED_SUBSCRIPTION } from "../../graphql/subscriptions";
import Context from "../../context";
import { useClient } from "../../client";
import SpeedModal from "./modal";
import VideoChatScreen from "./VideoChatScreen";

export const SpeedDatePage = ({}) => {
  const { state, dispatch } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState({});
  const [showScreen, setShowScreen] = useState(false);

  const client = useClient();
  const currentUser = state.currentUser;
  const outOfTime = currentUser?.plan
    ? currentUser.plan.videoMinutes + currentUser.plan.additionalMinutes <=
      currentUser.plan.videoMinutesUsed
    : false;

  useEffect(() => {
    //add the outOfTime when bringing back the payments don't forget to uncommetnin the video chat screeen as well

    if (
      currentUser.username &&
      matchedUser.status !== "Connected" &&
      matchedUser.status !== "Deciding"
    ) {
      handleAddUserToQueue();
      setTimeout(() => {
        handleMatchUser();
      }, 3000);
    }
  }, [currentUser]);

  useEffect(() => {
    if (matchedUser && matchedUser.status === "Cancel") {
      setTimeout(() => {
        handleAddUserToQueue();
        handleMatchUser();
      }, 3000);
    }
    if (matchedUser && matchedUser.status === "Connected") {
      setShowScreen(true);
    }
  }, [matchedUser.status]);

  const handleAddUserToQueue = async () => {
    try {
      if (currentUser.sex && currentUser.lookingFor.sex) {
        const variables = {
          userId: currentUser._id,
          sex: currentUser.sex,
          lookingFor: currentUser.lookingFor.sex,
        };

        // Add user to the queue

        const { addToQueue } = await client.request(
          ADD_TO_QUEUE_MUTATION,
          variables
        );
        console.log("Added to queue: ", addToQueue);

        // Wait 3 seconds to trigger matching
      } else {
        alert("Fill out what you are looking for to use this feature");
      }
    } catch (err) {
      console.log("Error adding to queue: ", err);
    }
  };

  const handleMatchUser = async () => {
    try {
      // Request to match a user
      const variables = { userId: currentUser._id };
      const { matchUser } = await client.request(
        MATCH_USER_MUTATION,
        variables
      );

      if (matchUser) {
        console.log("Matched with user: ", matchUser);
        // You can now display the matched user's info
      } else {
        console.log("No match found yet.");
      }
    } catch (err) {
      console.log("Error matching user: ", err);
    }
  };

  const handleShutScreen = () => {
    setShowScreen(false);
  };

  console.log("what is my status: ", matchedUser.status);

  return currentUser.username ? (
    <Box
      width="100%"
      display="flex"
      height="95vh"
      alignItems="center"
      justifyContent="center"
    >
      <Box column alignItems="center">
        <Picture
          profilePic={
            currentUser && currentUser.pictures.length
              ? currentUser.pictures[0]
              : undefined
          }
          searching={true}
          height={120}
          width={120}
        />
        <Text bold>Searching For Users...</Text>
      </Box>
      <Subscription
        subscription={USER_MATCHED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { userMatched } = subscriptionData.data;

          console.log("we got a match: ", userMatched);
          if (userMatched.userId === currentUser._id) {
            setMatchedUser(userMatched);
            if (userMatched.status === "Deciding") {
              setShowModal(true);
            }
          }
        }}
      />
      {showModal && (
        <SpeedModal
          pairedUser={matchedUser.pairedUser}
          closeModal={() => setShowModal(false)}
          state={state}
          dispatch={dispatch}
          currentUser={currentUser}
          status={matchedUser.status}
          handleAddUserToQueue={handleAddUserToQueue}
        />
      )}
      <VideoChatScreen
        showScreen={showScreen}
        handleShutScreen={handleShutScreen}
        status={matchedUser.status}
        userId={currentUser._id}
        pairedUser={matchedUser.pairedUser}
      />
    </Box>
  ) : (
    <Box
      width="100%"
      display="flex"
      height="80vh"
      alignItems="center"
      justifyContent="center"
    >
      <Loading ring size={200} />
    </Box>
  );
};

export default SpeedDatePage;
