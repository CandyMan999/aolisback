import React, { useContext } from "react";
import { Drawer } from "../../components";

import { useClient } from "../../client";
import Context from "../../context";

const Profile = ({ userClicked }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  //eventually userClicked will be whole object

  const toggleDrawer = () => {
    dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
  };

  return (
    <Drawer
      onClose={toggleDrawer}
      isOpen={state.isProfile}
      title={`${userClicked}'s Profile`}
    ></Drawer>
  );
};

export default Profile;
