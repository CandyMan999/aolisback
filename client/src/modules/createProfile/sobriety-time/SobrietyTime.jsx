import React, { useState } from "react";
import {
  CollapsableHeader,
  Text,
  Box,
  Button,
  FONT_SIZES,
  Loading,
} from "../../../components";
import { COLORS } from "../../../constants";

import { CREATE_PROFILE_MUTATION } from "../../../graphql/mutations";

const SobrietyTime = ({
  client,
  dispatch,
  mobile,
  profile,
  handleChange,
  currentUser,
  total,
  completed,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitted(false);
      setLoading(true);
      const variables = {
        ...currentUser,
        sobrietyTime: profile.sobrietyTime,
      };

      const { createProfile } = await client.request(
        CREATE_PROFILE_MUTATION,
        variables
      );

      if (createProfile) {
        setSubmitted(true);
        setLoading(false);
        dispatch({ type: "UPDATE_USER", payload: createProfile });
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <CollapsableHeader
      title={"Sobriety Time"}
      onClose={submitted}
      total={total}
      completed={completed}
    >
      <Box column width={"100%"} marginY={15} alignItems="center">
        {" "}
        {profile.sobrietyTime && (
          <Text
            fontSize={FONT_SIZES.X_LARGE}
            color={COLORS.vividBlue}
            marginTop={0}
            marginBottom={15}
          >
            Sober Since {profile.sobrietyTime}
          </Text>
        )}{" "}
        <label htmlFor="sobreityTime">
          SobrietyTime:{" "}
          <input
            style={{ margin: "30px" }}
            type="date"
            id="sobrietyTime"
            name="sobrietyTime"
            value={profile.sobrietyTime}
            onChange={handleChange}
          />
        </label>
        <Button padding={30} onClick={handleSubmit}>
          {loading ? (
            <Loading bar color={COLORS.themeGreen} />
          ) : !currentUser.sobrietyTime && !loading ? (
            "Submit"
          ) : (
            "Update"
          )}
        </Button>
      </Box>
    </CollapsableHeader>
  );
};

export default SobrietyTime;
