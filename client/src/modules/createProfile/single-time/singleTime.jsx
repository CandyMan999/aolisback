import React, { useState } from "react";
import {
  CollapsableHeader,
  Text,
  Box,
  Button,
  FONT_SIZES,
  Loading,
  Icon,
  ICON_SIZES,
} from "../../../components";
import { COLORS } from "../../../constants";
import { CREATE_PROFILE_MUTATION } from "../../../graphql/mutations";
import moment from "moment";

const SingleTime = ({
  client,
  dispatch,
  profile,
  handleChange,
  currentUser,
  total,
  completed,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setSubmitted(false);
      setLoading(true);
      setError("");

      const valid = await handleValidate(profile.singleTime);

      if (valid) {
        const variables = {
          ...currentUser,
          singleTime: profile.singleTime,
        };

        const { createProfile } = await client.request(
          CREATE_PROFILE_MUTATION,
          variables
        );

        if (createProfile) {
          setSubmitted(true);
          setLoading(false);
          dispatch({
            type: "UPDATE_USER_SINGLE_TIME",
            payload: createProfile.singleTime,
          });
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      setError("An error occurred while submitting the profile.");
    }
  };

  const handleValidate = async (singleTime) => {
    // If singleTime is in the future, return false and set the error message
    if (moment(singleTime).isAfter(moment())) {
      setError("Date cannot be in the future");
      return false;
    }
    return true;
  };

  return (
    <CollapsableHeader
      title={"Time Single"}
      onClose={submitted}
      total={total}
      completed={completed}
    >
      <Box column width={"100%"} marginY={15} alignItems="center">
        <Text
          fontSize={FONT_SIZES.XX_LARGE}
          color={COLORS.main}
          bold
          center
          marginBottom={4}
        >
          When did your single journey begin?
        </Text>
        <Text center bold fontSize={FONT_SIZES.MEDIUM} marginBottom={4}>
          Let other users know how long you have been on the market!
        </Text>
        {profile.singleTime && (
          <Text
            noWrap
            fontSize={FONT_SIZES.X_LARGE}
            color={COLORS.main}
            marginTop={0}
            marginBottom={15}
            bold
          >
            💔 Single for: {moment(profile.singleTime).fromNow(true)}
          </Text>
        )}
        <label htmlFor="singleTime">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Icon
              size={ICON_SIZES.XX_LARGE}
              name="calendarAdd"
              color={COLORS.main}
            />
            <input
              style={{
                margin: "30px",
                padding: "8px",
                borderRadius: "4px",
                borderColor: COLORS.black,
              }}
              type="date"
              id="singleTime"
              name="singleTime"
              value={profile.singleTime}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]} // set max attribute to today's date
            />
          </div>
        </label>
        {error && (
          <Text color={COLORS.darkRed} marginTop={10} marginBottom={10}>
            {error}
          </Text>
        )}
        <Button
          style={{
            display: "flex",
            justifyContent: "center",
            boxShadow: `2px 2px 4px 2px ${COLORS.deepPurple}`,
            borderRadius: "20px", // Match the app's rounded button style
            backgroundColor: COLORS.pink,
            borderColor: COLORS.vividBlue,
            borderWidth: 1,
            width: "80%",
            paddingVertical: 12,
            paddingHorizontal: 24,
            marginTop: 30,
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Loading bar color={COLORS.white} />
          ) : (
            <Text bold color={COLORS.deepPurple} fontSize={FONT_SIZES.LARGE}>
              {!currentUser.singleTime ? "Submit" : "Update"}
            </Text>
          )}
        </Button>
      </Box>
    </CollapsableHeader>
  );
};

export default SingleTime;
