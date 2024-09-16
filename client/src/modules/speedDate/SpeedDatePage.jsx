import React, { useContext, useEffect, useState } from "react";
import { Subscription } from "react-apollo";
import { Box, Text, Picture, Loading, Button } from "../../components";
import {
  ADD_TO_QUEUE_MUTATION,
  MATCH_USER_MUTATION,
  REMOVE_FROM_QUEUE,
} from "../../graphql/mutations";
import { COLORS } from "../../constants";
import { USER_MATCHED_SUBSCRIPTION } from "../../graphql/subscriptions";
import Context from "../../context";
import { useClient } from "../../client";
import SpeedModal from "./modal";
import VideoChatScreen from "./VideoChatScreen";
import { useHistory } from "react-router-dom";

export const SpeedDatePage = ({}) => {
  const { state, dispatch } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState({});
  const [showScreen, setShowScreen] = useState(false);
  const [userWantsInQueue, setUserWantsInQueue] = useState(true);
  const [hasAddedToQueue, setHasAddedToQueue] = useState(false); // Track if user has been added to queue
  const history = useHistory();

  const client = useClient();
  const currentUser = state.currentUser;
  const outOfTime = currentUser?.plan
    ? currentUser.plan.videoMinutes + currentUser.plan.additionalMinutes <=
      currentUser.plan.videoMinutesUsed
    : false;

  //optionally add out of time if trying to enter the queue

  useEffect(() => {
    try {
      window.ReactNativeWebView.postMessage("SPEED_DATE");
    } catch (err) {
      console.log("error sending Speed Date Warning: ", err);
    }
  }, []);

  useEffect(() => {
    if (currentUser.username && !hasAddedToQueue && userWantsInQueue) {
      // Add the user to the queue once when currentUser is available
      handleAddUserToQueue();
      setHasAddedToQueue(true); // Ensure this is only run once
    }
  }, [currentUser, hasAddedToQueue]);

  useEffect(() => {
    if (matchedUser && matchedUser.status === "Cancel" && userWantsInQueue) {
      setTimeout(() => {
        handleAddUserToQueue();
      }, 2000);
    }
    if (matchedUser && matchedUser.status === "Connected") {
      setShowScreen(true);
    }
    if (matchedUser && matchedUser.status === "Waiting") {
      setTimeout(() => {
        handleMatchUser();
      }, 2000);
    }
  }, [matchedUser.status]);

  useEffect(() => {
    // Detect route changes
    const handleRouteChange = (location, action) => {
      if (action === "PUSH" || action === "POP") {
        handleRemoveFromQueue();
      }
    };

    const unlisten = history.listen(handleRouteChange);
    // Detect tab close/refresh
    const handleBeforeUnload = (e) => {
      handleRemoveFromQueue();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      unlisten(); // Clean up the route listener
      window.removeEventListener("beforeunload", handleBeforeUnload); // Clean up the tab close listener
    };
  }, [currentUser, history]);

  const handleRemoveFromQueue = async () => {
    try {
      const variables = {
        userId: currentUser._id,
      };

      const { removeFromQueue } = await client.request(
        REMOVE_FROM_QUEUE,
        variables
      );

      setUserWantsInQueue(false);
      setShowModal(false);
    } catch (err) {
      console.log("err removing from queue: ", err);
    }
  };

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
      } else {
        alert("Fill out what you are looking for to use this feature");
        setUserWantsInQueue(false);
      }
    } catch (err) {
      console.log("Error adding to queue: ", err);
    }
  };

  const returnUserToQueue = () => {
    try {
      //   if (outOfTime) {
      //     window.ReactNativeWebView.postMessage("BUY_MINUTES");
      //   }
      setUserWantsInQueue(true);
      handleAddUserToQueue();
    } catch (err) {
      console.log("error returning user to queue: ", err);
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

  return currentUser.username ? (
    <Box
      width="100%"
      display="flex"
      height="95vh"
      alignItems="center"
      justifyContent="center"
    >
      {userWantsInQueue ? (
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
      ) : (
        <Box column alignItems="center">
          <Button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `0px 2px 10px ${COLORS.pink}`,
              borderRadius: "20px",
              border: `solid 1px ${COLORS.pink}`,
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
            color={COLORS.black}
            width="fit-content"
            onClick={returnUserToQueue}
          >
            <Text bold style={{ textAlign: "center" }}>
              <span style={{ fontSize: 30 }}>🤾‍♂️</span> Jump Back In!
            </Text>
          </Button>
          <Text bold>You are OUT of the queue...</Text>
        </Box>
      )}
      <Subscription
        subscription={USER_MATCHED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { userMatched } = subscriptionData.data;

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
          handleMatchUser={handleMatchUser}
          setUserWantsInQueue={setUserWantsInQueue}
        />
      )}
      <VideoChatScreen
        showScreen={showScreen}
        handleShutScreen={handleShutScreen}
        status={matchedUser.status}
        userId={currentUser._id}
        pairedUser={matchedUser.pairedUser}
        setUserWantsInQueue={setUserWantsInQueue}
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
