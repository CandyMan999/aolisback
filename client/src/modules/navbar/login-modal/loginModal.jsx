import React, { useState, useContext } from "react";

import { Formik, Form } from "formik";

import { Box, Button, Modal, GoogleButton, Input } from "../../../components";

import { setToken } from "../../../utils/helpers";

import {
  GOOGLE_LOGIN_MUTATION,
  LOGIN_MUTATION,
} from "../../../graphql/mutations";
import { COLORS } from "../../../constants";

import { useClient } from "../../../client";
import Context from "../../../context";

const LoginModal = ({ onClose }) => {
  const client = useClient();
  const { dispatch, state } = useContext(Context);
  const [authError, setAuthError] = useState("");
  const [spinner, setSpinner] = useState(false);

  const handleGoogle = async (googleUser) => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      setToken(idToken);

      const variables = {
        idToken,
      };
      setSpinner(true);
      const {
        googleLogin: { token, user },
      } = await client.request(GOOGLE_LOGIN_MUTATION, variables);

      setToken(token);

      dispatch({ type: "LOGIN_USER", payload: user });
    } catch (err) {
      setSpinner(false);
      setAuthError(err.response.errors[0].message);
      onFailure(err);
    }
  };

  const handleSubmit = async ({ password, username }) => {
    try {
      const variables = {
        username,
        password,
      };
      setSpinner(true);
      const {
        login: { user, token },
      } = await client.request(LOGIN_MUTATION, variables);

      setToken(token);

      dispatch({ type: "LOGIN_USER", payload: user });
    } catch (err) {
      setSpinner(false);

      setAuthError(err.response.errors[0].message);
    }
  };

  const handleValidation = (values) => {
    const err = {};

    if (!values.username) err.username = "Required";
    if (!values.password) err.password = "Required";

    return err;
  };

  const onFailure = (err) => {
    console.error(`Error logging in ${err}`);
  };

  return (
    <Modal isLoading={spinner} onClose={onClose} height={460} state={state}>
      <Formik
        onSubmit={handleSubmit}
        validate={handleValidation}
        initialValues={{
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
              <h3>Login</h3>
              <Box
                column
                width="75%"
                height={150}
                justifyContent="space-between"
                center
              >
                <Input name="username" placeholder="username" type="input" />

                <Input name="password" type="password" placeholder="Password" />

                <Button
                  type="submit"
                  disabled={!props.isValid || !props.dirty}
                  style={{ zIndex: 100 }}
                >
                  Login
                </Button>
              </Box>

              <p style={{ margin: "0px", padding: "0px" }}>
                ------------------or------------------
              </p>
              <Box>
                <GoogleButton
                  label="Login"
                  shouldPersist={false}
                  onClick={handleGoogle}
                />
              </Box>
            </Box>
          </Form>
        )}
      />
    </Modal>
  );
};

export default LoginModal;
