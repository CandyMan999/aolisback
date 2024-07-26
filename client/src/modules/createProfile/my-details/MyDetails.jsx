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
} from "../../../components";
import { COLORS } from "../../../constants";
import { FaBirthdayCake, FaVenusMars } from "react-icons/fa";
import { IoIosMicrophone } from "react-icons/io";

const MyDetails = ({
  handleSubmit,
  handleValidation,
  currentUser,
  authError,
  total,
  completed,
  mobile,
  submitted,
  loading,
}) => {
  const initialProfileState = {
    intro: currentUser.intro || "",
    age: currentUser.age || "",
    occupation: currentUser.occupation || "",
    sex: currentUser.sex || "",
    drink: currentUser.drink || "",
    smoke: currentUser.smoke || "",
    marijuana: currentUser.marijuana || "",
    drugs: currentUser.drugs || "",
    kids: currentUser.kids || "",
  };

  const [profile, setProfile] = useState(initialProfileState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors(handleValidation(profile));
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleButtonClick = (field, value) => {
    setProfile((prevState) => ({ ...prevState, [field]: value }));
  };

  const isDisabled =
    !profile.sex ||
    !profile.drink ||
    !profile.drugs ||
    !profile.smoke ||
    !profile.kids ||
    !profile.marijuana ||
    Object.keys(errors).length > 0;

  return (
    <CollapsableHeader
      title={"My Details"}
      total={total}
      completed={completed}
      onClose={submitted}
    >
      <Box
        column
        width={"100%"}
        height={"100%"}
        // style={{ overflowX: "hidden" }}
      >
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
              <Box alignItems={"center"}>
                <IoIosMicrophone
                  color={COLORS.pink}
                  size={24}
                  style={{ marginRight: "10px" }}
                />
                <Text bold fontSize={FONT_SIZES.X_LARGE}>
                  Intro
                </Text>
              </Box>

              <textarea
                name="intro"
                placeholder="Tell us about yourself"
                value={profile.intro}
                onChange={handleChange}
                style={{
                  height: "200px",
                  width: "100%",
                  maxLength: 500,
                  padding: "10px",
                  borderRadius: "8px",
                  borderColor: COLORS.deepPurple,
                  borderWidth: "2px",
                  backgroundColor: COLORS.lightPurple,
                }}
              />
              {errors.intro && (
                <Text color={COLORS.darkRed}>{errors.intro}</Text>
              )}
            </Box>

            <Box display="flex" column alignItems="center">
              <Box alignItems="center">
                <FaBirthdayCake
                  color={COLORS.pink}
                  size={24}
                  style={{ marginRight: "10px" }}
                />
                <Text bold fontSize={FONT_SIZES.X_LARGE}>
                  Age
                </Text>
              </Box>
              <Box display="flex" alignItems="center" width="100%">
                <input
                  name="age"
                  type="number"
                  placeholder="Age"
                  value={profile.age}
                  onChange={handleChange}
                  style={{
                    width: mobile ? "200px" : "280px",
                    padding: "10px",
                    borderRadius: "8px",
                    borderColor: COLORS.deepPurple,
                    borderWidth: "2px",
                    backgroundColor: COLORS.lightPurple,
                  }}
                />
              </Box>
              {errors.age && <Text color={COLORS.darkRed}>{errors.age}</Text>}
            </Box>
            <Box display="flex" column alignItems="center">
              <Box alignItems="center">
                <Icon
                  name="job"
                  color={COLORS.pink}
                  size={ICON_SIZES.XX_LARGE}
                />
                <Text bold fontSize={FONT_SIZES.X_LARGE}>
                  Occupation
                </Text>
              </Box>

              <Box display="flex" alignItems="center" width="100%">
                <input
                  name="occupation"
                  type="text"
                  placeholder="Occupation"
                  value={profile.occupation}
                  onChange={handleChange}
                  style={{
                    width: mobile ? "200px" : "280px",
                    padding: "10px",
                    borderRadius: "8px",
                    borderColor: COLORS.deepPurple,
                    borderWidth: "2px",
                    backgroundColor: COLORS.lightPurple,
                  }}
                />
              </Box>
              {errors.occupation && (
                <Text color={COLORS.darkRed}>{errors.occupation}</Text>
              )}
            </Box>

            <Box display="flex" column alignItems="center">
              <Box alignItems="center">
                <FaVenusMars
                  color={COLORS.pink}
                  size={24}
                  style={{ marginRight: "10px" }}
                />
                <Text bold fontSize={FONT_SIZES.X_LARGE}>
                  Select Gender
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
                    Male
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
                    Female
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
              {errors.sex && <Text color={COLORS.darkRed}>{errors.sex}</Text>}
            </Box>

            <Box display="flex" column alignItems="center">
              <Box>
                <Icon
                  name="kid"
                  color={COLORS.pink}
                  size={ICON_SIZES.XX_LARGE}
                />{" "}
                <Text bold fontSize={FONT_SIZES.X_LARGE}>
                  Do You Have Kids
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
                    Yes
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
                    No
                  </Button>
                </Box>
              </Box>
              {errors.kids && <Text color={COLORS.darkRed}>{errors.kids}</Text>}
            </Box>

            <Box display="flex" column alignItems="center" width="100%">
              <Box alignItems="center">
                <Text
                  margin={0}
                  paddingRight={10}
                  fontSize={FONT_SIZES.XX_LARGE}
                >
                  🥃
                </Text>
                <Text bold fontSize={FONT_SIZES.X_LARGE}>
                  Do You Drink
                </Text>
              </Box>
              <Box display="flex" alignItems="center" width="100%">
                <Box display="flex" justifyContent="center" width="100%">
                  <Button
                    onClick={() => handleButtonClick("drink", "Yes")}
                    color={
                      profile.drink === "Yes"
                        ? COLORS.deepPurple
                        : COLORS.lightPurple
                    }
                    style={{
                      ...buttonStyle,
                      transform:
                        profile.drink === "Yes" ? "scale(1.15)" : "scale(1)",
                      boxShadow:
                        profile.drink === "Yes"
                          ? `2px 2px 4px 2px ${COLORS.pink}`
                          : buttonStyle.boxShadow,
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => handleButtonClick("drink", "Socially")}
                    color={
                      profile.drink === "Socially"
                        ? COLORS.deepPurple
                        : COLORS.lightPurple
                    }
                    style={{
                      ...buttonStyle,
                      transform:
                        profile.drink === "Socially"
                          ? "scale(1.15)"
                          : "scale(1)",
                      boxShadow:
                        profile.drink === "Socially"
                          ? `2px 2px 4px 2px ${COLORS.pink}`
                          : buttonStyle.boxShadow,
                    }}
                  >
                    Socially
                  </Button>
                  <Button
                    onClick={() => handleButtonClick("drink", "Never")}
                    color={
                      profile.drink === "Never"
                        ? COLORS.deepPurple
                        : COLORS.lightPurple
                    }
                    style={{
                      ...buttonStyle,
                      transform:
                        profile.drink === "Never" ? "scale(1.15)" : "scale(1)",
                      boxShadow:
                        profile.drink === "Never"
                          ? `2px 2px 4px 2px ${COLORS.pink}`
                          : buttonStyle.boxShadow,
                    }}
                  >
                    Never
                  </Button>
                </Box>
              </Box>
              {errors.drink && (
                <Text color={COLORS.darkRed}>{errors.drink}</Text>
              )}
            </Box>

            <Box display="flex" column alignItems="center">
              <Box alignItems="center">
                <Text
                  margin={0}
                  paddingRight={10}
                  fontSize={FONT_SIZES.XX_LARGE}
                >
                  🚬
                </Text>
                <Text bold fontSize={FONT_SIZES.X_LARGE}>
                  Do You Smoke
                </Text>
              </Box>
              <Box display="flex" alignItems="center" width="100%">
                <Box display="flex" justifyContent="center" width="100%">
                  <Button
                    onClick={() => handleButtonClick("smoke", "Yes")}
                    color={
                      profile.smoke === "Yes"
                        ? COLORS.deepPurple
                        : COLORS.lightPurple
                    }
                    style={{
                      ...buttonStyle,
                      transform:
                        profile.smoke === "Yes" ? "scale(1.15)" : "scale(1)",
                      boxShadow:
                        profile.smoke === "Yes"
                          ? `2px 2px 4px 2px ${COLORS.pink}`
                          : buttonStyle.boxShadow,
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => handleButtonClick("smoke", "Socially")}
                    color={
                      profile.smoke === "Socially"
                        ? COLORS.deepPurple
                        : COLORS.lightPurple
                    }
                    style={{
                      ...buttonStyle,
                      transform:
                        profile.smoke === "Socially"
                          ? "scale(1.15)"
                          : "scale(1)",
                      boxShadow:
                        profile.smoke === "Socially"
                          ? `2px 2px 4px 2px ${COLORS.pink}`
                          : buttonStyle.boxShadow,
                    }}
                  >
                    Socially
                  </Button>
                  <Button
                    onClick={() => handleButtonClick("smoke", "Never")}
                    color={
                      profile.smoke === "Never"
                        ? COLORS.deepPurple
                        : COLORS.lightPurple
                    }
                    style={{
                      ...buttonStyle,
                      transform:
                        profile.smoke === "Never" ? "scale(1.15)" : "scale(1)",
                      boxShadow:
                        profile.smoke === "Never"
                          ? `2px 2px 4px 2px ${COLORS.pink}`
                          : buttonStyle.boxShadow,
                    }}
                  >
                    Never
                  </Button>
                </Box>
              </Box>
              {errors.smoke && (
                <Text color={COLORS.darkRed}>{errors.smoke}</Text>
              )}
            </Box>

            <Box display="flex" column alignItems="center" width="100%">
              <Box>
                <Icon
                  name="weed"
                  color={COLORS.green}
                  size={ICON_SIZES.XX_LARGE}
                />
                <Text bold fontSize={FONT_SIZES.X_LARGE}>
                  Marijuana Tolerance
                </Text>
              </Box>
              <Box display="flex" alignItems="center" width="100%">
                <Box display="flex" justifyContent="center" width="100%">
                  <Button
                    onClick={() => handleButtonClick("marijuana", "Friendly")}
                    color={
                      profile.marijuana === "Friendly"
                        ? COLORS.deepPurple
                        : COLORS.lightPurple
                    }
                    style={{
                      ...buttonStyle,
                      transform:
                        profile.marijuana === "Friendly"
                          ? "scale(1.15)"
                          : "scale(1)",
                      boxShadow:
                        profile.marijuana === "Friendly"
                          ? `2px 2px 4px 2px ${COLORS.pink}`
                          : buttonStyle.boxShadow,
                    }}
                  >
                    Friendly
                  </Button>
                  <Button
                    onClick={() => handleButtonClick("marijuana", "Unfriendly")}
                    color={
                      profile.marijuana === "Unfriendly"
                        ? COLORS.deepPurple
                        : COLORS.lightPurple
                    }
                    style={{
                      ...buttonStyle,
                      transform:
                        profile.marijuana === "Unfriendly"
                          ? "scale(1.15)"
                          : "scale(1)",
                      boxShadow:
                        profile.marijuana === "Unfriendly"
                          ? `2px 2px 4px 2px ${COLORS.pink}`
                          : buttonStyle.boxShadow,
                    }}
                  >
                    Unfriendly
                  </Button>
                </Box>
              </Box>
              {errors.marijuana && (
                <Text color={COLORS.darkRed}>{errors.marijuana}</Text>
              )}
            </Box>

            <Box
              display="flex"
              column
              alignItems="center"
              marginBottom={40}
              width="100%"
            >
              <Box>
                <Icon
                  name="drugs"
                  color={COLORS.green}
                  size={ICON_SIZES.XX_LARGE}
                />
                <Text bold fontSize={FONT_SIZES.X_LARGE}>
                  Drug Use
                </Text>
              </Box>

              <Box display="flex" alignItems="center" width="100%">
                <Box display="flex" justifyContent="center" width="100%">
                  <Button
                    onClick={() => handleButtonClick("drugs", "Yes")}
                    color={
                      profile.drugs === "Yes"
                        ? COLORS.deepPurple
                        : COLORS.lightPurple
                    }
                    style={{
                      ...buttonStyle,
                      transform:
                        profile.drugs === "Yes" ? "scale(1.15)" : "scale(1)",
                      boxShadow:
                        profile.drugs === "Yes"
                          ? `2px 2px 4px 2px ${COLORS.pink}`
                          : buttonStyle.boxShadow,
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => handleButtonClick("drugs", "No")}
                    color={
                      profile.drugs === "No"
                        ? COLORS.deepPurple
                        : COLORS.lightPurple
                    }
                    style={{
                      ...buttonStyle,
                      transform:
                        profile.drugs === "No" ? "scale(1.15)" : "scale(1)",
                      boxShadow:
                        profile.drugs === "No"
                          ? `2px 2px 4px 2px ${COLORS.pink}`
                          : buttonStyle.boxShadow,
                    }}
                  >
                    No
                  </Button>
                  <Button
                    onClick={() => handleButtonClick("drugs", "Recreational")}
                    color={
                      profile.drugs === "Recreational"
                        ? COLORS.deepPurple
                        : COLORS.lightPurple
                    }
                    style={{
                      ...buttonStyle,
                      transform:
                        profile.drugs === "Recreational"
                          ? "scale(1.15)"
                          : "scale(1)",
                      boxShadow:
                        profile.drugs === "Recreational"
                          ? `2px 2px 4px 2px ${COLORS.pink}`
                          : buttonStyle.boxShadow,
                    }}
                  >
                    Recreational
                  </Button>
                </Box>
              </Box>
              {errors.drugs && (
                <Text color={COLORS.darkRed}>{errors.drugs}</Text>
              )}
            </Box>

            <Box
              width={mobile ? "100%" : "60%"}
              justifyContent="center"
              paddingBottom={20}
              height={mobile ? 60 : 80}
            >
              <Button
                color={COLORS.black}
                onClick={() => handleSubmit(profile)}
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
                ) : isDisabled ? (
                  "Missing Values"
                ) : total === completed ? (
                  <Text bold color={COLORS.pink}>
                    Update
                  </Text>
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

export default MyDetails;
