// SwipeableProfileCard.js
import React, {
  forwardRef,
  useState,
  useEffect,
  useMemo,
  Fragment,
} from "react";
import TinderCard from "react-tinder-card";
import {
  Box,
  Text,
  Icon,
  PhotoSlider,
  ICON_SIZES,
  FONT_SIZES,
  OnlineDot,
  RoomLink, // NEW: to render the room pill like Profile.jsx
} from "../../../../components";
import { COLORS } from "../../../../constants";
import moment from "moment";
import { formatDistanceToNow } from "date-fns";
import { useHistory } from "react-router-dom";
import { getDistanceFromCoords } from "../../../../utils/helpers";

const CARD_W = 400;
const SLIDER_H = 310;
const BODY_PAD_X = 15;
const LIFESTYLE_PILL_HEIGHT = 48; // match Profile.jsx

/** --- LabeledPill (IDENTICAL styling to Profile.jsx) --- */
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
        boxSizing: "border-box",
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

/** --- SingleSinceBadge (IDENTICAL to Profile.jsx) --- */
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

const pillText = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "100%",
};

const SwipeableProfileCard = forwardRef(
  (
    {
      user,
      rotation,
      state,
      onSwipe,
      onCardLeftScreen,
      zIndex,
      dispatch,
      preventSwipe,
    },
    ref
  ) => {
    const [distance, setDistance] = useState("No Location");
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const history = useHistory();

    useEffect(() => {
      handleDistance(user);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const noLocation = (array) =>
      Array.isArray(array) &&
      array.length === 2 &&
      array[0] === 0 &&
      array[1] === 0;

    const handleDistance = async (u) => {
      try {
        if (
          !noLocation(state.currentUser?.location?.coordinates) &&
          !noLocation(u?.location?.coordinates)
        ) {
          const {
            location: { coordinates },
          } = state.currentUser;
          const miles = await getDistanceFromCoords(
            coordinates[1],
            coordinates[0],
            u.location.coordinates[1],
            u.location.coordinates[0]
          );
          setDistance(`${miles} miles away`);
        } else if (
          noLocation(state.currentUser?.location?.coordinates) &&
          !noLocation(u?.location?.coordinates)
        ) {
          setDistance("Distance Unknown");
        } else {
          setDistance("No Location");
        }
      } catch {
        setDistance("No Location");
      }
    };

    const introTrimmed =
      typeof user?.intro === "string"
        ? user.intro.replace(/\s+$/g, "").replace(/^\s+/g, "")
        : user?.intro;

    /** Build pills IDENTICAL to Profile.jsx usage */
    const basicsPills = useMemo(() => {
      const pills = [];
      if (user?.occupation)
        pills.push(
          <LabeledPill key="occ" label="Occupation">
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
              }}
            >
              <Icon name="job" color={COLORS.pink} size={ICON_SIZES.XX_LARGE} />
              <Text
                margin={0}
                style={{ ...pillText, fontSize: 10, fontWeight: "bold" }}
              >
                {user.occupation}
              </Text>
            </Box>
          </LabeledPill>
        );
      if (user?.drink)
        pills.push(
          <LabeledPill key="drink" label="Drink">
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
              }}
            >
              <Text margin={0} style={{ fontSize: 24, lineHeight: 1 }}>
                🥃
              </Text>
              <Text margin={0} style={pillText}>
                {user.drink}
              </Text>
            </Box>
          </LabeledPill>
        );
      if (user?.smoke)
        pills.push(
          <LabeledPill key="smoke" label="Smoke">
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
              }}
            >
              <Text margin={0} style={{ fontSize: 24, lineHeight: 1 }}>
                🚬
              </Text>
              <Text margin={0} style={pillText}>
                {user.smoke}
              </Text>
            </Box>
          </LabeledPill>
        );
      if (user?.marijuana)
        pills.push(
          <LabeledPill key="weed" label="Marijuana">
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
              }}
            >
              <Icon
                name="weed"
                color={COLORS.pink}
                size={ICON_SIZES.XX_LARGE}
              />
              <Text margin={0} style={pillText}>
                {user.marijuana}
              </Text>
            </Box>
          </LabeledPill>
        );
      if (user?.drugs)
        pills.push(
          <LabeledPill key="drugs" label="Drug Use">
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
              }}
            >
              <Icon
                name="drugs"
                color={COLORS.pink}
                size={ICON_SIZES.XX_LARGE}
              />
              <Text margin={0} style={pillText}>
                {user.drugs}
              </Text>
            </Box>
          </LabeledPill>
        );
      if (user?.kids)
        pills.push(
          <LabeledPill key="kids" label="Kids">
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
              }}
            >
              <Icon name="kid" color={COLORS.pink} size={ICON_SIZES.XX_LARGE} />
              <Text margin={0} style={pillText}>
                {user.kids}
              </Text>
            </Box>
          </LabeledPill>
        );
      return pills;
    }, [user]);

    // Looking For + Room live on their own index now
    const lookingRoomPills = useMemo(() => {
      const pills = [];
      if (user?.lookingFor?.sex)
        pills.push(
          <LabeledPill key="looking" label="Looking For" labelEmoji="💍">
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
              }}
            >
              <Icon
                name="curious"
                color={COLORS.pink}
                size={ICON_SIZES.XX_LARGE}
              />
              <Text margin={0} style={pillText}>
                {user.lookingFor.sex === "Female"
                  ? "Women"
                  : user.lookingFor.sex === "Male"
                  ? "Men"
                  : "Gender Diverse"}
              </Text>
            </Box>
          </LabeledPill>
        );

      if (user?.room && user.room.name) {
        pills.push(
          <LabeledPill key="room" label="Chatroom" labelEmoji="💭">
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              <RoomLink dispatch={dispatch} user={user} />
            </Box>
          </LabeledPill>
        );
      }

      return pills;
    }, [user, dispatch]);

    // Index plan:
    // 0: Intro (pill style)
    // 1: All basics pills (occupation, drink, smoke, marijuana, drugs, kids)
    // 2: Intro again
    // 3: Looking For + Room
    // 4: Intro ...
    const isIntroIndex = (idx) => idx % 2 === 0; // 0,2,4,…
    const isBasicsIndex = (idx) => idx === 1 || (idx > 3 && idx % 2 === 1); // 1,5,7,…
    const isLookingRoomIndex = (idx) => idx === 3; // dedicated slot

    return (
      <Fragment>
        <TinderCard
          ref={ref}
          onSwipe={onSwipe}
          onCardLeftScreen={onCardLeftScreen}
          className="pressable"
          preventSwipe={preventSwipe}
          swipeRequirementType="position"
          swipeThreshold={50}
        >
          <Box
            display="flex"
            column
            center
            height="75vh"
            style={{
              position: "absolute",
              left: "50%",
              top: "0",
              transform: `translateX(-50%) rotate(${rotation}deg)`,
              width: `${CARD_W}px`,
              maxWidth: "90vw",
              backgroundColor: COLORS.white,
              borderRadius: "20px",
              boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.2)",
              overflow: "hidden",
              zIndex,
              transition: `ease all linear 0.3s`,
            }}
          >
            {/* Photo + overlays */}
            <Box
              width="100%"
              style={{
                alignItems: "center",
                overflow: "hidden",
                position: "relative",
              }}
              height={"fit-content"}
            >
              <PhotoSlider
                withDelete={false}
                images={user?.pictures}
                height={SLIDER_H}
                width={200}
                onSlideChange={setCurrentSlideIndex}
              />

              {/* Online dot — top-left */}
              {user?.isLoggedIn && (
                <Box
                  style={{ position: "absolute", top: 12, left: 12, zIndex: 5 }}
                >
                  <OnlineDot online />
                </Box>
              )}

              {/* Single Since badge — identical to Profile (absolute, bottom-right) */}
              {user?.singleTime ? (
                <SingleSinceBadge ts={user.singleTime} />
              ) : null}

              {/* Bottom gradient for name (gender removed) */}
              <Box
                column
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "12px 16px",
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.70) 100%)",
                  color: COLORS.white,
                }}
              >
                <Text
                  bold
                  margin={0}
                  style={{ color: COLORS.white, display: "block" }}
                  fontSize={FONT_SIZES.X_LARGE}
                >
                  {user?.username}, <Text as="span">{user?.age}</Text>
                </Text>
              </Box>
            </Box>

            {/* Body */}
            <Box
              width="100%"
              paddingX={BODY_PAD_X}
              style={{ flex: 1, overflowY: "auto", paddingTop: 10 }}
            >
              {/* INTRO indexes — styled like Profile intro pill */}
              {isIntroIndex(currentSlideIndex) && !!introTrimmed && (
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
              )}

              {/* BASICS pills on index 1 (and any later odd indexes except 3) */}
              {isBasicsIndex(currentSlideIndex) && basicsPills.length > 0 && (
                <Box width="100%" paddingX={5} column>
                  <Box
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      alignItems: "stretch",
                    }}
                  >
                    {basicsPills.map((p, i) =>
                      React.cloneElement(p, {
                        key: i,
                        style: {
                          flex: "0 0 calc(50% - 10px)",
                          maxWidth: "calc(50% - 10px)",
                          height: LIFESTYLE_PILL_HEIGHT,
                          minWidth: 0,
                          ...p.props.style,
                        },
                      })
                    )}
                  </Box>
                </Box>
              )}

              {/* LOOKING FOR + ROOM on dedicated index 3 */}
              {isLookingRoomIndex(currentSlideIndex) &&
                lookingRoomPills.length > 0 && (
                  <Box width="100%" paddingX={5} column>
                    <Box
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                        alignItems: "stretch",
                      }}
                    >
                      {lookingRoomPills.map((p, i) =>
                        React.cloneElement(p, {
                          key: i,
                          style: {
                            flex: "0 0 calc(50% - 10px)",
                            maxWidth: "calc(50% - 10px)",
                            height: LIFESTYLE_PILL_HEIGHT,
                            minWidth: 0,
                            ...p.props.style,
                          },
                        })
                      )}
                    </Box>
                  </Box>
                )}

              {/* Distance on ALL indexes (fixed at bottom like your original) */}
              <Box
                width="100%"
                justifyContent="center"
                alignItems="center"
                position="fixed"
                bottom={0}
              >
                <Icon
                  name={"distance"}
                  color={COLORS.pink}
                  size={ICON_SIZES.LARGE}
                />
                <Text margin={0} bold>
                  - {distance}
                </Text>
              </Box>
            </Box>
          </Box>
        </TinderCard>
      </Fragment>
    );
  }
);

export default SwipeableProfileCard;
