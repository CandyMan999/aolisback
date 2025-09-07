// Profile.jsx
import React, {
  useContext,
  useState,
  useEffect,
  Fragment,
  useMemo,
} from "react";
import {
  Drawer,
  Box,
  Button,
  Text,
  ICON_SIZES,
  Icon,
  PhotoSlider,
  FONT_SIZES,
  Loading,
  FloatingHeart,
  LikeButton,
  UnlikeButton,
  OnlineDot,
  RoomLink, // only for the room pill
} from "../../components";
import { track } from "@vercel/analytics";
import { COLORS } from "../../constants";
import { formatDistanceToNow } from "date-fns";
import moment from "moment";
import VideoModal from "../../modules/gridSearch/video-modal";

import Context from "../../context";
import { useHistory, useLocation } from "react-router-dom";
import { useClient } from "../../client";
import {
  VIDEO_CHAT_REQUEST,
  UNBLOCK_USER_MUTATION,
  LIKE_MUTATION,
  UNLIKE_MUTATION,
} from "../../graphql/mutations";
import { IS_LIKED_QUERY } from "../../graphql/queries";
import { MdVideoChat } from "react-icons/md";
import { motion, useReducedMotion } from "framer-motion";

const BUTTON_H = 52;
const MAX_W = 560;
const LIFESTYLE_PILL_HEIGHT = 48; // unify pill height

/** --- Generic floating-label pill --- */
const LabeledPill = ({
  label,
  labelEmoji,
  children,
  accent = COLORS.pink,
  style,
}) => {
  return (
    <Box
      style={{
        position: "relative",
        borderRadius: 14,
        background: COLORS.white,
        border: `3px solid ${COLORS.lighterGrey}`,
        minHeight: 44,
        boxShadow: `0 2px 10px rgba(0,0,0,0.05)`,
        justifyContent: "center",
        ...style,
      }}
    >
      <Text
        style={{
          position: "absolute",
          top: -25,
          left: 12,
          background: COLORS.lighterGrey,
          padding: "0 8px",
          fontSize: 14,
          fontWeight: 700,
          color: COLORS.gray,
          borderRadius: 10,
          lineHeight: 1.6,
          border: `1px solid ${accent}20`,
        }}
      >
        {labelEmoji ? `${labelEmoji} ` : ""}
        {label}
      </Text>
      {children}
    </Box>
  );
};

/** --- Bottom-right floating “Single Since” badge --- */
const SingleSinceBadge = ({ ts }) => {
  if (!ts) return null;
  const date = moment(Number(ts)).format("MM-DD-YYYY");
  const rel = formatDistanceToNow(Number(ts)).toUpperCase();

  return (
    <Box
      column
      style={{
        position: "absolute",
        right: 12,
        bottom: 12,
        zIndex: 6,
        background:
          "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.65) 100%)",
        color: COLORS.white,
        borderRadius: 12,
        padding: "8px 10px",
        justifyContent: "center",
        alignItems: "center",
        border: `1px solid ${COLORS.white}60`,
        backdropFilter: "blur(7px)",
      }}
    >
      <Box column style={{ textAlign: "center" }}>
        <Text margin={0} style={{ fontSize: 14, opacity: 0.9 }}>
          💔 Single Since
        </Text>
        <Text margin={0} bold style={{ fontSize: 14, lineHeight: 1.2 }}>
          {date}{" "}
        </Text>
        <Text as="span" style={{ opacity: 0.9 }}>
          ({rel})
        </Text>
      </Box>
    </Box>
  );
};

/** --- Cutting-edge button frame (unchanged behavior/visual) --- */
const ringGradientPrimary =
  "linear-gradient(135deg, rgba(20,20,20,1) 0%, rgba(90,90,90,1) 50%, rgba(20,20,20,1) 100%)";
const ringGradientAction =
  "linear-gradient(135deg, rgba(255,0,128,1) 0%, rgba(0,163,255,1) 50%, rgba(255,0,128,1) 100%)";

const CuttingEdgeButton = ({
  children,
  onClick,
  disabled,
  ring = "primary",
  ariaLabel,
}) => {
  const reduceMotion = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const ringGradient =
    ring === "action" ? ringGradientAction : ringGradientPrimary;

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(e);
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={disabled ? "true" : "false"}
      onKeyDown={handleKeyDown}
      onClick={disabled ? undefined : onClick}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      initial={false}
      whileHover={
        disabled || reduceMotion
          ? undefined
          : {
              scale: 1.01,
              transition: { type: "spring", stiffness: 300, damping: 22 },
            }
      }
      whileTap={
        disabled || reduceMotion
          ? undefined
          : {
              scale: 0.99,
              transition: { type: "spring", stiffness: 500, damping: 28 },
            }
      }
      style={{
        position: "relative",
        borderRadius: 18,
        padding: 2,
        overflow: "hidden",
        cursor: disabled ? "not-allowed" : "pointer",
        outline: "none",
        backgroundImage: ringGradient,
        backgroundSize: "200% 200%",
        boxShadow:
          ring === "action"
            ? "0 10px 30px rgba(255, 0, 128, 0.18), 0 6px 14px rgba(0, 163, 255, 0.14)"
            : "0 8px 22px rgba(0,0,0,0.12)",
        opacity: disabled ? 0.6 : 1,
      }}
      animate={
        reduceMotion
          ? { backgroundPosition: "50% 50%" }
          : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 6, ease: "linear", repeat: Infinity }
      }
    >
      <div
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: 22,
          pointerEvents: "none",
          boxShadow: focused
            ? "0 0 0 3px rgba(255,255,255,0.85), 0 0 0 6px rgba(0,0,0,0.45)"
            : "none",
          transition: "box-shadow 160ms ease-out",
        }}
      />
      <div
        style={{
          borderRadius: 16,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.94) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 10px rgba(0,0,0,0.06)",
          height: BUTTON_H,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 14px",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

const Profile = ({ userClicked, mobile, currentUser }) => {
  const client = useClient();
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;

  const { state, dispatch } = useContext(Context);

  const [imBlocked, setImBlocked] = useState(false);
  const [userBlocked, setUserBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  // like/unlike UI
  const [showHearts, setShowHearts] = useState(false);
  const [match, setMatch] = useState(false);

  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

  const user = userClicked ? userClicked : currentUser;
  const itsMe = userClicked._id === currentUser._id;

  const {
    username,
    singleTime,
    intro,
    sex,
    age,
    location: userLocation,
    occupation,
    marijuana,
    drink,
    smoke,
    drugs,
    kids,
    pictures,
    _id,
    isLoggedIn,
    lookingFor,
    inCall,
    room,
  } = user;

  // Trim intro to prevent phantom height from trailing newlines/whitespace
  const introTrimmed =
    typeof intro === "string"
      ? intro.replace(/\s+$/g, "").replace(/^\s+/g, "")
      : intro;

  useEffect(() => {
    if (state.isProfile) {
      handleImBlocked();
      handleUserBlocked();
      handleShowHearts();
    }
  }, [state.isProfile]);

  const handleShowHearts = async () => {
    try {
      const { isLiked } = await client.request(IS_LIKED_QUERY, {
        userID: currentUser._id,
        otherID: _id,
      });
      setShowHearts(isLiked);
    } catch (err) {
      console.log("error filtering likes: ", err);
    }
  };

  const handleImBlocked = () => {
    try {
      setImBlocked(!!user.blockedUsers.find((u) => u._id === currentUser._id));
    } catch {}
  };

  const handleUserBlocked = () => {
    try {
      setUserBlocked(!!currentUser.blockedUsers.find((u) => u._id === _id));
    } catch {}
  };

  const toggleDrawer = () => {
    dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
    if (!state.isProfile) setShowHearts(false);
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

      track("Video_Call", {
        sender: state.currentUser.username,
        reciever: _id,
      });

      setLoading(true);
      await client.request(VIDEO_CHAT_REQUEST, {
        senderID: state.currentUser._id,
        receiverID: _id,
        status: "Pending",
      });

      dispatch({ type: "TOGGLE_PROFILE", payload: false });
      dispatch({ type: "TOGGLE_CHAT", payload: true });
      setShowHearts(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      track("Video_Call_Error", {
        sender: state.currentUser.username,
        receiver: _id,
        error: err.message,
      });
    }
  };

  const handleLocation = (_id, locationObj) => {
    try {
      dispatch({
        type: "VIEW_LOCATION",
        payload: {
          _id,
          lat: locationObj.coordinates[1],
          lng: locationObj.coordinates[0],
        },
      });
      dispatch({ type: "TOGGLE_PROFILE", payload: false });
      setShowHearts(false);
      history.push("/location");
    } catch {}
  };

  const handleUnBlock = async () => {
    try {
      setLoading(true);
      const { unBlock } = await client.request(UNBLOCK_USER_MUTATION, {
        userID: currentUser._id,
        blockID: _id,
      });
      dispatch({ type: "UPDATE_BLOCKED", payload: unBlock.blockedUsers });
      setUserBlocked(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    dispatch({ type: "TOGGLE_VIDEO", payload: !state.showVideo });
  };

  const handleSendVideoMessage = () => {
    try {
      if (
        currentUser.plan.messages + currentUser.plan.additionalMessages <=
        currentUser.plan.messagesSent
      ) {
        window.ReactNativeWebView?.postMessage("BUY_MESSAGES");
        return;
      }

      dispatch({ type: "TOGGLE_PROFILE", payload: false });
      setShowHearts(false);

      if (mobile) {
        const receiverID = _id;
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

        window.ReactNativeWebView?.postMessage(JSON.stringify(data));
      } else {
        dispatch({ type: "TOGGLE_VIDEO", payload: !state.showVideo });
      }
    } catch {}
  };

  const noLocation = (arr) =>
    Array.isArray(arr) && arr.length === 2 && arr[0] === 0 && arr[1] === 0;

  /** ---- Like/Unlike logic (unchanged) ---- */
  const handleLikeUser = async () => {
    try {
      if (
        currentUser.plan.likes + currentUser.plan.additionalLikes <=
        currentUser.plan.likesSent
      ) {
        window.ReactNativeWebView?.postMessage("BUY_LIKES");
        return;
      }
      setLoading(true);
      const {
        like: { user: updatedUser, isMatch },
      } = await client.request(LIKE_MUTATION, {
        userID: currentUser._id,
        likeID: _id,
      });

      dispatch({ type: "UPDATE_LIKED_USERS", payload: updatedUser });
      setShowHearts(true);
      setMatch(isMatch);

      if (isMatch) {
        setMatchedUser(user);
        setMatchModalVisible(true);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("error liking user: ", err);
    }
  };

  const handleUnLikeUser = async () => {
    try {
      setLoading(true);
      const { unLike } = await client.request(UNLIKE_MUTATION, {
        userID: currentUser._id,
        unLikeID: _id,
      });
      dispatch({ type: "UPDATE_LIKED_USERS", payload: unLike });
      setShowHearts(false);
      setMatch(false);
      setMatchModalVisible(false);
      setMatchedUser(null);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("error liking user: ", err);
    }
  };

  /** Lifestyle list (add room pill, keep others intact) */
  const lifestylePills = useMemo(() => {
    const pills = [];

    if (occupation)
      pills.push(
        <LabeledPill key="occ" label="Occupation">
          <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="job" color={COLORS.pink} size={ICON_SIZES.XX_LARGE} />
            <Text margin={0}>{occupation}</Text>
          </Box>
        </LabeledPill>
      );

    if (drink)
      pills.push(
        <LabeledPill key="drink" label="Drink">
          <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text margin={0} style={{ fontSize: 24, lineHeight: 1 }}>
              🥃
            </Text>
            <Text margin={0}>{drink}</Text>
          </Box>
        </LabeledPill>
      );

    if (smoke)
      pills.push(
        <LabeledPill key="smoke" label="Smoke">
          <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text margin={0} style={{ fontSize: 24, lineHeight: 1 }}>
              🚬
            </Text>
            <Text margin={0}>{smoke}</Text>
          </Box>
        </LabeledPill>
      );

    if (marijuana)
      pills.push(
        <LabeledPill key="weed" label="Marijuana">
          <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="weed" color={COLORS.pink} size={ICON_SIZES.XX_LARGE} />
            <Text margin={0}>{marijuana}</Text>
          </Box>
        </LabeledPill>
      );

    if (drugs)
      pills.push(
        <LabeledPill key="drugs" label="Drug Use">
          <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="drugs" color={COLORS.pink} size={ICON_SIZES.XX_LARGE} />
            <Text margin={0}>{drugs}</Text>
          </Box>
        </LabeledPill>
      );

    if (kids)
      pills.push(
        <LabeledPill key="kids" label="Kids">
          <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="kid" color={COLORS.pink} size={ICON_SIZES.XX_LARGE} />
            <Text margin={0}>{kids}</Text>
          </Box>
        </LabeledPill>
      );

    if (lookingFor?.sex)
      pills.push(
        <LabeledPill key="looking" label="Looking For" labelEmoji="💍">
          <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon
              name="curious"
              color={COLORS.pink}
              size={ICON_SIZES.XX_LARGE}
            />
            <Text margin={0}>
              {lookingFor.sex === "Female"
                ? "Women"
                : lookingFor.sex === "Male"
                ? "Men"
                : "Gender Diverse"}
            </Text>
          </Box>
        </LabeledPill>
      );

    if (room && room.name) {
      pills.push(
        <LabeledPill key="room" label="Chatroom" labelEmoji="💭">
          <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <RoomLink dispatch={dispatch} user={user} />
          </Box>
        </LabeledPill>
      );
    }

    return pills;
  }, [
    occupation,
    drink,
    smoke,
    marijuana,
    drugs,
    kids,
    lookingFor,
    room,
    dispatch,
    user,
  ]);

  return (
    <Fragment>
      <Drawer onClose={toggleDrawer} isOpen={state.isProfile}>
        <Box
          width="100%"
          style={{
            background: COLORS.lightGrey,
            minHeight: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box
            column
            width="100%"
            style={{
              maxWidth: MAX_W,
              margin: "0 auto",
              paddingBottom: 16,
              overflowX: "hidden",
            }}
          >
            {/* Photo + overlay */}
            <Box
              width="100%"
              position="relative"
              style={{ overflow: "hidden" }}
            >
              <PhotoSlider
                withDelete={_id && _id === state.currentUser._id}
                images={pictures}
                height={mobile ? 320 : 360}
                width={200}
              />

              {!itsMe &&
                (!showHearts ? (
                  <UnlikeButton
                    disabled={loading}
                    onClick={handleLikeUser}
                    loading={loading}
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      zIndex: 5,
                    }}
                  />
                ) : (
                  <LikeButton
                    disabled={loading}
                    onClick={handleUnLikeUser}
                    loading={loading}
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      zIndex: 5,
                    }}
                  />
                ))}
              {/* {showHearts && (
                <Box
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 4,
                    pointerEvents: "none",
                    overflow: "hidden",
                  }}
                >
                  <FloatingHeart activate={showHearts} isMatch={match} />
                </Box>
              )} */}

              {singleTime ? <SingleSinceBadge ts={singleTime} /> : null}

              <Box
                column
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "12px 16px",
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.65) 100%)",
                  color: COLORS.white,
                }}
              >
                <Text
                  bold
                  margin={0}
                  style={{ color: COLORS.white, display: "block" }}
                  fontSize={mobile ? FONT_SIZES.X_LARGE : FONT_SIZES.XX_LARGE}
                >
                  {username}, <Text as="span">{age}</Text>
                </Text>

                <Box style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Text style={{ color: COLORS.white }}>
                    {sex === "Gender_Diverse" ? "Gender Diverse" : sex}
                  </Text>
                  <OnlineDot online={!!isLoggedIn} inCall={!!inCall} />
                </Box>
              </Box>
            </Box>

            {/* Body */}
            <Box
              column
              style={{
                padding: "5px 0px 0",

                backgroundColor: COLORS.lightGrey,
                rowGap: 5,
              }}
            >
              {!!introTrimmed && (
                <Box
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: 5,
                    padding: "10px 10px 10px",
                    alignItems: "start",
                    margin: 0,
                  }}
                >
                  <LabeledPill
                    label="Intro"
                    accent={COLORS.pink}
                    style={{ padding: 14 }}
                    labelEmoji={"🎙️"}
                  >
                    <Text
                      margin={0}
                      color={COLORS.black}
                      style={{
                        lineHeight: 1.4,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {introTrimmed}
                    </Text>
                  </LabeledPill>
                </Box>
              )}

              {lifestylePills.length ? (
                <Box
                  column
                  style={{
                    marginTop: 0, // <— kill the extra vertical gap
                    margin: "0 10px 10px", // <— keep original side/bottom margin
                    backgroundColor: COLORS.white,
                    borderRadius: 20,
                    padding: 5,
                  }}
                >
                  <Box style={{ marginBottom: 6, paddingLeft: 2 }}>
                    <Text bold color={COLORS.grey}>
                      Basics & Lifestyle
                    </Text>
                  </Box>
                  <Box
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                      alignItems: "start",
                    }}
                  >
                    {lifestylePills.map((p, i) =>
                      React.cloneElement(p, {
                        key: i,
                        // normalize heights for all lifestyle pills only
                        style: {
                          height: LIFESTYLE_PILL_HEIGHT,
                          ...p.props.style,
                        },
                      })
                    )}
                  </Box>
                </Box>
              ) : null}

              {/* Buttons (unchanged visuals/logic) */}
              <Box column width="100%" style={{ marginTop: 2, gap: 6 }}>
                <CuttingEdgeButton
                  ring="primary"
                  ariaLabel="View location"
                  disabled={
                    (userLocation && noLocation(userLocation.coordinates)) ||
                    (userLocation && !userLocation.showOnMap)
                  }
                  onClick={() => handleLocation(_id, userLocation)}
                >
                  <Box style={{ display: "flex", alignItems: "center" }}>
                    <Icon
                      name="search"
                      color={
                        (userLocation &&
                          noLocation(userLocation.coordinates)) ||
                        (userLocation && !userLocation.showOnMap)
                          ? COLORS.grey
                          : COLORS.pink
                      }
                      size={ICON_SIZES.XX_LARGE}
                    />
                    <Text bold marginLeft={10} color={COLORS.darkGrey}>
                      View Location
                    </Text>
                  </Box>
                </CuttingEdgeButton>

                <CuttingEdgeButton
                  ring="action"
                  ariaLabel={
                    itsMe
                      ? "Send video message"
                      : userBlocked
                      ? `Unblock ${username}`
                      : imBlocked
                      ? "You're blocked"
                      : !isLoggedIn || inCall
                      ? "Send video message"
                      : `Video call ${username}`
                  }
                  disabled={(imBlocked && !userBlocked) || loading || itsMe}
                  onClick={
                    userBlocked
                      ? handleUnBlock
                      : imBlocked
                      ? undefined
                      : !isLoggedIn || inCall
                      ? handleSendVideoMessage
                      : handleVideoChatRequest
                  }
                >
                  {loading ? (
                    <Loading bar />
                  ) : (
                    <Box style={{ display: "flex", alignItems: "center" }}>
                      <MdVideoChat size={30} color={COLORS.vividBlue} />
                      <Text
                        bold
                        marginLeft={10}
                        color={
                          itsMe || userBlocked || imBlocked
                            ? COLORS.grey
                            : COLORS.darkGrey
                        }
                      >
                        {itsMe
                          ? `Send Video Message`
                          : userBlocked
                          ? `UnBlock ${username}`
                          : imBlocked
                          ? `You're Blocked`
                          : !isLoggedIn || inCall
                          ? `Send Video Message`
                          : `Video Call ${username}`}
                      </Text>
                    </Box>
                  )}
                </CuttingEdgeButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {state.showVideo && pathname !== "/message" && (
        <VideoModal
          onClose={toggleModal}
          closeModal={() => dispatch({ type: "TOGGLE_VIDEO", payload: false })}
          receiverID={_id}
          senderID={currentUser._id}
          state={state}
        />
      )}
    </Fragment>
  );
};

export default Profile;
