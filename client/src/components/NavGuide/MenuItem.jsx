import * as React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Text, Icon, ICON_SIZES } from "../../components";
import { COLORS } from "../../constants";
import { clearToken } from "../../utils/helpers";
import { LOGOUT_MUTATION } from "../../graphql/mutations";
import { useHistory } from "react-router-dom";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const greys = [
  COLORS.lightPurple,
  COLORS.lightPurple,
  COLORS.lightPurple,
  COLORS.lightPurple,
  COLORS.lightPurple,
  COLORS.lightPurple,

  COLORS.black,
];

const teals = [
  COLORS.pink,
  COLORS.pink,
  COLORS.pink,
  COLORS.pink,
  COLORS.pink,
  COLORS.pink,
  COLORS.pink,
  COLORS.pink,
];
// const reds = [
//   COLORS.secondary,
//   "#ff0f87",
//   "#ff2e96",
//   "#ff4da6",
//   "#ff8fc7",
//   "#ffb8db",
//   "#ffdbed",
// ];

export const MenuItem = ({
  i,
  item,
  dispatch,
  toggle,

  state,
  client,
  isActive,
}) => {
  const history = useHistory();

  const style = {
    border: `1px solid ${teals[i === teals.length ? 0 : i]}`,
    justifyContent: "center",
    display: "flex",
    background: `${greys[i === greys.length ? 0 : i]}`,
  };
  const handleOnclick = (item) => {
    if (item === "Login") {
      dispatch({ type: "TOGGLE_LOGIN", payload: true });
      toggle();
    }
    if (item === "User Signup") {
      dispatch({ type: "TOGGLE_SIGNUP", payload: true });
      toggle();
    }
    if (item === "My Profile") {
      toggle();
    }
    if (item === "My Video Channel") {
      toggle();
    }
    if (item === "Chat Rooms") {
      toggle();
    }
    if (item === "View Users Locations") {
      dispatch({
        type: "VIEW_LOCATION",
        payload: { _id: null, lat: null, lng: null },
      });
      toggle();
    }
    if (item === "Browse Users") {
      toggle();
    }
    if (item === "Message Center") {
      toggle();
    }
    if (item === "Speed Date") {
      toggle();
    }
    if (item === "Admin") {
      toggle();
    }
    if (item === "Logout") {
      handleLogout();
      clearToken();
      dispatch({ type: "CHANGE_ROOM", payload: null });
      dispatch({ type: "UPDATE_USER", payload: {} });
      toggle();
    }
  };

  const handleLogout = async () => {
    try {
      const variables = {
        username: state.currentUser.username,
      };

      const { logout } = await client.request(LOGOUT_MUTATION, variables);
      history.push({
        pathname: "/",
        search: `?logout=${true}`,
      });
      return logout;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <NavLink style={{ textDecoration: "none" }} to={item.route}>
      <motion.li
        variants={variants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="navLi"
        onClick={() => handleOnclick(item.name)}
      >
        <div
          className="icon-placeholder"
          style={{
            ...style,
            boxShadow: isActive
              ? `2px 2px 4px 2px ${COLORS.pink}`
              : `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
          }}
        >
          <Icon
            size={ICON_SIZES.XX_LARGE}
            color={COLORS.white}
            name={item.icon}
          />
        </div>
        <div
          className="text-placeholder"
          style={{
            ...style,
            boxShadow: isActive
              ? `2px 2px 4px 2px ${COLORS.pink}`
              : `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
          }}
        >
          <Text color={COLORS.white} bold margin={0}>
            {item.name}
          </Text>
        </div>
      </motion.li>
    </NavLink>
  );
};
