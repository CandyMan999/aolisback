// NavScreen.jsx

import React from "react";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import { Box, Text, Icon, ICON_SIZES } from "../../components";
import { COLORS } from "../../constants";
import iOSLogo from "../../pictures/iOSLogo.png"; // Update the path as needed

const NavScreen = ({ showScreen, dispatch }) => {
  const history = useHistory();

  const handleShutScreen = () => {
    try {
      dispatch({ type: "CLOSE_NAV_SCREEN", payload: false });
    } catch (err) {
      console.log(err);
    }
  };

  const navigateTo = (path) => {
    handleShutScreen();
    history.push(path);
  };

  // Define your navigation items with corresponding icons and routes
  const navItems = [
    {
      label: "Speed Date",
      icon: "speed",
      path: "/speed-date",
    },
    {
      label: "Chat Rooms",
      icon: "chat", // Icon name as per your Icon component
      path: "/",
    },

    {
      label: "Message Center",
      icon: "videoMessage",
      path: "/message-center",
    },
    {
      label: "Browse Users",
      icon: "browseLogo",
      path: "/grid-search",
    },
    {
      label: "Users Locations",
      icon: "search", // Icon name as per your Icon component
      path: "/location",
    },
    {
      label: "My Profile",
      icon: "user",
      path: "/profile",
    },
    // Add more items if needed
  ];

  // Arrange navItems into rows of two
  const navItemRows = [];
  for (let i = 0; i < navItems.length; i += 2) {
    navItemRows.push(navItems.slice(i, i + 2));
  }

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: showScreen ? "100%" : 0 }}
      transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        bottom: 0,
        zIndex: 30000,
        backgroundColor: COLORS.white,
        overflow: "hidden",
      }}
    >
      <Box
        column
        style={{
          padding: "20px",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100%",
          position: "relative",
          zIndex: 1,
          overflowY: "auto", // Enable scrolling if content overflows
        }}
      >
        <img
          src={iOSLogo}
          alt="Logo"
          style={{ width: 100, height: 100, marginBottom: 0 }}
        />
        <Text
          style={{
            fontSize: "24px",
            color: COLORS.black,
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Where Do You Want to Go?
        </Text>
        {/* Render the navigation items in rows of two */}
        {navItemRows.map((rowItems, rowIndex) => (
          <Box
            key={rowIndex}
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            {rowItems.map((item) => (
              <Box key={item.path} column center>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.7 }}
                  style={circleButtonStyles}
                  onClick={() => navigateTo(item.path)}
                >
                  <Icon
                    size={
                      item.icon === "user"
                        ? ICON_SIZES.NAV_SCREEN
                        : ICON_SIZES.MASTER
                    }
                    color={COLORS.white}
                    name={item.icon}
                  />
                </motion.div>
                <Text style={buttonTextStyles}>{item.label}</Text>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </motion.div>
  );
};

// Styles for the circle buttons
const circleButtonStyles = {
  backgroundColor: COLORS.lightPurple,
  width: "100px",
  height: "100px",
  borderRadius: "60px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: `solid 1px ${COLORS.pink}`,
  boxShadow: `0px 5px 10px ${COLORS.pink}`,
  cursor: "pointer",
};

// Styles for the button text
const buttonTextStyles = {
  color: COLORS.black,
  fontSize: "16px",
  fontWeight: "bold",
  textAlign: "center",
  marginTop: "10px",
};

export default NavScreen;
