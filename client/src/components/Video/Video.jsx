import React, { useEffect, useState, useContext, Fragment } from "react";
import { browserName, isIOS } from "react-device-detect";
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
  const isChromeMobile = isIOS && browserName === "Chrome" && mobile;
  const iosMobile = isIOS && mobile;

  let history = useHistory();
  const appUrl = `org.jitsi.meet://meet.jit.si/AOLisBack-noi8ioj7r/${state.currentUser.username}`;

  useEffect(() => {
    if (state.userChannel || state.currentUser.username) {
      setSpinner(true);
      setTimeout(() => setSpinner(false), 2000);

      if (isChromeMobile || iosMobile) {
        try {
          window.location.href = appUrl;
          // Open the app on app IOS or chrome IOS mobile
        } catch (err) {
          console.log("err: ", err);
        }
      } else {
        // open app on android
        try {
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
