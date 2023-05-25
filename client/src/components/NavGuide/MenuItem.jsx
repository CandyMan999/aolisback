import * as React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Text, Icon, ICON_SIZES } from "../../components";
import { COLORS } from "../../constants";
import { clearToken } from "../../utils/helpers";
import { LOGOUT_MUTATION } from "../../graphql/mutations";

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
  "black",
  "#737373",
  "#878787",
  "#949494",
  "#a1a1a1",
  "#adadad",
  "#bababa",
].reverse();

const teals = [
  "#6bccf9",
  "#88d3f5",
  "#a5dbf2",
  "#c2e2ee",
  "#dff0eb",
  "#fcf7e7",
  "#ffffff",
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
  props,
  state,
  client,
}) => {
  const style = {
    border: `3px solid ${teals[i === teals.length ? 0 : i]}`,
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
      toggle();
    }
    if (item === "Browse Users") {
      toggle();
    }
    if (item === "Message Center") {
      toggle();
    }
    if (item === "Logout") {
      handleLogout();
      clearToken();
      dispatch({ type: "CHANGE_ROOM", payload: null });
      dispatch({ type: "LOGIN_USER", payload: false });
      toggle();
    }
  };

  const handleLogout = async () => {
    try {
      const variables = {
        username: state.currentUser.username,
      };

      const { logout } = await client.request(LOGOUT_MUTATION, variables);
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
        <div className="icon-placeholder" style={style}>
          <Icon
            size={ICON_SIZES.XX_LARGE}
            color={COLORS.white}
            name={item.icon}
          />
        </div>
        <div className="text-placeholder" style={style}>
          <Text color={COLORS.white} bold margin={0}>
            {item.name}
          </Text>
        </div>
      </motion.li>
    </NavLink>
  );
};
