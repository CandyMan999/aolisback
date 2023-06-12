import React, { useEffect, useState, useContext, Fragment } from "react";
import { Jutsu } from "react-jutsu";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { Loading } from "..";
import { useHistory } from "react-router-dom";

import { Box, Banner } from "../../components";
import VideoChannel from "./videoChannel";

import Context from "../../context";

const Video = () => {
  const { state } = useContext(Context);
  const [spinner, setSpinner] = useState(false);
  const mobile = useMediaQuery("(max-width: 650px)");

  let history = useHistory();
  const appUrl = `org.jitsi.meet://meet.jit.si/AOLisBack-noi8ioj7r/${state.currentUser.username}`;

  useEffect(() => {
    if (state.userChannel || state.currentUser.username) {
      setSpinner(true);
      setTimeout(() => setSpinner(false), 2000);

      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      if (isSafari) {
        console.log("Safari detected. Unsupported URL scheme.");
        // Handle the unsupported URL scheme in Safari (e.g., show a message to the user)
      } else {
        try {
          window.location.href = appUrl;
        } catch (error) {
          console.log("Jitsi Meet app is not installed");
          // Handle the case where the Jitsi Meet app is not installed (e.g., show a message to the user)
        }
      }
    }
  }, [state.currentUser, state.userChannel]);

  return (
    <Box display="flex" column center>
      {state.userChannel ? (
        <Fragment>
          <Banner
            mobile={mobile}
            show={true}
            message={"Download Jitsi App for best Video Chat experience, FREE!"}
            // duration={8000}
            type="alert"
          />
          <VideoChannel channelOwner={state.userChannel} />
          <Jutsu
            containerStyles={{
              width: mobile ? "375px" : "1200px",
              height: mobile ? "400px" : "800px",
            }}
            roomName={process.env.REACT_APP_ROOM + state.userChannel}
            displayName={state.currentUser.username}
            onMeetingEnd={() => history.push("/")}
            loadingComponent={<p>Loading...</p>}
            errorComponent={<p>Oops, something went wrong</p>}
          />
        </Fragment>
      ) : (
        <Fragment>
          <VideoChannel channelOwner={state.currentUser.username} />
          {spinner && <Loading />}
          <Jutsu
            containerStyles={{
              width: mobile ? "375px" : "1200px",
              height: mobile ? "400px" : "800px",
            }}
            roomName={process.env.REACT_APP_ROOM + state.currentUser.username}
            displayName={state.currentUser.username}
            onMeetingEnd={() => history.push("/")}
            loadingComponent={<Loading />}
            errorComponent={<p>Oops, something went wrong</p>}
          />
        </Fragment>
      )}
    </Box>
  );
};

export default Video;
