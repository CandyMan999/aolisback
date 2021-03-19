import React, {
  Fragment,
  useState,
  useContext,
  useEffect,
  compon,
} from "react";
import { NavLink, withRouter } from "react-router-dom";

import { Box, Button, FONT_SIZES, Text, NavGuide } from "../../components";

import { navText, navbar } from "../../styles/classes";
import SignupModal from "./signup-modal";
import LoginModal from "./login-modal";

import { COLORS } from "../../constants";

import { useClient } from "../../client";
import Context from "../../context";

const Navbar = ({}) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const { currentUser } = state;
  useEffect(() => {
    if (currentUser) {
      setShowSignupModal(false);
      dispatch({ type: "TOGGLE_LOGIN", payload: false });
    }
  }, [currentUser]);

  return (
    <div className={navbar}>
      {showSignupModal && (
        <SignupModal onClose={() => setShowSignupModal(false)} />
      )}
      {state.isLogin && (
        <LoginModal
          onClose={() => dispatch({ type: "TOGGLE_LOGIN", payload: false })}
        />
      )}
      <Box flexWrap="wrap" column display="flex">
        <NavGuide />
        <NavLink style={{ textDecoration: "none" }} to="/">
          <Text
            margin={0}
            color={COLORS.white}
            fontSize={FONT_SIZES.X_LARGE}
            bold
          >
            SoberTalk
          </Text>
        </NavLink>
      </Box>

      <Box justifyContent="flex-end">
        {currentUser ? (
          <Box
            flexWrap="wrap"
            textAlign="center"
            alignItems="center"
            column
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
        ) : (
          <Fragment>
            <Box paddingRight={25}>
              <Text
                onClick={() =>
                  dispatch({ type: "TOGGLE_LOGIN", payload: true })
                }
                color={COLORS.white}
                fontSize={FONT_SIZES.X_LARGE}
                bold
              >
                Login
              </Text>
            </Box>
            <Box>
              <Text
                onClick={() => setShowSignupModal(true)}
                color={COLORS.white}
                fontSize={FONT_SIZES.X_LARGE}
                bold
              >
                Signup
              </Text>
            </Box>
          </Fragment>
        )}
      </Box>
    </div>
  );
};

export default withRouter(Navbar);
