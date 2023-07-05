import React from "react";

import {
  CollapsableHeader,
  Box,
  Textarea,
  Input,
  Icon,
  ICON_SIZES,
  Button,
  Loading,
  Text,
} from "../../../components";

import { COLORS } from "../../../constants";
import { Form, Formik, Field } from "formik";

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
  return (
    <CollapsableHeader
      title={"My Details"}
      total={total}
      completed={completed}
      onClose={submitted}
    >
      <Box column width={"100%"} height={"100%"}>
        <Formik
          onSubmit={handleSubmit}
          validate={handleValidation}
          // validationSchema={validationSchema}
          initialValues={{
            intro: currentUser.intro ? currentUser.intro : "",
            age: currentUser.age ? currentUser.age : "",
            occupation: currentUser.occupation ? currentUser.occupation : "",
            sex: currentUser.sex ? currentUser.sex : "",
            drink: currentUser.drink ? currentUser.drink : "",
            smoke: currentUser.smoke ? currentUser.smoke : "",
            marijuana: currentUser.marijuana ? currentUser.marijuana : "",
            drugs: currentUser.drugs ? currentUser.drugs : "",
            kids: currentUser.kids ? currentUser.kids : "",
          }}
          render={(props) => (
            <Form style={{ height: "100%" }}>
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

                <Box column width="75%" justifyContent="space-between" center>
                  <Textarea
                    width={"90%"}
                    maxLength={400}
                    name="intro"
                    placeholder="intro"
                    type="input"
                    height={300}
                  />
                  <Box
                    display="flex"
                    // width={"100%"}
                    justifyContent="space-around"
                    marginY={15}
                  >
                    <Input
                      marginRight={mobile ? 50 : ""}
                      name="age"
                      type="input"
                      placeholder="age"
                    />

                    <Field as="select" name="sex">
                      <option value="">Select a Sex</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Gender_Diverse">Gender Diverse</option>
                    </Field>
                  </Box>
                  <Box width="100%" justifyContent="center" marginBottom={15}>
                    <Icon
                      name="job"
                      color={COLORS.black}
                      size={ICON_SIZES.XX_LARGE}
                    />
                    <Input
                      name="occupation"
                      type="input"
                      placeholder="occupation"
                      width={mobile ? 200 : 280}
                    />
                  </Box>
                  <Box width="100%" justifyContent="center" marginY={15}>
                    <Icon
                      name="kid"
                      color={COLORS.black}
                      size={ICON_SIZES.XX_LARGE}
                    />
                    <Field as="select" name="kids" style={{ width: 300 }}>
                      <option value="">Do You Have Kids</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Field>
                  </Box>

                  <Box width="100%" justifyContent="center" marginY={15}>
                    <Icon
                      name="beer"
                      color={COLORS.black}
                      size={ICON_SIZES.XX_LARGE}
                    />

                    <Field as="select" name="drink" style={{ width: 300 }}>
                      <option value="">Do You Drink</option>
                      <option value="Yes">Yes</option>
                      <option value="Socially">Socially</option>
                      <option value="Never">Never</option>
                    </Field>
                  </Box>

                  <Box width="100%" justifyContent="center" marginY={15}>
                    <Icon
                      name="smoke"
                      color={COLORS.textRed}
                      size={ICON_SIZES.XX_LARGE}
                    />
                    <Field as="select" name="smoke" style={{ width: 300 }}>
                      <option value="">Do You Smoke</option>
                      <option value="Yes">Yes</option>
                      <option value="Socially">Socially</option>
                      <option value="Never">Never</option>
                    </Field>
                  </Box>

                  <Box width="100%" justifyContent="center" marginY={15}>
                    <Icon
                      name="weed"
                      color={COLORS.green}
                      size={ICON_SIZES.XX_LARGE}
                    />
                    <Field as="select" name="marijuana" style={{ width: 300 }}>
                      <option value="">Marijuana Tolerance</option>
                      <option value="Friendly">Friendly</option>
                      <option value="Unfriendly">Unfriendly</option>
                    </Field>
                  </Box>

                  <Box width="100%" justifyContent="center" marginY={15}>
                    <Icon
                      name="drugs"
                      color={COLORS.green}
                      size={ICON_SIZES.XX_LARGE}
                    />
                    <Field as="select" name="drugs" style={{ width: 300 }}>
                      <option value="">Drug Use</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Recreational">Recreational</option>
                    </Field>
                  </Box>

                  <Box
                    width={mobile ? "140%" : "60%"}
                    justifyContent="center"
                    paddingBottom={100}
                    height={mobile ? 60 : 80}
                  >
                    <Button
                      type="submit"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
                        borderRadius: "10px",
                      }}
                      width="100%"
                      disabled={
                        !props.isValid ||
                        props.values.sex === "" ||
                        props.values.drink === "" ||
                        props.values.drugs === "" ||
                        props.values.smoke === "" ||
                        props.values.kids === "" ||
                        props.values.marijuana === ""
                      }
                    >
                      {loading ? (
                        <Loading bar color={COLORS.themeGreen} />
                      ) : props.values.sex === "" ||
                        props.values.kids === "" ||
                        props.values.drink === "" ||
                        props.values.drugs === "" ||
                        props.values.smoke === "" ||
                        props.values.marijuana === "" ? (
                        "Missing Values"
                      ) : total === completed ? (
                        <Text bold>Update</Text>
                      ) : (
                        <Text bold>Submit</Text>
                      )}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Form>
          )}
        />
      </Box>
    </CollapsableHeader>
  );
};

export default MyDetails;
