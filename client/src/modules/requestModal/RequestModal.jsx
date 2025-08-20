import React, { useEffect, Fragment, useState } from "react";
import {
  Modal,
  Text,
  FONT_SIZES,
  Button,
  Box,
  Loading,
  PhotoSlider,
  Icon,
  ICON_SIZES,
} from "../../components";
import { COLORS } from "../../constants";
import {
  UPDATE_VIDEO_CHAT_REQUEST,
  BLOCK_USER_MUTATION,
} from "../../graphql/mutations";
import { useClient } from "../../client";
import { getDistanceFromCoords } from "../../utils/helpers";
import { RiUserHeartFill } from "react-icons/ri";

import notification from "../../sounds/notification.mp3";

const RequestModal = ({
  dispatch,
  sender,
  receiver,
  chatID,
  state,
  currentUser,
  status,
}) => {
  const client = useClient();
  const [distance, setDistance] = useState("No Location");

  useEffect(() => {
    handleStatus(status);
    if (currentUser._id !== sender._id && status === "Pending") {
      playSound();
    }
  }, [status]);

  useEffect(() => {
    handleDistance(sender);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sender?._id]);

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
        toggleChatRequest();
        break;
      case "Decline":
        setTimeout(() => {
          dispatch({ type: "TOGGLE_CHAT", payload: false });
        }, 2000);
        break;
      case "Cancel":
        dispatch({ type: "TOGGLE_CHAT", payload: false });
        break;
      case "Block":
        setTimeout(() => {
          dispatch({ type: "TOGGLE_CHAT", payload: false });
        }, 2000);
        handleBlockUser();
        break;
      default:
      // no-op
    }
  };

  const handleBlockUser = async () => {
    try {
      const variables = {
        userID: currentUser._id,
        blockID: sender._id,
      };

      const { block } = await client.request(BLOCK_USER_MUTATION, variables);
      dispatch({ type: "UPDATE_BLOCKED", payload: block.blockedUsers });
    } catch (err) {
      console.log(err);
    }
  };

  const toggleChatRequest = () => {
    dispatch({ type: "TOGGLE_CHAT", payload: !state.showChatRequest });
  };

  const handleViewProfile = async (user) => {
    console.log("FIREING!!!: ", user);
    await dispatch({ type: "UPDATE_PROFILE", payload: user });
    dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
  };

  const handleUpdate = async (payload) => {
    try {
      const variables = {
        _id: chatID,
        senderID: sender._id,
        receiverID: receiver._id,
        status: payload,
        participantLeft: false,
      };
      await client.request(UPDATE_VIDEO_CHAT_REQUEST, variables);
      toggleChatRequest();
    } catch (err) {}
  };

  const noLocation = (array) => {
    return (
      Array.isArray(array) &&
      array.length === 2 &&
      array[0] === 0 &&
      array[1] === 0
    );
  };

  const handleDistance = async (user) => {
    console.log("USER: ", user);
    try {
      if (
        user?.location?.coordinates &&
        state?.currentUser?.location?.coordinates &&
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
    } catch (err) {
      setDistance("No Location");
    }
  };

  return (
    <Fragment>
      {/* Overlay header like SpeedModal (when receiver is deciding) */}
      {currentUser._id !== sender._id && status === "Pending" && (
        <Box
          display="flex"
          column
          width={"100%"}
          position="absolute"
          bottom={30}
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
            color={COLORS.black}
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
            {sender.username}
          </Text>
        </Box>
      )}

      <Modal
        onClose={() => {}}
        state={state}
        height={500}
        noPadding={true}
        overflow={"hidden"}
      >
        {currentUser._id === sender._id ? (
          // SENDER VIEW (waiting / declined) — styled like SpeedModal
          <Box
            display="flex"
            column
            center
            style={{ justifyContent: "space-between", height: "100%" }}
          >
            {status === "Decline" || status === "Block" ? (
              <Box
                width="100%"
                height="100%"
                column
                justifyContent="space-around"
              >
                <Text fontSize={FONT_SIZES.LARGE} width={"100%"} center bold>
                  {receiver.username} has Declined your request
                </Text>
                <Text center fontSize={FONT_SIZES.XXX_LARGE}>
                  👋
                </Text>
              </Box>
            ) : (
              <Fragment>
                <Text fontSize={FONT_SIZES.LARGE} width={"100%"} center bold>
                  Please Wait while {receiver.username} decides...
                </Text>
                <Loading logo />
                <Button
                  coolStyle={false}
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
          // RECEIVER VIEW (deciding) — identical to SpeedModal
          <Box display="flex" column center width="100%" height="120%">
            <Box
              width="110%"
              style={{
                alignItems: "center",
                overflow: "hidden",
                position: "relative",
              }}
              height={350}
              marginBottom={50}
            >
              {/* Top-right heart icon to open profile */}
              <Box
                position="absolute"
                style={{ top: 10, right: 12, zIndex: 1000, cursor: "pointer" }}
                onClick={() => handleViewProfile(sender)}
              >
                <RiUserHeartFill size={38} color={COLORS.pink} />
              </Box>

              <PhotoSlider
                withDelete={false}
                images={sender.pictures}
                height={310}
                width={200}
              />
            </Box>

            {/* Accept / Next buttons stack */}
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
                onClick={() => handleUpdate("Decline")}
              >
                <Text color={COLORS.white} margin={0} bold>
                  Decline
                </Text>
              </Button>
            </Box>

            {/* Distance row */}
            <Box
              width="105%"
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

            {/* Bottom Block button (kept same behavior: sends status "Block") */}
            <Button
              color={COLORS.grey}
              style={{
                position: "absolute",
                bottom: 0,
                boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
                borderRadius: 10,
              }}
              width={"100%"}
              onClick={() => handleUpdate("Block")}
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

export default RequestModal;
