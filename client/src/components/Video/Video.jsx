import React, { useEffect, useContext } from "react";
import { isIOS, isDesktop, isAndroid } from "react-device-detect";
import { Jutsu } from "react-jutsu";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { useHistory } from "react-router-dom";

import { Box, Banner, Loading } from "../../components";
import VideoChannel from "./videoChannel";

import Context from "../../context";

const Video = () => {
  const { state } = useContext(Context);

  const mobile = useMediaQuery("(max-width: 650px)");

  let history = useHistory();
  const appUrl = `org.jitsi.meet://meet.jit.si/AOLisBack-noi8ioj7r/${state.userChannel}-328723!^*#@`;
  const webAppMac = `jitsi-meet://meet.jit.si/AOLisBack-noi8ioj7r/${state.userChannel}-328723!^*#@`;

  useEffect(() => {
    if (state.userChannel || state.currentUser.username) {
      try {
        if (isIOS || isAndroid) {
          window.location.href = appUrl;
        }
        if (isDesktop) {
          window.location.href = webAppMac;
        }
      } catch (err) {
        console.log("err: ", err);
      }
    }
  }, [state.currentUser, state.userChannel]);

  return (
    <Box display="flex" column center width="100%" height="100%">
      {/* <Banner
        mobile={mobile}
        show={true}
        message={"Download Jitsi App for best Video Chat experience, FREE!"}
        type="alert"
      /> */}

      <VideoChannel channelOwner={state.userChannel} />
      {state.currentUser ? (
        <Jutsu
          containerStyles={{
            width: "95%",
            height: "80vh",
          }}
          roomName={
            process.env.REACT_APP_ROOM + state.userChannel + "-328723!^*#@"
          }
          displayName={state.currentUser.username}
          onMeetingEnd={() => history.push("/")}
          loadingComponent={<p>Loading...</p>}
          errorComponent={<p>Oops, something went wrong</p>}
        />
      ) : (
        <Loading fade size={150} />
      )}
    </Box>
  );
};

export default Video;
