import React, { Fragment, useContext, useEffect } from "react";
import { FETCH_ME } from "../../graphql/queries";

import CreateProfile from "./CreateProfile";

import { Box, Loading } from "../../components";
import { useClient } from "../../client";
import Context from "../../context";
import { getToken } from "../../utils/helpers";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const ProfileContainer = (props) => {
  const client = useClient();
  const token = getToken();
  const { state, dispatch } = useContext(Context);
  const currentUser = state.currentUser;
  const mobile = useMediaQuery("(max-width: 650px)");

  useEffect(() => {
    handleFetchUser();
  }, []);

  const handleFetchUser = async () => {
    const varibales = {
      token,
    };
    const { fetchMe } = await client.request(FETCH_ME, varibales);

    dispatch({ type: "UPDATE_USER", payload: fetchMe });
  };

  return !currentUser.username ? (
    <Box
      position="absolute"
      top="50%"
      left="50%"
      marginTop={-50}
      marginLeft={-50}
      width={100}
      height={100}
    >
      <Loading fade />
    </Box>
  ) : (
    <Fragment>
      <CreateProfile
        client={client}
        dispatch={dispatch}
        currentUser={currentUser}
        mobile={mobile}
      />
    </Fragment>
  );
};

export default ProfileContainer;
