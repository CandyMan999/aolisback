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
      // onClose={handleFormSubmit}
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
                    <Button
                      onClick={() => handleButtonClick("sex", "Male")}
                      color={
                        profile.sex === "Male"
                          ? COLORS.deepPurple
                          : COLORS.lightPurple
                      }
                      style={{
                        ...buttonStyle,
                        transform:
                          profile.sex === "Male" ? "scale(1.15)" : "scale(1)",
                        boxShadow:
                          profile.sex === "Male"
                            ? `2px 2px 4px 2px ${COLORS.pink}`
                            : buttonStyle.boxShadow,
                      }}
                    >
                      Men
                    </Button>
                    <Button
                      onClick={() => handleButtonClick("sex", "Female")}
                      color={
                        profile.sex === "Female"
                          ? COLORS.deepPurple
                          : COLORS.lightPurple
                      }
                      style={{
                        ...buttonStyle,
                        transform:
                          profile.sex === "Female" ? "scale(1.15)" : "scale(1)",
                        boxShadow:
                          profile.sex === "Female"
                            ? `2px 2px 4px 2px ${COLORS.pink}`
                            : buttonStyle.boxShadow,
                      }}
                    >
                      Women
                    </Button>
                    <Button
                      onClick={() => handleButtonClick("sex", "Gender_Diverse")}
                      color={
                        profile.sex === "Gender_Diverse"
                          ? COLORS.deepPurple
                          : COLORS.lightPurple
                      }
                      style={{
                        ...buttonStyle,
                        transform:
                          profile.sex === "Gender_Diverse"
                            ? "scale(1.15)"
                            : "scale(1)",
                        boxShadow:
                          profile.sex === "Gender_Diverse"
                            ? `2px 2px 4px 2px ${COLORS.pink}`
                            : buttonStyle.boxShadow,
                      }}
                    >
                      Gender Diverse
                    </Button>
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
                    <Button
                      onClick={() => handleButtonClick("kids", "Yes")}
                      color={
                        profile.kids === "Yes"
                          ? COLORS.deepPurple
                          : COLORS.lightPurple
                      }
                      style={{
                        ...buttonStyle,
                        transform:
                          profile.kids === "Yes" ? "scale(1.15)" : "scale(1)",
                        boxShadow:
                          profile.kids === "Yes"
                            ? `2px 2px 4px 2px ${COLORS.pink}`
                            : buttonStyle.boxShadow,
                      }}
                    >
                      Open
                    </Button>
                    <Button
                      onClick={() => handleButtonClick("kids", "No")}
                      color={
                        profile.kids === "No"
                          ? COLORS.deepPurple
                          : COLORS.lightPurple
                      }
                      style={{
                        ...buttonStyle,
                        transform:
                          profile.kids === "No" ? "scale(1.15)" : "scale(1)",
                        boxShadow:
                          profile.kids === "No"
                            ? `2px 2px 4px 2px ${COLORS.pink}`
                            : buttonStyle.boxShadow,
                      }}
                    >
                      Deal Breaker
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box
                width={mobile ? "100%" : "60%"}
                justifyContent="center"
                paddingBottom={20}
                marginTop={30}
                // height={mobile ? 60 : 80}
              >
                <Button
                  color={COLORS.black}
                  onClick={handleFormSubmit}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: `2px 2px 4px 2px ${COLORS.pink}`,
                    borderRadius: "20px",
                    height: "60px",
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

const buttonStyle = {
  padding: "10px 20px",
  margin: "10px",
  borderRadius: "8px",
  border: `1px solid ${COLORS.pink}`,
  boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
  textAlign: "center",
  cursor: "pointer",
  width: "fit-content",
  transition: "transform 0.2s, box-shadow 0.2s",
};

export default LookingFor;
