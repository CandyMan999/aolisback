import React, { useEffect, Fragment, useState } from "react";
import {
  Modal,
  Text,
  FONT_SIZES,
  Button,
  Box,
  Picture,
  Loading,
  PhotoSlider,
  Icon,
  ICON_SIZES,
} from "../../components";
import { COLORS } from "../../constants";
import {
  BLOCK_USER_MUTATION,
  UPDATE_MATCH_STATUS_MUTATION,
  REMOVE_FROM_QUEUE,
} from "../../graphql/mutations";
import { useClient } from "../../client";
import { getDistanceFromCoords } from "../../utils/helpers";

import notification from "../../sounds/notification.mp3";

const SpeedModal = ({
  dispatch,
  pairedUser,
  state,
  currentUser,
  status,
  closeModal,
  handleAddUserToQueue,
}) => {
  const client = useClient();
  const [distance, setDistance] = useState("No Location");

  useEffect(() => {
    handleStatus(status);
    // if (status === "Deciding") {
    //   playSound();
    // }

    console.log("status: ", status);
  }, [status]);

  useEffect(() => {
    handleDistance(pairedUser);
  }, []);

  const playSound = () => {
    try {
      const audio = new Audio(notification);

      audio.play();
    } catch (err) {
      console.log("err plyaing sound:", err);
    }
  };

  const handleStatus = (action) => {
    switch (action) {
      case "Accept":
        break;
      case "Connected":
        closeModal();
        break;
      case "Cancel":
        setTimeout(() => {
          console.log("status is cancel: ", action);
          closeModal();
          handleAddUserToQueue();
        }, 2000);
        break;

      default:
      // Code to handle the default case if the action doesn't match any of the cases above
    }
  };

  const handleBlockUser = async () => {
    try {
      const variables = {
        userID: currentUser._id,
        blockID: pairedUser._id,
      };

      const { block } = await client.request(BLOCK_USER_MUTATION, variables);
      dispatch({ type: "UPDATE_BLOCKED", payload: block.blockedUsers });
      handleUpdate("Cancel");
    } catch (err) {
      console.log(err);
    }
  };

  const noLocation = (array) => {
    if (
      Array.isArray(array) &&
      array.length === 2 &&
      array[0] === 0 &&
      array[1] === 0
    ) {
      return true;
    }
    return false;
  };

  const handleDistance = async (user) => {
    if (
      !noLocation(state.currentUser.location.coordinates) &&
      !noLocation(user.location.coordinates)
    ) {
      const {
        location: { coordinates },
      } = state.currentUser;
      const miles = await getDistanceFromCoords(
        coordinates[1],
        coordinates[0],
        user.location.coordinates[1],
        user.location.coordinates[0]
      );

      setDistance(`${miles} miles away`);
    } else {
      setDistance("No Location");
    }
  };

  const handleUpdate = async (payload) => {
    try {
      const variables = {
        userId: currentUser._id,
        status: payload,
      };
      const { updateMatchStatus } = await client.request(
        UPDATE_MATCH_STATUS_MUTATION,
        variables
      );
      console.log("match status: ", updateMatchStatus);
    } catch (err) {
      console.log("err updating match status: ", err);
    }
  };

  const handleRemoveFromQueue = async () => {
    try {
      const variables = {
        userId: currentUser._id,
      };
      const { removeFromQueue } = await client.request(
        REMOVE_FROM_QUEUE,
        variables
      );

      console.log("did we reove the user? ", removeFromQueue);
      closeModal();
    } catch (err) {
      console.log("err removing from queue: ", err);
    }
  };

  return (
    <Fragment>
      {status === "Deciding" && (
        <Box
          display="flex"
          column
          width={"100%"}
          position="absolute"
          top={30}
          left={0}
          justifyContent="center"
          style={{
            borderRadius: 10,
            zIndex: 5000,
          }}
        >
          <Text
            margin={0}
            fontSize={FONT_SIZES.LARGE}
            width={"100%"}
            bold
            center
            color={COLORS.white}
          >
            Video Chat Request
          </Text>
          <Text
            center
            margin={0}
            bold
            fontSize={FONT_SIZES.MEDIUM}
            color={COLORS.white}
          >
            From
          </Text>
          <Text
            center
            margin={0}
            bold
            fontSize={FONT_SIZES.LARGE}
            color={COLORS.white}
          >
            {pairedUser.username}
          </Text>
        </Box>
      )}
      <Modal
        onClose={handleRemoveFromQueue}
        state={state}
        height={500}
        noPadding={true}
        overflow={"hidden"}
      >
        {status === "Accept" || status === "Cancel" ? (
          <Box
            display="flex"
            column
            center
            style={{ justifyContent: "space-between", height: "100%" }}
          >
            {status === "Cancel" || status === "Block" ? (
              <Box
                width="100%"
                height="100%"
                column
                justifyContent="space-around"
              >
                <Text fontSize={FONT_SIZES.LARGE} width={"100%"} center bold>
                  You or {pairedUser.username} has Declined this request
                </Text>
                <Text center fontSize={FONT_SIZES.XXX_LARGE}>
                  👋
                </Text>
              </Box>
            ) : (
              <Fragment>
                <Text fontSize={FONT_SIZES.LARGE} width={"100%"} center bold>
                  Please Wait while {pairedUser.username} decides...
                </Text>
                <Loading logo />
                <Button
                  coolStyle
                  width={"100%"}
                  color={COLORS.red}
                  onClick={() => handleUpdate("Cancel")}
                >
                  Cancel
                </Button>
              </Fragment>
            )}
          </Box>
        ) : (
          <Box display="flex" column center width="100%" height="120%">
            <Box
              width="110%"
              style={{ alignItems: "center", overflow: "hidden" }}
              height={350}
              marginBottom={50}
            >
              <PhotoSlider
                withDelete={false}
                images={pairedUser.pictures}
                height={310}
                width={200}
              />
            </Box>
            <Box
              width="100%"
              marginTop={10}
              position="absolute"
              top={325}
              style={{ zIndex: 5 }}
            >
              <Button
                width={"100%"}
                color={COLORS.green}
                style={{
                  margin: 0,
                  marginRight: 5,
                  borderBottom: `solid 2px ${COLORS.grey}`,
                  boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
                  borderRadius: 20,
                }}
                onClick={() => handleUpdate("Accept")}
              >
                <Text color={COLORS.black} margin={0} bold>
                  Accept
                </Text>
              </Button>
              <Button
                width={"100%"}
                color={COLORS.red}
                style={{
                  margin: 0,
                  borderBottom: `solid 2px ${COLORS.grey}`,
                  boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
                  borderRadius: 20,
                }}
                onClick={() => handleUpdate("Cancel")}
              >
                <Text color={COLORS.white} margin={0} bold>
                  Next User
                </Text>
              </Button>
            </Box>

            <Box
              width="105%"
              //   background={`${COLORS.lightPurple}66`}
              bottom={0}
              justifyContent="center"
              height={40}
              alignItems="center"
            >
              <Icon
                name="distance"
                color={COLORS.pink}
                size={ICON_SIZES.LARGE}
              />
              <Text margin={0} paddingRight={4}>
                {distance}
              </Text>
            </Box>

            <Button
              color={COLORS.grey}
              style={{
                position: "absolute",
                bottom: 0,
                boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
                borderRadius: 10,
              }}
              width={"100%"}
              onClick={handleBlockUser}
            >
              <Text color={COLORS.white} margin={0} bold>
                Block
              </Text>
            </Button>
          </Box>
        )}
      </Modal>
    </Fragment>
  );
};

export default SpeedModal;
