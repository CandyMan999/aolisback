import React, { Fragment, useState, useContext, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";

import { Box, Button, FONT_SIZES, Text, NavGuide } from "../../components";

import { navText, navbar } from "../../styles/classes";
import SignupModal from "./signup-modal";
import LoginModal from "./login-modal";

import { COLORS } from "../../constants";

import { useClient } from "../../client";
import Context from "../../context";

const Navbar = ({ props }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);

  const { currentUser } = state;
  useEffect(() => {
    if (currentUser) {
      dispatch({ type: "TOGGLE_SIGNUP", payload: false });
      dispatch({ type: "TOGGLE_LOGIN", payload: false });
    }
  }, [currentUser]);

  console.log("current User: ", currentUser);

  return (
    <div className={navbar}>
      <Box position="absolute" right={0} top={0}>
        <NavGuide props={props} />
      </Box>
      {state.showSignup && (
        <SignupModal
          onClose={() => dispatch({ type: "TOGGLE_SIGNUP", payload: false })}
        />
      )}
      {state.showLogin && (
        <LoginModal
          onClose={() => dispatch({ type: "TOGGLE_LOGIN", payload: false })}
        />
      )}
      <Box flexWrap="wrap" column display="flex">
        <NavLink style={{ textDecoration: "none" }} to="/">
          <Text
            margin={0}
            color={COLORS.white}
            fontSize={FONT_SIZES.X_LARGE}
            bold
          >
            ChatSober
          </Text>
        </NavLink>
      </Box>

      {currentUser && currentUser.username && (
        <Box
          marginRight="20%"
          flexWrap="wrap"
          textAlign="center"
          alignItems="center"
          column
          width="fit-content"
          color={COLORS.orange}
        >
          <Text margin={2} fontSize={FONT_SIZES.SMALL}>
            Welcome, {currentUser.username}
          </Text>

          {!!currentUser.pictures && currentUser.pictures[0] && (
            <img
              style={{
                height: "30px",
                width: "30px",
                borderRadius: "90%",
                border: `dotted 2px ${COLORS.vividBlue}`,
              }}
              src={currentUser.pictures[0].url}
              alt={currentUser.name}
            />
          )}
        </Box>
      )}
    </div>
  );
};

export default withRouter(Navbar);
