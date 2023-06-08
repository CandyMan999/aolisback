import React, { useState } from "react";
import { LOOKING_FOR_MUTATION } from "../../../graphql/mutations";
import {
  CollapsableHeader,
  Box,
  Icon,
  ICON_SIZES,
  Button,
  Loading,
  AgeRangeSlider,
  Text,
} from "../../../components";
import { COLORS } from "../../../constants";

const LookingFor = ({
  currentUser,
  authError,
  total,
  completed,
  mobile,
  dispatch,
  client,
}) => {
  const {
    lookingFor: {
      ageRange: { lowEnd, highEnd },
      sex,
      kids,
    },
  } = currentUser;
  const [ageRange, setAgeRange] = useState({
    lowEnd: lowEnd ? lowEnd : 18,
    highEnd: highEnd ? highEnd : 80,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formValues, setFormValues] = useState({
    ageRange: { lowEnd: lowEnd ? lowEnd : 18, highEnd: highEnd ? highEnd : 80 },
    sex: sex ? sex : "",
    kids: kids ? kids : "",
  });

  const handleSliderChange = ([lowEnd, highEnd]) => {
    setAgeRange({ lowEnd, highEnd });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let varibales;
      if (formValues.sex === "") {
        varibales = {
          _id: currentUser._id,
          lowEnd: ageRange.lowEnd,
          highEnd: ageRange.highEnd,
          kids: formValues.kids,
        };
      } else {
        varibales = {
          ...formValues,
          _id: currentUser._id,
          lowEnd: ageRange.lowEnd,
          highEnd: ageRange.highEnd,
        };
      }

      const { lookingFor } = await client.request(
        LOOKING_FOR_MUTATION,
        varibales
      );

      dispatch({ type: "UPDATE_LOOKING_FOR", payload: lookingFor });
      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      setLoading(false);
      console.log("err submitting looking: ", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  return (
    <CollapsableHeader
      title={"Looking For"}
      total={total}
      completed={completed}
      onClose={submitted}
    >
      <Box column width={"100%"} height={"100%"}>
        <form onSubmit={handleSubmit} style={{ height: "100%" }}>
          <Box
            column
            center
            justifyContent="space-between"
            width="100%"
            height="100%"
          >
            {authError && (
              <p style={{ color: COLORS.darkRed, margin: "0px" }}>
                {authError}
              </p>
            )}

            <Box
              column
              height={"fit-content"}
              width="75%"
              justifyContent="space-between"
              center
            >
              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                marginBottom={30}
              >
                <AgeRangeSlider
                  ageRange={ageRange}
                  handleSliderChange={handleSliderChange}
                  name="ageRange"
                  value={{
                    lowEnd: ageRange.lowEnd,
                    highEnd: ageRange.highEnd,
                  }}
                />
              </Box>

              <Box>
                <Icon
                  name="curious"
                  color={COLORS.black}
                  size={ICON_SIZES.XX_LARGE}
                />
                <Box>
                  <select
                    name="sex"
                    value={formValues.sex}
                    onChange={handleChange}
                    style={{ width: 300 }}
                  >
                    <option value="">Interested In</option>
                    <option value="Male">Men</option>
                    <option value="Female">Women</option>
                    <option value="Gender_Diverse">Gender Diverse</option>
                  </select>
                </Box>
              </Box>
            </Box>

            <Box width="100%" justifyContent="center" marginY={15}>
              <Icon
                name="kid"
                color={COLORS.black}
                size={ICON_SIZES.XX_LARGE}
              />
              <select
                name="kids"
                value={formValues.kids}
                onChange={handleChange}
                style={{ width: 300 }}
              >
                <option value="">Kids</option>
                <option value="Yes">Open</option>
                <option value="No">Deal Breaker</option>
              </select>
            </Box>

            <Box width="100%" justifyContent="center" paddingBottom={100}>
              <Button
                type="submit"
                style={{
                  zIndex: 100,
                  marginLeft: mobile ? undefined : 50,
                  display: "flex",
                  justifyContent: "center",
                  boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
                  borderRadius: "10px",
                  width: 150,
                }}
                color="black"
                disabled={loading}
              >
                {loading ? (
                  <Loading bar color={COLORS.themeGreen} />
                ) : sex || kids ? (
                  <Text bold>Update</Text>
                ) : (
                  <Text bold>Submit</Text>
                )}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </CollapsableHeader>
  );
};

export default LookingFor;
