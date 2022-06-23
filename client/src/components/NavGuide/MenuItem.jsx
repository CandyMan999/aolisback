import * as React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Text, Icon, ICON_SIZES } from "../../components";
import { COLORS } from "../../constants";
import { clearToken } from "../../utils/helpers";

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
  "#007070",
  "#008f8f",
  "#00a8a8",
  "#00c2c2",
  "#00dbdb",
  "#00f5f5",
  "#BBF1F1",
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

export const MenuItem = ({ i, item, dispatch, toggle, props }) => {
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
    if (item === "Users Location") {
      toggle();
    }
    if (item === "Logout") {
      clearToken();
      dispatch({ type: "LOGIN_USER", payload: null });
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
