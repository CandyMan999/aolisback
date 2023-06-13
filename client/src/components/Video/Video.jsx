import React, { useEffect, useContext } from "react";
import { browserName, isIOS, isDesktop } from "react-device-detect";
import { Jutsu } from "react-jutsu";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { useHistory } from "react-router-dom";

import { Box, Banner } from "../../components";
import VideoChannel from "./videoChannel";

import Context from "../../context";

const Video = () => {
  const { state } = useContext(Context);

  const mobile = useMediaQuery("(max-width: 650px)");
  const isChromeMobile = isIOS && browserName === "Chrome" && mobile;
  const iosMobile = isIOS && mobile;

  let history = useHistory();
  const appUrl = `org.jitsi.meet://meet.jit.si/AOLisBack-noi8ioj7r/${state.userChannel}`;
  const webApp = `jitsi-meet://${state.userChannel}`;

  useEffect(() => {
    if (state.userChannel || state.currentUser.username) {
      try {
        if (!isDesktop) {
          window.location.href = appUrl;
        }
        // Open the app on app IOS or chrome IOS mobile
      } catch (err) {
        console.log("err: ", err);
      }
      // } else {
      //   // open app on android
      //   try {
      //   } catch (error) {
      //     console.log("Jitsi Meet app is not installed");
      //     // Handle the case where the Jitsi Meet app is not installed (e.g., show a message to the user)
      //   }
      // }
    }
  }, [state.currentUser, state.userChannel]);

  return (
    <Box display="flex" column center width="100%" height="100%">
      {!isDesktop && (
        <Banner
          mobile={mobile}
          show={true}
          message={"Download Jitsi App for best Video Chat experience, FREE!"}
          type="alert"
        />
      )}
      <VideoChannel channelOwner={state.userChannel} />
      <Jutsu
        containerStyles={{
          width: "95%",
          height: "80vh",
        }}
        roomName={process.env.REACT_APP_ROOM + state.userChannel}
        displayName={state.currentUser.username}
        onMeetingEnd={() => history.push("/")}
        loadingComponent={<p>Loading...</p>}
        errorComponent={<p>Oops, something went wrong</p>}
      />
    </Box>
  );
};

export default Video;
