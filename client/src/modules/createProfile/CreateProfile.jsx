import React, {
  Component,
  Fragment,
  useState,
  useContext,
  useEffect,
} from "react";
import { Redirect } from "react-router-dom";
import moment from "moment";
import {
  Box,
  Input,
  Button,
  CheckboxGroup,
  Textarea,
  Select,
  Loading,
  Checkbox,
  Text,
} from "../../components";
import { Formik, Form } from "formik";
import { COLORS } from "../../constants";

import { CREATE_PROFILE_MUTATION } from "../../graphql/mutations";

import { useClient } from "../../client";
import Context from "../../context";

const CreateProfile = ({}) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const { currentUser } = state;
  const [authError, setAuthError] = useState("");
  const [profile, setProfile] = useState({
    sex: currentUser.sex ? currentUser.sex : "male",
    sobrietyTime: currentUser.sobrietyTime
      ? moment(Number(currentUser.sobrietyTime)).format("MM/DD/YYYY")
      : "",
    kids: currentUser.kids ? currentUser.kids : false,
  });
  const [spinner, setSpinner] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async ({ intro, occupation, age, sponsor, sponsee }) => {
    const { sex, sobrietyTime, kids } = profile;

    try {
      setSpinner(true);
      const variables = {
        _id: state.currentUser._id,
        intro,
        sex,
        age,
        occupation,
        sobrietyTime,
        sponsee,
        sponsor,
        kids,
      };
      const { createProfile } = await client.request(
        CREATE_PROFILE_MUTATION,
        variables
      );

      if (createProfile) {
        setSpinner(false);
        setSuccess(true);
        dispatch({ type: "UPDATE_USER", payload: createProfile });
      }
    } catch (err) {
      setSpinner(false);
      setAuthError(err.response.errors[0].message);
    }
  };

  const handleValidation = (values) => {
    const err = {};
    if (!values.age.length) err.age = "required";
    if (values.age) {
      if (!(Number(values.age) > 0.5)) err.age = "Age Must be a number";
    }
    if (!values.intro.length) {
      err.intro = "Tell us about you loser";
    }
    if (!values.occupation.length)
      err.occupation = "If you aint got a job, then lie";

    return err;
  };

  const handleChange = (e) => {
    let updatedValue = e.currentTarget.value;
    if (updatedValue === "true" || updatedValue == "false") {
      updatedValue = JSON.parse(updatedValue);
    }

    setProfile({ ...profile, [e.target.name]: updatedValue });
  };

  return (
    <Fragment>
      {success && <Redirect to="/" />}
      {spinner ? (
        <Loading grid color={COLORS.themeGreen} size={60} />
      ) : (
        <Fragment>
          <Box
            display="flex"
            column
            justifyContent="center"
            alignItems="center"
          >
            <h3>Create Profile</h3>
            {profile.sobrietyTime && (
              <Text color={COLORS.themeGreen} margin={0}>
                Sober Since {profile.sobrietyTime}
              </Text>
            )}
            <label htmlFor="sobreityTime">
              SobrietyTime:{" "}
              <input
                type="date"
                id="sobrietyTime"
                name="sobrietyTime"
                value={profile.sobrietyTime}
                placeholder={profile.sobrietyTime}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="sex">
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

            <label htmlFor="kids">
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
                  marginBottom={16}
                >
                  {authError && (
                    <p style={{ color: COLORS.darkRed, margin: "0px" }}>
                      {authError}
                    </p>
                  )}

                  <Box
                    column
                    height={260}
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
                    />{" "}
                    <Input
                      marginBottom={15}
                      name="occupation"
                      type="input"
                      placeholder="occupation"
                    />
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
                    <Button
                      type="submit"
                      disabled={!props.isValid || !props.dirty}
                      style={{ zIndex: 100 }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Form>
            )}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default CreateProfile;
