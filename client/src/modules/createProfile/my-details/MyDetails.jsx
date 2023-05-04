import React from "react";
import * as Yup from "yup";
import {
  CollapsableHeader,
  Box,
  Textarea,
  Input,
  Icon,
  ICON_SIZES,
  Button,
  Text,
  FONT_SIZES,
} from "../../../components";
import styled from "styled-components";

import { COLORS } from "../../../constants";
import { Form, Formik, Field } from "formik";

// const validationSchema = Yup.object().shape({
//   sex: Yup.string().required("Gender is required!!"),
//   drink: Yup.string().required("Do You Drink?!"),
//   kids: Yup.string().required("Do you have kids?!"),
//   smoke: Yup.string().required("Do you Smoke?!"),
//   marijuana: Yup.string().required("Pothead Focker?!"),
//   drugs: Yup.string().required("You Party?!"),
// });

const MyDetails = ({
  handleSubmit,
  handleValidation,
  currentUser,
  authError,
  total,
  completed,
  mobile,
}) => {
  return (
    <CollapsableHeader title={"My Details"} total={total} completed={completed}>
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

                <Box
                  column
                  height={200}
                  width="75%"
                  justifyContent="space-between"
                  center
                >
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
                    width={"100%"}
                    justifyContent="space-around"
                    marginY={15}
                  >
                    <Input
                      marginRight={mobile ? 100 : ""}
                      name="age"
                      type="input"
                      placeholder="age"
                    />
                    <Box display="flex" column>
                      <Field as="select" name="sex" style={{ height: 35 }}>
                        <option value="">Select a Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Gender_Diverse">Gender Diverse</option>
                      </Field>
                      {/* {props.errors.sex && props.touched.sex ? (
                        <Text
                          fontSize={FONT_SIZES.SMALL}
                          color={COLORS.textRed}
                        >
                          {props.errors.sex}
                        </Text>
                      ) : null} */}
                    </Box>
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
                  {/* {props.errors.kids && props.touched.kids ? (
                    <Text fontSize={FONT_SIZES.SMALL} color={COLORS.textRed}>
                      {props.errors.kids}
                    </Text>
                  ) : null} */}
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
                  {/* {props.errors.drink && props.touched.drink ? (
                    <Text fontSize={FONT_SIZES.SMALL} color={COLORS.textRed}>
                      {props.errors.drink}
                    </Text>
                  ) : null} */}
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
                  {/* {props.errors.smoke && props.touched.smoke ? (
                    <Text fontSize={FONT_SIZES.SMALL} color={COLORS.textRed}>
                      {props.errors.smoke}
                    </Text>
                  ) : null} */}
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
                  {/* {props.errors.marijuana && props.touched.marijuana ? (
                    <Text fontSize={FONT_SIZES.SMALL} color={COLORS.textRed}>
                      {props.errors.marijuana}
                    </Text>
                  ) : null} */}
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
                  {/* {props.errors.drugs && props.touched.drugs ? (
                    <Text fontSize={FONT_SIZES.SMALL} color={COLORS.textRed}>
                      {props.errors.drugs}
                    </Text>
                  ) : null} */}
                  <Box width="140%" justifyContent="center" paddingBottom={100}>
                    <Button
                      type="submit"
                      disabled={
                        !props.isValid ||
                        props.values.sex === "" ||
                        props.values.drink === "" ||
                        props.values.drugs === "" ||
                        props.values.smoke === "" ||
                        props.values.marijuana === ""
                      }
                      style={{ zIndex: 100, width: "100%" }}
                    >
                      {total === completed ? "Update" : "Submit"}
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
