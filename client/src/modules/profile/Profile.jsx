import React, { Fragment, useContext } from "react";
import { Drawer, Box, Button } from "../../components";

import { useClient } from "../../client";
import Context from "../../context";
import { useHistory } from "react-router-dom";

const Profile = ({ userClicked }) => {
  //eventually userClicked will be whole object
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  let history = useHistory();

  const toggleDrawer = () => {
    dispatch({ type: "TOGGLE_PROFILE", payload: !state.isProfile });
  };

  const handleVideo = () => {
    dispatch({ type: "JOIN_CHANNEL", payload: userClicked });
    dispatch({ type: "TOGGLE_PROFILE", payload: false });
    history.push("/video");
  };

  return (
    <Drawer
      onClose={toggleDrawer}
      isOpen={state.isProfile}
      title={`${userClicked}'s Profile`}
    >
      <Box display="flex" center column>
        <Button onClick={handleVideo} color="red">
          Join Video Channel
        </Button>
      </Box>
    </Drawer>
  );
};

export default Profile;
