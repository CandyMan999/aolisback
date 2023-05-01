import React from "react";
import {
  CollapsableHeader,
  Box,
  Textarea,
  Input,
  Checkbox,
  Button,
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
}) => {
  return (
    <CollapsableHeader title={"My Details"} total={total} completed={completed}>
      <Box column width={"100%"} height={"100%"}>
        <Formik
          onSubmit={handleSubmit}
          validate={handleValidation}
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
                  <Box marginBottom={15}>
                    <Input
                      name="occupation"
                      type="input"
                      placeholder="occupation"
                    />
                  </Box>
                  <Box marginBottom={15}>
                    <Input name="age" type="input" placeholder="age" />
                  </Box>

                  <div>
                    <Field as="select" name="sex">
                      <option value="">Select a sex</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Gender_Diverse">Gender Diverse</option>
                    </Field>
                  </div>

                  <Box marginY={15}>
                    <Field as="select" name="kids">
                      <option value="">Do You Have Kids</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Field>
                  </Box>

                  <Box marginY={15}>
                    <Field as="select" name="drink">
                      <option value="">Do You Drink</option>
                      <option value="Yes">Yes</option>
                      <option value="Socially">Socially</option>
                      <option value="Never">Never</option>
                    </Field>
                  </Box>

                  <Box marginY={15}>
                    <Field as="select" name="smoke">
                      <option value="">Do You Smoke</option>
                      <option value="Yes">Yes</option>
                      <option value="Socially">Socially</option>
                      <option value="Never">Never</option>
                    </Field>
                  </Box>

                  <Box marginY={15}>
                    <Field as="select" name="marijuana">
                      <option value="">Marijuana Tolerance</option>
                      <option value="Friendly">Friendly</option>
                      <option value="Unfriendly">Unfriendly</option>
                    </Field>
                  </Box>

                  <Box marginY={15}>
                    <Field as="select" name="drugs">
                      <option value="">Do use Drugs</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Recreational">Recreational</option>
                    </Field>
                  </Box>

                  <Box marginBottom={40}>
                    <Button
                      type="submit"
                      disabled={!props.isValid}
                      style={{ zIndex: 100 }}
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
