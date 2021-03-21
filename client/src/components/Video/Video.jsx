import React, { useEffect, useState, useContext, Fragment } from "react";
import { Jutsu, useJitsi } from "react-jutsu";
import { Loading } from "..";
import {
  Redirect,
  useHistory,
  withRouter,
  useLocation,
} from "react-router-dom";

import { Box } from "../../components";
import Banner from "./banner";
import Offline from "./offline";

import { useClient } from "../../client";
import Context from "../../context";

const Video = () => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [spinner, setSpinner] = useState(false);

  let history = useHistory();

  useEffect(() => {
    if (state.userChannel || state.currentUser.username) {
      setSpinner(true);
      setTimeout(() => setSpinner(false), 2000);
    }
  }, [state.currentUser, state.userChannel]);

  return (
    <Box display="flex" column center>
      {state.userChannel ? (
        <Fragment>
          <Banner channelOwner={state.userChannel} />
          <Jutsu
            containerStyles={{ width: "375px", height: "400px" }}
            roomName={process.env.REACT_APP_ROOM + state.userChannel}
            displayName={state.currentUser.username}
            onMeetingEnd={() => history.push("/profile")}
            loadingComponent={<p>Loading...</p>}
            errorComponent={<p>Oops, something went wrong</p>}
          />
        </Fragment>
      ) : (
        <Fragment>
          <Banner channelOwner={state.currentUser.username} />
          {spinner && <Loading />}
          <Jutsu
            containerStyles={{ width: "375px", height: "400px" }}
            roomName={process.env.REACT_APP_ROOM + state.currentUser.username}
            displayName={state.currentUser.username}
            onMeetingEnd={() => history.push("/profile")}
            loadingComponent={<Loading />}
            errorComponent={<p>Oops, something went wrong</p>}
          />
        </Fragment>
      )}
    </Box>
  );
};

export default Video;
