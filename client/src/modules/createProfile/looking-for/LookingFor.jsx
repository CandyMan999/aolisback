import React, { useState, useEffect } from "react";
import {
  CollapsableHeader,
  Box,
  Button,
  Loading,
  Text,
  Icon,
  ICON_SIZES,
  FONT_SIZES,
  AgeRangeSlider,
  MotionButton,
} from "../../../components";
import { LOOKING_FOR_MUTATION } from "../../../graphql/mutations";
import { COLORS } from "../../../constants";
import { FaLastfmSquare, FaVenusMars } from "react-icons/fa";

const LookingFor = ({
  handleSubmit,
  handleValidation,
  currentUser,
  authError,
  total,
  completed,
  mobile,
  dispatch,
  client,
}) => {
  const initialProfileState = {
    ageRange: {
      lowEnd: currentUser.lookingFor.ageRange.lowEnd || 18,
      highEnd: currentUser.lookingFor.ageRange.highEnd || 80,
    },
    sex: currentUser.lookingFor.sex || "",
    kids: currentUser.lookingFor.kids || "",
  };

  const [profile, setProfile] = useState(initialProfileState);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSliderChange = ([lowEnd, highEnd]) => {
    setProfile((prevState) => ({
      ...prevState,
      ageRange: { lowEnd, highEnd },
    }));
  };

  const handleButtonClick = (field, value) => {
    setProfile((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const variables = {
        _id: currentUser._id,
        lowEnd: profile.ageRange.lowEnd,
        highEnd: profile.ageRange.highEnd,
        sex: profile.sex,
        kids: profile.kids,
      };

      const { lookingFor } = await client.request(
        LOOKING_FOR_MUTATION,
        variables
      );
      dispatch({ type: "UPDATE_LOOKING_FOR", payload: lookingFor });
      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      setLoading(false);
      console.error("Error submitting lookingFor: ", err);
    }
  };

  const isDisabled = !profile.sex || !profile.kids;

  return (
    <CollapsableHeader
      title={"Looking For"}
      total={total}
      completed={completed}
      onClose={submitted}
    >
      <Box column width={"100%"} height={"100%"}>
        <Box
          column
          center
          justifyContent="space-between"
          width="100%"
          height="100%"
        >
          {authError && (
            <Text color={COLORS.darkRed} margin="0px">
              {authError}
            </Text>
          )}
          <Box column width="90%" justifyContent="space-between" center>
            <Box display="flex" column alignItems="center" width="100%">
              <Text
                bold
                marginBottom={20}
                fontSize={FONT_SIZES.XX_LARGE}
                color={COLORS.main}
              >
                Tell us what you are looking for ?
              </Text>
              <Text fontSize={FONT_SIZES.MEDIUM} marginBottom={30} bold center>
                Specify your preferences. Note that you will only be shown users
                who are also looking for someone like you.
              </Text>

              <Box alignItems="center" marginY={15} width="100%">
                <AgeRangeSlider
                  ageRange={profile.ageRange}
                  handleSliderChange={handleSliderChange}
                />
              </Box>

              <Box display="flex" column alignItems="center">
                <Box alignItems="center">
                  <FaVenusMars
                    color={COLORS.pink}
                    size={24}
                    style={{ marginRight: "10px" }}
                  />
                  <Text bold fontSize={FONT_SIZES.X_LARGE} marginBottom={0}>
                    Sex
                  </Text>
                </Box>
                <Box display="flex" alignItems="center" width="100%">
                  <Box display="flex" justifyContent="center" width="100%">
                    <MotionButton
                      onClick={() => handleButtonClick("sex", "Male")}
                      isSelected={profile.sex === "Male"}
                    >
                      Male
                    </MotionButton>

                    <MotionButton
                      onClick={() => handleButtonClick("sex", "Female")}
                      isSelected={profile.sex === "Female"}
                    >
                      Female
                    </MotionButton>

                    <MotionButton
                      onClick={() => handleButtonClick("sex", "Gender_Diverse")}
                      isSelected={profile.sex === "Gender_Diverse"}
                    >
                      Gender Diverse
                    </MotionButton>
                  </Box>
                </Box>
              </Box>

              <Box display="flex" column alignItems="center">
                <Box alignItems="center">
                  <Icon
                    name="kid"
                    color={COLORS.pink}
                    size={ICON_SIZES.XX_LARGE}
                  />
                  <Text bold fontSize={FONT_SIZES.X_LARGE} marginBottom={0}>
                    Kids
                  </Text>
                </Box>
                <Box display="flex" alignItems="center" width="100%">
                  <Box display="flex" justifyContent="center" width="100%">
                    <MotionButton
                      onClick={() => handleButtonClick("kids", "Yes")}
                      isSelected={profile.kids === "Yes"}
                    >
                      Open
                    </MotionButton>

                    <MotionButton
                      onClick={() => handleButtonClick("kids", "No")}
                      isSelected={profile.kids === "No"}
                    >
                      Deal Breaker
                    </MotionButton>
                  </Box>
                </Box>
              </Box>

              <Box
                width={mobile ? "100%" : "60%"}
                justifyContent="center"
                paddingBottom={20}
                marginTop={30}
              >
                <Button
                  color={COLORS.black}
                  onClick={handleFormSubmit}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: `0px 2px 10px ${COLORS.pink}`,
                    borderRadius: "20px",
                    height: "60px",
                    border: `solid 1px ${COLORS.pink}`,
                  }}
                  width="80%"
                  disabled={isDisabled}
                >
                  {loading ? (
                    <Loading bar color={COLORS.vividBlue} />
                  ) : (
                    <Text bold color={COLORS.pink}>
                      Submit
                    </Text>
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </CollapsableHeader>
  );
};

export default LookingFor;
