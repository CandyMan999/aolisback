import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavLink, withRouter, useLocation } from "react-router-dom";

import { getToken, setToken } from "../../utils/helpers";
import NavLogo from "../../pictures/NavLogo.png";

import { Box, FONT_SIZES, Text, NavGuide, Picture } from "../../components";

import SignupModal from "./signup-modal";
import LoginModal from "./login-modal";
import { FETCH_ME } from "../../graphql/queries";

import { COLORS } from "../../constants";

import { useClient } from "../../client";

import Context from "../../context";

const Navbar = ({ props }) => {
  const { state, dispatch } = useContext(Context);
  const location = useLocation();
  const appToken = new URLSearchParams(location.search).get("token");
  const [navOpen, setNavOpen] = useState(false);

  const client = useClient();
  const token = getToken();

  const { currentUser } = state;

  useEffect(() => {
    if (currentUser) {
      dispatch({ type: "TOGGLE_SIGNUP", payload: false });
      dispatch({ type: "TOGGLE_LOGIN", payload: false });
    }
  }, [currentUser]);

  useEffect(() => {
    if (appToken) {
      handleFetchMe(appToken);
      setToken(appToken);
    } else if (token) {
      handleFetchMe(token);
    }
  }, [token, appToken]);

  const handleFetchMe = async (value) => {
    try {
      const variables = {
        token: value,
      };

      const { fetchMe } = await client.request(FETCH_ME, variables);

      await dispatch({ type: "LOGIN_USER", payload: fetchMe });
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenProfile = async () => {
    dispatch({ type: "UPDATE_PROFILE", payload: state.currentUser });
    dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
  };

  const profilePic =
    currentUser && currentUser.pictures && currentUser.pictures[0];

  const changeStyle = location.pathname === "/grid-search";

  return (
    <div
      style={{
        background: COLORS.black,
        height: "60px",
        display: "flex",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "5px",
        paddingRight: "5px",
        position: changeStyle ? "fixed" : "relative",
        width: changeStyle ? "100%" : undefined,
        zIndex: changeStyle ? (navOpen ? 3 : 1) : undefined,
      }}
    >
      <Box position="absolute" right={0} top={0}>
        <NavGuide setNavOpen={setNavOpen} props={props} />
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

      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: props.mobile ? 25 : 38,
          zIndex:
            location.pathname === "/location" ||
            location.pathname === "/message"
              ? 2
              : undefined,
        }}
        whileTap={{ scale: 0.7 }}
      >
        <NavLink
          style={{
            textDecoration: "none",
          }}
          to="/"
        >
          <img
            height={props.mobile ? 160 : 200}
            width={props.mobile ? 160 : 200}
            src={NavLogo}
            alt="Gone-Chatting-Logo"
          />
        </NavLink>
      </motion.div>

      {currentUser && currentUser.username && (
        <Box
          marginRight="20%"
          flexWrap="wrap"
          textAlign="center"
          alignItems="center"
          column
          color={COLORS.vividBlue}
          onClick={handleOpenProfile}
        >
          <Text
            bold
            margin={0}
            padding={0}
            style={{ width: 150 }}
            fontSize={FONT_SIZES.SMALL}
          >
            {currentUser.username.length <= 10
              ? `Welcome, ${currentUser.username}`
              : currentUser.username}
          </Text>

          {!!profilePic && profilePic.publicId && (
            <Picture
              profilePic={profilePic}
              name={currentUser.username}
              height={40}
              width={40}
            />
          )}
        </Box>
      )}
    </div>
  );
};

export default withRouter(Navbar);
