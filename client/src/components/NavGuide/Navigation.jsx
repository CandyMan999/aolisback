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
    { name: "View Users Locations", icon: "search", route: "/location" },
    { name: "Home", icon: "home", route: "/" },
    { name: "Logout", icon: "signout", route: "/" },
  ]);

  useEffect(() => {
    if (!!currentUser && !!currentUser.username) {
      setItems([
        { name: "My Profile", icon: "user", route: "/profile" },
        { name: "My Video Channel", icon: "video", route: "/video" },
        { name: "View Users Locations", icon: "search", route: "/location" },
        { name: "Home", icon: "home", route: "/" },
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
