import React from "react";
import {
  CollapsableHeader,
  Box,
  Textarea,
  Input,
  Checkbox,
  Button,
} from "../../../components";
import { Formik, Form } from "formik";
import { COLORS } from "../../../constants";

const MyDetails = ({
  profile,
  handleChange,
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
        <Box column width={"100%"} alignItems="center">
          <label htmlFor="sex" style={{ marginTop: 2, marginBottom: 8 }}>
            Gender:{" "}
            <select
              id="sex"
              name="sex"
              value={profile.sex}
              onChange={handleChange}
            >
              <option value={"male"}>male</option>
              <option value={"female"}>female</option>
            </select>
          </label>
          <label htmlFor="kids" style={{ marginBottom: 8 }}>
            I Have Kids:{" "}
            <select
              id="kids"
              name="kids"
              onChange={handleChange}
              value={profile.kids}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </label>
        </Box>
        <Formik
          onSubmit={handleSubmit}
          validate={handleValidation}
          initialValues={{
            intro: currentUser.intro ? currentUser.intro : "",
            age: currentUser.age ? currentUser.age : "",
            occupation: currentUser.occupation ? currentUser.occupation : "",
            sponsor: currentUser.sponsor ? currentUser.sponsor : false,
            sponsee: currentUser.sponsee ? currentUser.sponsee : false,
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
                    maxLength={140}
                    name="intro"
                    placeholder="intro"
                    type="input"
                    height={300}
                  />
                  <Box marginBottom={15}>
                    {" "}
                    <Input
                      name="occupation"
                      type="input"
                      placeholder="occupation"
                    />
                  </Box>

                  <Input name="age" type="input" placeholder="age" />
                  <Checkbox
                    label="I am willing to be a sponsor"
                    type="checkbox"
                    id="sponsor"
                    name="sponsor"
                  />
                  <Checkbox
                    label="I am willing to be a sponsee"
                    type="checkbox"
                    id="sponsee"
                    name="sponsee"
                  />
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
