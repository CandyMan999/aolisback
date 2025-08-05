// MatchScreen.js

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import { COLORS } from "../../constants";
import { MdVideoChat } from "react-icons/md";
import { Text, Button } from "../../components";
import { VIDEO_CHAT_REQUEST } from "../../graphql/subscriptions";

// Styled Components
const Overlay = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  background: #fff;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: ${(props) => (props.showScreen === true ? "70vh" : "0vh")};
  border-top-left-radius: 20px; /* Rounded top-left corner */
  border-top-right-radius: 20px; /* Rounded top-right corner */
  overflow: hidden; /* Prevent overflow during animation */
`;

const CardsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 250px;
  margin-top: -50px;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: ${(props) =>
    props.custom === "left" ? "rotate(-18deg)" : "rotate(18deg)"};
  margin: 0 10px;
`;

const UserCard = styled(motion.div)`
  width: 170px;
  height: 220px;
  background-image: url("${(props) => props.image}");
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Username = styled.h2`
  font-size: 20px;
  color: #333;
  margin-top: 10px;
  transform: ${(props) =>
    props.custom === "left" ? "rotate(15deg)" : "rotate(-15deg)"};
`;

const MatchTextContainer = styled(motion.div)`
  width: 300px;
  height: 100px;
  margin-bottom: 20px;
`;

const CloseIcon = styled(AiOutlineClose)`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 30px;
  color: #333;
  cursor: pointer;
`;

// Animation Variants
const overlayVariants = {
  hidden: { height: "0vh", opacity: 0 },
  visible: (custom) => ({
    height: getHeight(custom.mobile, custom.showScreen),
    opacity: 1,
    transition: { duration: 0.2 },
  }),
};

const getHeight = (mobile, showScreen) => {
  if (mobile && showScreen) return "70vh";
  if (showScreen) return "100vh";
  return "0vh";
};

const cardVariants = {
  initial: (custom) => ({
    x: custom === "left" ? "-100vw" : "100vw",
    rotate: 0,
  }),
  animate: {
    x: 0,
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.5, duration: 0.5 },
  },
};
const HeartIcon = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 2rem; /* Default font size */
`;

const moveX = () => Math.random() * window.innerWidth;
const moveY = () => Math.random() * window.innerHeight;
const randomScale = () => Math.random() * 1.5 + 0.5; // Random scale between 0.5 and 2
const randomEmoji = () => {
  const EMOJIS = [
    "❤️",
    "💛",
    "💚",
    "💙",
    "💜",
    "🧡",
    "💖",
    "💗",
    "💓",
    "💞",
    "💘",
    "💕",
    "❤️‍🔥",
    "🫶",
    "💋",
  ];
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
};

const MatchScreen = ({
  matchedUser,
  currentUser,
  onClose,
  showScreen,
  dispatch,
  mobile,
  location,
  history,
  state,
  client,
}) => {
  // Ensure image URLs are correct
  const currentUserImage = currentUser.pictures[0]?.url;
  const matchedUserImage = matchedUser?.pictures[0]?.url;
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    setShowHearts(true);
  }, []);

  const handleImBlocked = () => {
    try {
      let blocked = false;

      matchedUser?.blockedUsers.find((user) => {
        if (user._id === currentUser._id) {
          blocked = true;
        }
      });
      return blocked;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendVideoMessage = () => {
    try {
      if (
        currentUser.plan.messages + currentUser.plan.additionalMessages <=
        currentUser.plan.messagesSent
      ) {
        window.ReactNativeWebView.postMessage("BUY_MESSAGES");

        return;
      }
      dispatch({ type: "TOGGLE_PROFILE", payload: false });

      if (mobile) {
        const receiverID = matchedUser._id;
        const senderID = currentUser._id;
        const params = new URLSearchParams(location.search);
        params.set("senderID", senderID);
        params.set("receiverID", receiverID);
        params.set("videoMessage", true);

        const data = {
          senderID,
          receiverID,
          videoMessage: true,
        };

        // Navigate to the constructed URL
        history.replace({
          pathname: location.pathname,
          search: params.toString(),
        });
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        } else {
          console.warn("ReactNativeWebView is not available.");
        }
      } else {
        dispatch({ type: "TOGGLE_VIDEO", payload: !state.showVideo });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleVideoChatRequest = async () => {
    try {
      if (
        currentUser.plan.videoMinutes + currentUser.plan.additionalMinutes <=
        currentUser.plan.videoMinutesUsed
      ) {
        window.ReactNativeWebView.postMessage("BUY_MINUTES");

        return;
      }

      const variables = {
        senderID: state.currentUser._id,
        receiverID: matchedUser._id,
        status: "Pending",
      };

      const { videoChatRequest } = await client.request(
        VIDEO_CHAT_REQUEST,
        variables
      );

      dispatch({ type: "TOGGLE_PROFILE", payload: false });
      dispatch({ type: "TOGGLE_CHAT", payload: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AnimatePresence>
      {matchedUser && showScreen && (
        <Overlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          custom={{ mobile, showScreen }}
        >
          <CloseIcon onClick={onClose} />
          <MatchTextContainer
            variants={textVariants}
            initial="hidden"
            animate="visible"
            style={{ position: "absolute", top: 0 }}
          >
            <svg
              width="100%"
              height="auto"
              viewBox="0 0 300 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <path
                  id="curve"
                  d="M50,100 Q150,0 250,100"
                  fill="transparent"
                />
              </defs>
              <text
                width="300"
                style={{
                  fontFamily: "Cursive",
                  fontSize: "40px",
                  fill: COLORS.pink,
                  fontWeight: "bolder",
                }}
              >
                <textPath
                  xlinkHref="#curve"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {" "}
                  It's a Match!{" "}
                </textPath>
              </text>
            </svg>
          </MatchTextContainer>
          <CardsContainer style={{ marginTop: mobile ? "40%" : "10%" }}>
            <CardWrapper custom="left">
              <UserCard
                custom="left"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                image={currentUserImage}
                style={{ zIndex: 2 }}
              />
              <Username custom="left">{currentUser.username}</Username>
            </CardWrapper>
            {/* <Box
              style={{
                position: "fixed",
                top: 0,
                zIndex: -10,
              }}
            >
              <Text style={{ fontSize: "300px" }}>💘</Text>
            </Box> */}
            <CardWrapper custom="right">
              <UserCard
                custom="right"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                image={matchedUserImage}
                style={{ zIndex: 1 }}
              />
              <Username custom="right">{matchedUser.username}</Username>
            </CardWrapper>
          </CardsContainer>
          <Button
            width={"60px"}
            height={"60px"}
            color={handleImBlocked() ? COLORS.lightGrey : COLORS.white}
            style={{
              borderRadius: "50px",
              boxShadow: `2px 2px 4px 2px ${COLORS.grey}`,
            }}
            disabled={handleImBlocked()}
            onClick={
              handleImBlocked()
                ? null
                : !matchedUser?.isLoggedIn || matchedUser?.inCall
                ? handleSendVideoMessage
                : handleVideoChatRequest
            }
          >
            <MdVideoChat size={45} color={COLORS.vividBlue} />
          </Button>
          <Text>Send A Message</Text>
          {showHearts &&
            Array.from({ length: 20 }, (_, index) => (
              <HeartIcon
                key={index}
                initial={{ x: moveX(), opacity: 1, visibility: "visible" }}
                animate={{
                  x: [moveX(), moveX(), moveX(), moveX(), moveX()],
                  y: [moveY(), -600],
                  scale: [randomScale(), randomScale()],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                style={{ fontSize: `${randomScale()}rem` }}
              >
                {randomEmoji()}
              </HeartIcon>
            ))}
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default MatchScreen;
