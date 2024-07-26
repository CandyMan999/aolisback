import React, { useState, useEffect } from "react";
import {
  CollapsableHeader,
  Box,
  Loading,
  Text,
  Icon,
  ICON_SIZES,
  FONT_SIZES,
  MotionButton,
  Button,
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
                  <MotionButton
                    isSelected={profile.sex === "Male"}
                    onClick={() => handleButtonClick("sex", "Male")}
                  >
                    Male
                  </MotionButton>
                  <MotionButton
                    isSelected={profile.sex === "Female"}
                    onClick={() => handleButtonClick("sex", "Female")}
                  >
                    Female
                  </MotionButton>
                  <MotionButton
                    isSelected={profile.sex === "Gender_Diverse"}
                    onClick={() => handleButtonClick("sex", "Gender_Diverse")}
                  >
                    Gender Diverse
                  </MotionButton>
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
                  <MotionButton
                    isSelected={profile.kids === "Yes"}
                    onClick={() => handleButtonClick("kids", "Yes")}
                  >
                    Yes
                  </MotionButton>
                  <MotionButton
                    isSelected={profile.kids === "No"}
                    onClick={() => handleButtonClick("kids", "No")}
                  >
                    No
                  </MotionButton>
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
                  <MotionButton
                    isSelected={profile.drink === "Yes"}
                    onClick={() => handleButtonClick("drink", "Yes")}
                  >
                    Yes
                  </MotionButton>
                  <MotionButton
                    isSelected={profile.drink === "Socially"}
                    onClick={() => handleButtonClick("drink", "Socially")}
                  >
                    Socially
                  </MotionButton>
                  <MotionButton
                    isSelected={profile.drink === "Never"}
                    onClick={() => handleButtonClick("drink", "Never")}
                  >
                    Never
                  </MotionButton>
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
                  <MotionButton
                    isSelected={profile.smoke === "Yes"}
                    onClick={() => handleButtonClick("smoke", "Yes")}
                  >
                    Yes
                  </MotionButton>
                  <MotionButton
                    isSelected={profile.smoke === "Socially"}
                    onClick={() => handleButtonClick("smoke", "Socially")}
                  >
                    Socially
                  </MotionButton>
                  <MotionButton
                    isSelected={profile.smoke === "Never"}
                    onClick={() => handleButtonClick("smoke", "Never")}
                  >
                    Never
                  </MotionButton>
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
                  <MotionButton
                    isSelected={profile.marijuana === "Friendly"}
                    onClick={() => handleButtonClick("marijuana", "Friendly")}
                  >
                    Friendly
                  </MotionButton>
                  <MotionButton
                    isSelected={profile.marijuana === "Unfriendly"}
                    onClick={() => handleButtonClick("marijuana", "Unfriendly")}
                  >
                    Unfriendly
                  </MotionButton>
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
                  <MotionButton
                    isSelected={profile.drugs === "Yes"}
                    onClick={() => handleButtonClick("drugs", "Yes")}
                  >
                    Yes
                  </MotionButton>
                  <MotionButton
                    isSelected={profile.drugs === "No"}
                    onClick={() => handleButtonClick("drugs", "No")}
                  >
                    No
                  </MotionButton>
                  <MotionButton
                    isSelected={profile.drugs === "Recreational"}
                    onClick={() => handleButtonClick("drugs", "Recreational")}
                  >
                    Recreational
                  </MotionButton>
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

export default MyDetails;
