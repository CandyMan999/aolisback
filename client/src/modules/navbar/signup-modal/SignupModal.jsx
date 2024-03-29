import React, { useState, useContext } from "react";

import { Formik, Form } from "formik";

import { Box, Button, Modal, GoogleButton, Input } from "../../../components";

import { setToken } from "../../../utils/helpers";

import {
  GOOGLE_SIGNUP_MUTATION,
  SIGNUP_MUTATION,
} from "../../../graphql/mutations";
import { COLORS } from "../../../constants";

import { useClient } from "../../../client";
import Context from "../../../context";

import { validateEmail } from "../../../utils/helpers";

const SignupModal = ({ onClose }) => {
  const client = useClient();
  const { dispatch, state } = useContext(Context);
  const [spinner, setSpinner] = useState(false);
  const [username, setUsername] = useState("");
  const [authError, setAuthError] = useState("");

  const handleGoogle = async (googleUser) => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      setToken(idToken);

      const variables = {
        username,
        idToken,
      };
      setSpinner(true);
      const {
        googleSignup: { user, token },
      } = await client.request(GOOGLE_SIGNUP_MUTATION, variables);
      setToken(token);
      dispatch({ type: "LOGIN_USER", payload: user });
    } catch (err) {
      setSpinner(false);
      setAuthError(err.response.errors[0].message);
      onFailure(err);
    }
  };

  const handleSubmit = async ({ email, password, username }) => {
    if (validateEmail(email)) {
      try {
        setSpinner(true);

        const variables = {
          username: username.trim(),
          email,
          password,
        };

        const {
          signup: { user, token },
        } = await client.request(SIGNUP_MUTATION, variables);

        setToken(token);

        dispatch({ type: "LOGIN_USER", payload: user });
      } catch (err) {
        setSpinner(false);

        setAuthError(err.response.errors[0].message);
      }
    }
  };

  const handleSetUsername = (username) => {
    setUsername(username);
  };

  const handleValidation = (values) => {
    const err = {};

    if (values.email && !validateEmail(values.email))
      err.email = "Email is invalid";

    if (values.password) {
      if (values.password.length < 6)
        err.password = "Min length is 6 characters";
      if (values.password.length > 25)
        err.password = "Max length is 25 characters";
      if (!values.password.match(/[A-Z]/))
        err.password = "Must contain an uppercase letter";
      if (!values.password.match(/[a-z]/))
        err.password = "Must contain an lowercase letter";
    }

    if (values.username.length > 10)
      err.username = "Max length is 10 characters";
    if (!values.email) err.email = "Required";
    if (!values.username) err.username = "Required";
    if (!values.password) err.password = "Required";
    if (values.password !== values.passwordValidate)
      err.passwordValidate = "Passwords Don't Match";

    return err;
  };

  const onFailure = (err) => {
    console.log(`Error logging in ${err}`);
  };

  return (
    <Modal isLoading={spinner} onClose={onClose} height={460} state={state}>
      <Formik
        onSubmit={handleSubmit}
        validate={handleValidation}
        initialValues={{
          email: "",
          password: "",
          username: "",
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
              <h3>Create Account</h3>
              <Box
                column
                height={260}
                width="75%"
                justifyContent="space-between"
                center
              >
                <Input name="username" placeholder="username" type="input" />
                <Input name="email" placeholder="Email" />
                <Input name="password" type="password" placeholder="Password" />
                <Input
                  name="passwordValidate"
                  type="password"
                  placeholder="Re-enter Password"
                />

                <Button
                  coolStyle
                  type="submit"
                  disabled={!props.isValid || !props.dirty}
                  style={{ zIndex: 100 }}
                >
                  Sign up
                </Button>
              </Box>

              <p style={{ margin: "0px", padding: "0px" }}>
                ------------------or------------------
              </p>
              <Box width="100%" justifyContent="space-evenly">
                <Box width={"50%"}>
                  <Input name="username" placeholder="username" type="input" />
                </Box>

                <GoogleButton
                  label="Signup"
                  shouldPersist={false}
                  onClick={handleGoogle}
                  disabled={!props.values.username}
                  setUsername={handleSetUsername(props.values.username)}
                />
              </Box>
            </Box>
          </Form>
        )}
      />
    </Modal>
  );
};

export default SignupModal;
