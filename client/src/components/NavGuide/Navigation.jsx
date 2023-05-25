import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { useClient } from "../../client";

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
  const { currentUser } = state;
  const [items, setItems] = useState([
    { name: "Login", icon: "login", route: "/" },
    { name: "User Signup", icon: "signup", route: "/" },
    { name: "Message Center", icon: "videoMessage", route: "/message-center" },
    { name: "View Users Locations", icon: "search", route: "/location" },
    { name: "Chat Rooms", icon: "chat", route: "/" },
    { name: "Browse Users", icon: "browseLogo", route: "/grid-search" },
    { name: "Logout", icon: "signout", route: "/" },
  ]);

  useEffect(() => {
    if (!!currentUser && !!currentUser.username) {
      setItems([
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
        { name: "Login", icon: "login", route: "/" },
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
          key={i}
          i={i}
        />
      ))}
    </motion.ul>
  );
};

export default Navigation;
