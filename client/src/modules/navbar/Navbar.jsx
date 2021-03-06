import React, { useContext, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Image, Transformation, CloudinaryContext } from "cloudinary-react";
import { getToken } from "../../utils/helpers";

import { Box, FONT_SIZES, Text, NavGuide } from "../../components";

import { navbar } from "../../styles/classes";
import SignupModal from "./signup-modal";
import LoginModal from "./login-modal";
import { FETCH_ME } from "../../graphql/queries";

import { COLORS } from "../../constants";

import { useClient } from "../../client";

import Context from "../../context";

const Navbar = ({ props }) => {
  const { state, dispatch } = useContext(Context);
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
    if (token) {
      handleFetchMe();
    }
  }, [token]);

  const handleFetchMe = async () => {
    try {
      const variables = {
        token,
      };

      const { fetchMe } = await client.request(FETCH_ME, variables);

      await dispatch({ type: "LOGIN_USER", payload: fetchMe });

      console.log("dispatch current: ", currentUser);
    } catch (err) {
      console.log(err);
    }
  };

  const profilePic =
    currentUser && currentUser.pictures && currentUser.pictures[0];

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

          {!!profilePic && profilePic.publicId && (
            <CloudinaryContext cloudName="localmassagepros">
              <Image
                alt={`${profilePic._id}-avatar`}
                style={{
                  borderRadius: "90%",
                  marginTop: 2,
                  border: `dotted 2px ${COLORS.vividBlue}`,
                }}
                loading="lazy"
                publicId={profilePic.publicId}
              >
                <Transformation height={"30"} width={"30"} crop="thumb" />
              </Image>
            </CloudinaryContext>
          )}

          {profilePic && !profilePic.publicId && (
            <img
              style={{
                height: "30px",
                width: "30px",
                borderRadius: "90%",
                border: `dotted 2px ${COLORS.vividBlue}`,
              }}
              src={profilePic.url}
              alt={profilePic.username}
            />
          )}
        </Box>
      )}
    </div>
  );
};

export default withRouter(Navbar);
