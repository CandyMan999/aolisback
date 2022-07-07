import React, { useState, useEffect } from "react";
import {
  CollapsableHeader,
  Text,
  Box,
  Button,
  FONT_SIZES,
} from "../../../components";
import { COLORS } from "../../../constants";
import moment from "moment";

import { CREATE_PROFILE_MUTATION } from "../../../graphql/mutations";

const SobrietyTime = ({
  client,
  dispatch,
  mobile,
  profile,
  handleChange,
  currentUser,
}) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
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
        dispatch({ type: "UPDATE_USER", payload: createProfile });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <CollapsableHeader title={"Sobriety Time"} onClose={submitted}>
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
          {!currentUser.sobrietyTime ? "Submit" : "Update"}
        </Button>
      </Box>
    </CollapsableHeader>
  );
};

export default SobrietyTime;
