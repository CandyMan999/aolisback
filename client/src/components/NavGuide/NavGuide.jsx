import React, { useContext } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { motion, useCycle } from "framer-motion";
import { withRouter } from "react-router-dom";

import { MenuToggle } from "./MenuToggle";
import Navigation from "./Navigation";

import "./styles.css";
import Context from "../../context";

const sidebar = () => {
  return {
    open: (height = 400) => ({
      clipPath: `circle(${height * 2 + 200}px at 260px 40px)`,
      zIndex: 100,
      transition: {
        type: "spring",
        stiffness: 30,
        restDelta: 2,
        duration: 2,
      },
    }),
    closed: {
      clipPath: "circle(0px at 260px 30px)",
      zIndex: 100,
      transition: {
        ease: "linear",
        duration: 1,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };
};

const Navguide = ({ props }) => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const { state, dispatch } = useContext(Context);
  const mobile = useMediaQuery("(max-width: 650px)");

  return (
    <motion.nav initial={false} animate={isOpen ? "open" : "closed"}>
      {isOpen && (
        <motion.div
          initial={{
            clipPath: "circle(0px at 260px 30px)",
            height: "fit-content",
          }}
          transition={{ ease: "linear" }}
          className="background"
          variants={sidebar(mobile)}
        >
          <Navigation
            initial={false}
            toggle={() => toggleOpen()}
            props={props}
            state={state}
            dispatch={dispatch}
          />
        </motion.div>
      )}
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};

export default withRouter(Navguide);
