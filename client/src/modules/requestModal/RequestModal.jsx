import React, { useEffect, Fragment } from "react";
import {
  Modal,
  Text,
  FONT_SIZES,
  Button,
  Box,
  Picture,
} from "../../components";
import { COLORS } from "../../constants";
import {
  UPDATE_VIDEO_CHAT_REQUEST,
  BLOCK_USER_MUTATION,
} from "../../graphql/mutations";
import { useClient } from "../../client";
import { useHistory } from "react-router-dom";
import notification from "../../sounds/notification.mp3";
import {
  isDesktop,
  isMacOs,
  isIOS,
  isAndroid,
  isWindows,
} from "react-device-detect";

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
  let history = useHistory();

  const faceTime = isMacOs || isIOS;

  useEffect(() => {
    handleStatus(status);
    if (currentUser._id !== sender._id && status === "Pending") {
      playSound();
    }
    // handleUpdateAppUsername(receiver.username, receiver.phoneNumber, faceTime);
  }, [status]);

  const playSound = () => {
    try {
      const audio = new Audio(notification);

      audio.play();
    } catch (err) {
      console.log("err plyaing sound:", err);
    }
  };

  const handleUpdateAppUsername = (username, phone, device) => {
    history.push({
      pathname: history.location.pathname,
      search: `?username=${username}&phone=${phone}&device=${
        device ? "iOS" : "Android"
      }`,
    });
  };

  const startWebRTC = () => {
    console.log("STARTING VIDEO CHAT....");
  };

  const handleStatus = (action) => {
    switch (action) {
      case "Accept":
        toggleChatRequest();
        startWebRTC();
        dispatch({ type: "JOIN_CHANNEL", payload: receiver.username });
        // history.push(
        //   `/video?username=${receiver.username}&phone=${
        //     receiver.phoneNumber
        //   }&device=${faceTime ? "iOS" : "Android"}`
        // );
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
      // Code to handle the default case if the action doesn't match any of the cases above
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
      };
      const { updateVideoChatRequest } = await client.request(
        UPDATE_VIDEO_CHAT_REQUEST,
        variables
      );

      toggleChatRequest();
    } catch (err) {}
  };

  return (
    <Modal onClose={() => {}} state={state}>
      {currentUser._id === sender._id ? (
        <Box display="flex" column center>
          {status === "Decline" || status === "Block" ? (
            <Text fontSize={FONT_SIZES.LARGE} width={"100%"} center bold>
              {receiver.username} has Declined your request
            </Text>
          ) : (
            <Fragment>
              <Text fontSize={FONT_SIZES.LARGE} width={"100%"} center bold>
                Please Wait while user decides...
              </Text>

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
        <Box display="flex" column center width="100%" height="90%">
          <Box
            width="110%"
            background={COLORS.lightGrey}
            style={{ alignItems: "center" }}
            height={110}
            marginBottom={50}
          >
            <Picture
              marginLeft={20}
              height={100}
              width={100}
              profilePic={sender.pictures[0]}
            />

            <Box display="flex" column width={"100%"}>
              <Text
                margin={0}
                fontSize={FONT_SIZES.X_LARGE}
                width={"100%"}
                center
                bold
              >
                Video Chat Request
              </Text>
              <Text center margin={0} bold fontSize={FONT_SIZES.LARGE}>
                From
              </Text>
              <Text center margin={0} bold fontSize={FONT_SIZES.X_LARGE}>
                {sender.username}
              </Text>
            </Box>
          </Box>

          <Button
            width={"100%"}
            color={COLORS.grey}
            style={{ boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)` }}
            onClick={() => handleViewProfile(sender)}
          >
            <Text color={COLORS.white} margin={0} bold>
              View Profile
            </Text>
          </Button>
          <Box width="100%" marginTop={10}>
            <Button
              width={"100%"}
              color={COLORS.green}
              style={{
                margin: 0,
                marginRight: 5,
                borderBottom: `solid 2px ${COLORS.grey}`,
                boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
              }}
              onClick={() => handleUpdate("Accept")}
            >
              <Text color={COLORS.blacK} margin={0} bold>
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
              }}
              onClick={() => handleUpdate("Decline")}
            >
              <Text color={COLORS.white} margin={0} bold>
                Decline
              </Text>
            </Button>
          </Box>

          <Button
            color={COLORS.grey}
            style={{
              position: "absolute",
              bottom: 0,
              boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
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
  );
};

export default RequestModal;
