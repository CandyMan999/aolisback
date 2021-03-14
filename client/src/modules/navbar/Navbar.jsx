import React, {
  Fragment,
  useState,
  useContext,
  useEffect,
  compon,
} from "react";
import { NavLink, withRouter } from "react-router-dom";

import { Box, Button, FONT_SIZES, Text } from "../../components";

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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { currentUser } = state;
  useEffect(() => {
    if (currentUser) {
      setShowSignupModal(false);
      setShowLoginModal(false);
    }
  }, [currentUser]);

  return (
    <div className={navbar}>
      {showSignupModal && (
        <SignupModal onClose={() => setShowSignupModal(false)} />
      )}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      <NavLink to="/" style={{ textDecoration: "none" }}>
        <Text color={COLORS.white} fontSize={FONT_SIZES.X_LARGE} bold>
          AOLisBack
        </Text>
      </NavLink>
      <Box justifyContent="flex-end" center flex={1}>
        {currentUser ? (
          <Box flexWrap="wrap" textAlign="center" color={COLORS.orange}>
            {" "}
            <div>
              <Text> Welcome, {currentUser.username}</Text>
            </div>
            {!!currentUser.pictures && currentUser.pictures[0] && (
              <img
                style={{
                  height: "40px",
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
                onClick={() => setShowLoginModal(true)}
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
