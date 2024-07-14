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

  const handleSubmit = async () => {
    try {
      setSubmitted(false);
      setLoading(true);
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
        dispatch({ type: "UPDATE_USER", payload: createProfile });
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <CollapsableHeader
      title={"Time Single"}
      onClose={submitted}
      total={total}
      completed={completed}
    >
      <Box column width={"100%"} marginY={15} alignItems="center">
        {profile.singleTime && (
          <Text
            noWrap
            fontSize={FONT_SIZES.X_LARGE}
            color={COLORS.main}
            marginTop={0}
            marginBottom={15}
            bold
          >
            Single Since: {profile.singleTime}
          </Text>
        )}
        <label htmlFor="sobreityTime">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Icon
              size={ICON_SIZES.XX_LARGE}
              name="calendarAdd"
              color={COLORS.main}
            />

            <input
              style={{ margin: "30px" }}
              type="date"
              id="singleTime"
              name="singleTime"
              value={profile.singleTime}
              onChange={handleChange}
            />
          </div>
        </label>
        <Button
          style={{
            display: "flex",
            justifyContent: "center",
            boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
            borderRadius: "10px",
          }}
          width="300px"
          color={COLORS.black}
          onClick={handleSubmit}
        >
          {loading ? (
            <Loading bar color={COLORS.vividBlue} />
          ) : !currentUser.singleTime && !loading ? (
            <Text bold>Submit</Text>
          ) : (
            <Text bold>Update</Text>
          )}
        </Button>
      </Box>
    </CollapsableHeader>
  );
};

export default SingleTime;
