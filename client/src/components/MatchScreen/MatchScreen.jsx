// MatchScreen.js

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import { COLORS } from "../../constants";
import { MdVideoChat } from "react-icons/md";
import { Text, Button } from "../../components";
import { VIDEO_CHAT_REQUEST } from "../../graphql/mutations";

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
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
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
  font-size: 2rem;
`;

const moveX = () => Math.random() * window.innerWidth;
const moveY = () => Math.random() * window.innerHeight;
const randomScale = () => Math.random() * 1.5 + 0.5;
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
  const currentUserImage = currentUser.pictures[0]?.url;
  const matchedUserImage = matchedUser?.pictures[0]?.url;
  const [showHearts, setShowHearts] = useState(false);

  // NEW: busy state to prevent double taps + show progress copy
  const [busy, setBusy] = useState(false);
  const isOtherOnline = !!(matchedUser?.isLoggedIn && !matchedUser?.inCall);

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
      return false;
    }
  };

  const handleSendVideoMessage = async () => {
    try {
      if (
        currentUser.plan.messages + currentUser.plan.additionalMessages <=
        currentUser.plan.messagesSent
      ) {
        window.ReactNativeWebView?.postMessage("BUY_MESSAGES"); // or SHOW_REWARDS
        return;
      }

      setBusy(true);
      dispatch({ type: "TOGGLE_PROFILE", payload: false });

      if (mobile) {
        const receiverID = matchedUser._id;
        const senderID = currentUser._id;
        const params = new URLSearchParams(location.search);
        params.set("senderID", senderID);
        params.set("receiverID", receiverID);
        params.set("videoMessage", true);

        const data = { senderID, receiverID, videoMessage: true };

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
        // Desktop/web: open your recorder / toggle video UI
        dispatch({ type: "TOGGLE_VIDEO", payload: !state.showVideo });
      }

      // NEW: close the match screen after initiating a video message
      onClose?.();
    } catch (err) {
      console.log(err);
    } finally {
      setBusy(false);
    }
  };

  const handleVideoChatRequest = async () => {
    try {
      if (
        currentUser.plan.videoMinutes + currentUser.plan.additionalMinutes <=
        currentUser.plan.videoMinutesUsed
      ) {
        window.ReactNativeWebView?.postMessage("BUY_MINUTES");
        return;
      }

      setBusy(true);

      const variables = {
        senderID: state.currentUser._id,
        receiverID: matchedUser._id,
        status: "Pending",
      };

      const { videoChatRequest } = await client.request(
        VIDEO_CHAT_REQUEST,
        variables
      );
      console.log("video request: ", videoChatRequest);

      // Transition to chat; we KEEP the overlay open until chat view shows
      dispatch({ type: "TOGGLE_PROFILE", payload: false });
      dispatch({ type: "TOGGLE_CHAT", payload: true });
    } catch (err) {
      console.log(err);
    } finally {
      setBusy(false);
    }
  };

  // NEW: Dynamic CTA copy
  const bottomCopy = handleImBlocked()
    ? "You can’t contact this user"
    : isOtherOnline
    ? busy
      ? "Calling…"
      : "Start a live video call"
    : busy
    ? "Sending…"
    : "Send a video message";

  const onCtaPress = handleImBlocked()
    ? undefined
    : isOtherOnline
    ? handleVideoChatRequest
    : handleSendVideoMessage;

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
          <CloseIcon onClick={busy ? undefined : onClose} />
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
              opacity: busy ? 0.8 : 1,
              pointerEvents: busy ? "none" : "auto",
            }}
            disabled={handleImBlocked() || busy}
            onClick={onCtaPress}
          >
            <MdVideoChat size={45} color={COLORS.vividBlue} />
          </Button>

          {/* NEW: dynamic bottom verbiage */}
          <Text
            style={{ marginTop: 8, fontWeight: 600, color: COLORS.darkGrey }}
          >
            {bottomCopy}
          </Text>

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
