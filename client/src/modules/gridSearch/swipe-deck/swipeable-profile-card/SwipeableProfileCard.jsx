// SwipeableProfileCard.js

import React, { forwardRef, useState, useEffect, Fragment } from "react";
import TinderCard from "react-tinder-card";
import {
  Box,
  Text,
  Icon,
  PhotoSlider,
  ICON_SIZES,
  FONT_SIZES,
  Button,
  OnlineDot,
} from "../../../../components";
import { COLORS } from "../../../../constants";
import moment from "moment";
import { formatDistanceToNow } from "date-fns";
import { useHistory } from "react-router-dom";

import { getDistanceFromCoords } from "../../../../utils/helpers"; // Import the distance calculation helper

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
    }, [user]);

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
      } else if (
        noLocation(state.currentUser.location.coordinates) &&
        !noLocation(user.location.coordinates)
      ) {
        setDistance("Distance Unkown");
      } else {
        setDistance("No Location");
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

    const iconForLabel = (label) => {
      switch (label) {
        case "Drink":
          return (
            <Text
              style={{ fontSize: ICON_SIZES.LARGE }}
              role="img"
              aria-label="Drink"
              margin={0}
            >
              🥃
            </Text>
          );
        case "Smoke":
          return (
            <Text
              fontSize={FONT_SIZES.X_LARGE}
              role="img"
              aria-label="Smoke"
              margin={0}
            >
              🚬
            </Text>
          );
        case "Marijuana Tolerance":
          return (
            <Icon name="weed" color={COLORS.pink} size={ICON_SIZES.X_LARGE} />
          );
        case "Drug Use":
          return (
            <Icon name="drugs" color={COLORS.pink} size={ICON_SIZES.X_LARGE} />
          );
        case "Kids":
          return (
            <Icon name="kid" color={COLORS.pink} size={ICON_SIZES.X_LARGE} />
          );
        case "Job":
          return (
            <Icon name="job" color={COLORS.pink} size={ICON_SIZES.X_LARGE} />
          );
        case "Looking For":
          return (
            <Box style={{ position: "relative", display: "inline-block" }}>
              <Icon
                name="curious"
                color={COLORS.pink}
                size={ICON_SIZES.LARGE}
              />
              <Box style={{ position: "absolute", top: -25, left: 23 }}>
                <Text
                  style={{
                    fontSize: ICON_SIZES.LARGE,
                    position: "absolute",
                    top: 0,
                  }}
                  role="img"
                  aria-label="Ring"
                >
                  💍
                </Text>
              </Box>
            </Box>
          );
        default:
          return (
            <Icon name="info" color={COLORS.white} size={ICON_SIZES.LARGE} />
          );
      }
    };

    const handleLocation = (_id, location) => {
      try {
        dispatch({
          type: "VIEW_LOCATION",
          payload: {
            _id,
            lat: location.coordinates[1],
            lng: location.coordinates[0],
          },
        });
        dispatch({ type: "TOGGLE_PROFILE", payload: false });

        history.push("/location");
      } catch (err) {
        console.log(err);
      }
    };

    // Helper function to truncate text after a certain number of words
    const truncateText = (text, wordLimit) => {
      const words = text.split(" ");
      if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(" ") + "...";
      } else {
        return text;
      }
    };

    return (
      <Fragment>
        <TinderCard
          ref={ref}
          onSwipe={onSwipe}
          onCardLeftScreen={onCardLeftScreen}
          className="pressable"
          preventSwipe={preventSwipe}
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
              width: "400px",
              maxWidth: "85vw",
              backgroundColor: COLORS.white,
              borderRadius: "20px",
              boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.2)",
              overflow: "hidden",
              zIndex: zIndex,
              transition: `ease all linear 0.3s`,
            }}
          >
            {/* Photo Slider */}
            <Box
              width="100%"
              style={{
                alignItems: "center",
                overflow: "hidden",
                position: "relative",
              }}
              height={350}
            >
              <PhotoSlider
                withDelete={false}
                images={user?.pictures}
                height={310}
                width={200}
                onSlideChange={setCurrentSlideIndex}
              />
              {/* Overlays based on currentSlideIndex */}
              {currentSlideIndex < 6 && (
                // Overlay for the first picture (Username)
                <Fragment>
                  <Box
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 10,

                      marginRight: 10,
                      borderRadius: 15,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      color={COLORS.white}
                      fontSize={FONT_SIZES.XX_LARGE}
                      bold
                      style={{ padding: 0, marginBottom: 5 }}
                    >
                      {user.username}, {user.age}
                    </Text>
                  </Box>
                  {user.isLoggedIn && (
                    <Box style={{ position: "absolute", top: 10, left: 10 }}>
                      <OnlineDot online={user.isLoggedIn} />
                    </Box>
                  )}
                </Fragment>
              )}
            </Box>

            {/* Intro and Additional Information */}
            <Box
              width="100%"
              paddingX={15}
              style={{
                flex: 1,
                overflowY: "auto",
                marginTop: 0,
              }}
            >
              {(currentSlideIndex === 0 || currentSlideIndex >= 3) && (
                // Display the intro
                <Box wodth="100%" padding={10} column>
                  <Box width="100%">
                    🎙
                    <Text
                      marginBottom={0}
                      style={{ marginTop: 0, marginLeft: 5 }}
                      bold
                      center
                    >
                      Intro:
                    </Text>
                  </Box>{" "}
                  <Text style={{ marginTop: 0, paddingLeft: 5 }}>
                    {/* Use the truncateText function here */}
                    {truncateText(user.intro, 60)}
                  </Text>
                </Box>
              )}{" "}
              {currentSlideIndex === 1 && (
                // Display age and single since below the photo slider
                <Box width="100%" padding={10} column>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    marginBottom={10}
                    width="100%"
                  >
                    <Box column>
                      <Box
                        style={{
                          paddingLeft: 10,
                          borderRadius: 10,
                          height: "fit-content",
                          alignItems: "center",
                        }}
                      >
                        {iconForLabel("Drink")}
                        <Text color={COLORS.black} marginLeft={5} bold>
                          {user.drink}
                        </Text>
                      </Box>

                      <Box
                        style={{
                          paddingLeft: 10,
                          borderRadius: 10,
                          height: "fit-content",
                          alignItems: "center",
                          marginTop: 0,
                          marginBottom: 0,
                        }}
                      >
                        {iconForLabel("Smoke")}
                        <Text
                          color={COLORS.black}
                          bold
                          marginLeft={10}
                          marginY={0}
                        >
                          {user.smoke}
                        </Text>
                      </Box>
                      <Box
                        style={{
                          borderRadius: 10,
                          height: "fit-content",
                          alignItems: "center",
                          marginTop: 0,
                          marginBottom: 0,
                        }}
                      >
                        {iconForLabel("Marijuana Tolerance")}
                        <Text color={COLORS.black} bold marginY={0}>
                          {user.marijuana}
                        </Text>
                      </Box>
                      <Box
                        style={{
                          borderRadius: 10,
                          height: "fit-content",
                          alignItems: "center",
                          marginTop: 0,
                          marginBottom: 0,
                        }}
                      >
                        {iconForLabel("Drug Use")}
                        <Text color={COLORS.black} bold marginY={0}>
                          {user.drugs}
                        </Text>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center"></Box>
                    {user.singleTime && (
                      <Box display="flex" column paddingRight="5%">
                        <Box>
                          <Icon
                            name="brokenHeart"
                            color={COLORS.red}
                            size={ICON_SIZES.XX_LARGE}
                          />
                          <Text marginBottom={0} bold noWrap>
                            Single Since:
                          </Text>
                        </Box>
                        <Box display="flex" justifyContent="flex-end">
                          {user.singleTime && (
                            <Text
                              style={{
                                marginTop: "0px",
                                paddingBottom: "4px",
                              }}
                              center
                              margin={0}
                            >
                              <Text bold margin={0}>
                                {moment(Number(user.singleTime)).format(
                                  "MM-DD-YYYY"
                                )}{" "}
                              </Text>
                              <Text margin={1} center color={COLORS.red}>
                                (
                                {formatDistanceToNow(
                                  Number(user.singleTime)
                                ).toUpperCase()}
                                )
                              </Text>
                            </Text>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
              {currentSlideIndex === 2 && (
                // Display occupation below the photo slider
                <Box width="100%" padding={10}>
                  <Box column>
                    <Box
                      style={{
                        paddingLeft: 10,
                        borderRadius: 10,
                        height: "fit-content",
                        alignItems: "center",
                      }}
                    >
                      {iconForLabel("Job")}
                      <Text color={COLORS.black} marginLeft={5} bold>
                        {user.occupation}
                      </Text>
                    </Box>

                    <Box
                      style={{
                        paddingLeft: 10,
                        borderRadius: 10,
                        height: "fit-content",
                        alignItems: "center",
                        marginTop: 0,
                        marginBottom: 0,
                      }}
                    >
                      {iconForLabel("Kids")}
                      <Text
                        color={COLORS.black}
                        bold
                        marginLeft={10}
                        marginY={0}
                      >
                        {user.kids}
                      </Text>
                    </Box>
                    <Box
                      style={{
                        paddingLeft: 10,
                        borderRadius: 10,
                        height: "fit-content",
                        alignItems: "center",
                        marginTop: 0,
                        marginBottom: 0,
                      }}
                    >
                      {iconForLabel("Looking For")}

                      <Text
                        color={COLORS.black}
                        bold
                        marginLeft={10}
                        marginY={0}
                      >
                        {user.lookingFor.sex === "Female"
                          ? "Women"
                          : user.lookingFor.sex === "Male"
                          ? "Men"
                          : user.lookingFor.sex === "Gender_Diverse"
                          ? "Gender Diverse"
                          : "Gender Diverse"}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

            {/* View Location Button */}
            <Button
              color={
                user.location && user.location.showOnMap
                  ? COLORS.pink
                  : COLORS.grey
              }
              style={{
                position: "absolute",
                bottom: 10,
                boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
                borderRadius: 10,
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "90%",
              }}
              className="pressable"
              disabled={!(user.location && user.location.showOnMap)}
              onClick={() => handleLocation(user._id, user.location)}
            >
              <Icon
                name={user.location.showOnMap ? "search" : "distance"}
                color={COLORS.white}
                size={ICON_SIZES.X_LARGE}
              />
              <Text color={COLORS.white} margin={0} bold>
                {user.location.showOnMap ? `View Location` : null} - {distance}
              </Text>
            </Button>
          </Box>
        </TinderCard>
      </Fragment>
    );
  }
);

export default SwipeableProfileCard;
