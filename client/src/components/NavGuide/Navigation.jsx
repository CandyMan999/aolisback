import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { useClient } from "../../client";
import { useLocation } from "react-router-dom";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.3 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const Navigation = ({ dispatch, props, state, toggle }) => {
  const client = useClient();
  const location = useLocation();
  const { currentUser } = state;

  const [items, setItems] = useState([
    { name: "Login", icon: "login", route: "/" },
    { name: "User Signup", icon: "signup", route: "/" },
    { name: "Speed Date", icon: "speed", route: "/speed-date" },
    { name: "Message Center", icon: "videoMessage", route: "/message-center" },
    { name: "View Users Locations", icon: "search", route: "/location" },
    { name: "Chat Rooms", icon: "chat", route: "/" },
    { name: "Browse Users", icon: "browseLogo", route: "/grid-search" },

    { name: "Logout", icon: "signout", route: "/" },
  ]);

  useEffect(() => {
    if (
      !!currentUser &&
      (currentUser.username === "CandyMan🍭" ||
        currentUser.username === "AsianAngel" ||
        currentUser.username === "Smokey💨" ||
        currentUser.username === "Kev Hick")
    ) {
      setItems([
        { name: "Speed Date", icon: "speed", route: "/speed-date" },
        { name: "Chat Rooms", icon: "chat", route: "/" },
        { name: "My Profile", icon: "user", route: "/profile" },
        {
          name: "Message Center",
          icon: "videoMessage",
          route: "/message-center",
        },
        { name: "View Users Locations", icon: "search", route: "/location" },
        { name: "Browse Users", icon: "browseLogo", route: "/grid-search" },

        { name: "Logout", icon: "signout", route: "/" },
        { name: "Admin", icon: "user", route: "/admin" },
      ]);
    }
    if (
      !!currentUser &&
      !!currentUser.username &&
      currentUser.username !== "CandyMan🍭" &&
      currentUser.username !== "AsianAngel" &&
      currentUser.username !== "Smokey💨" &&
      currentUser.username !== "Kev Hick"
    ) {
      setItems([
        { name: "Speed Date", icon: "speed", route: "/speed-date" },
        { name: "Chat Rooms", icon: "chat", route: "/" },
        { name: "My Profile", icon: "user", route: "/profile" },
        {
          name: "Message Center",
          icon: "videoMessage",
          route: "/message-center",
        },
        { name: "View Users Locations", icon: "search", route: "/location" },

        { name: "Browse Users", icon: "browseLogo", route: "/grid-search" },

        { name: "Logout", icon: "signout", route: "/" },
      ]);
    }
    if (!currentUser || !currentUser.username) {
      setItems([
        { name: "Login", icon: "user", route: "/" },
        { name: "User Signup", icon: "signup", route: "/" },
      ]);
    }
  }, [currentUser]);

  return (
    <motion.ul className={"navUl"} variants={variants}>
      {items.map((item, i) => (
        <MenuItem
          toggle={toggle}
          dispatch={dispatch}
          client={client}
          state={state}
          props={props}
          item={item}
          isActive={item.route === location.pathname && item.name !== "Logout"}
          key={i}
          i={i}
        />
      ))}
    </motion.ul>
  );
};

export default Navigation;
