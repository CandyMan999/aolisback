import React from "react";
import { Image, CloudinaryContext } from "cloudinary-react";

import { Box, Text, Icon, ICON_SIZES, VideoPlayer } from "../../../components";
import { COLORS } from "../../../constants";
import { withRouter } from "react-router-dom";

const MessageContainer = ({
  history,
  client,
  dispatch,
  currentUser,
  receivedVideos,
}) => {
  const handleOnClick = (senderID) => {
    history.push({
      pathname: "/message",
      search: `?sender=${senderID}`,
    });
  };

  return receivedVideos && receivedVideos.length ? (
    receivedVideos.map((video, i) => {
      return (
        <Box
          display="flex"
          width="100%"
          borderTop={
            receivedVideos.length < 2
              ? `solid 2px ${COLORS.grey}`
              : i === receivedVideos.length - 1
              ? undefined
              : `solid 2px ${COLORS.grey}`
          }
          borderBottom={
            i === 0 && receivedVideos.length > 2
              ? undefined
              : `solid 2px ${COLORS.grey}`
          }
          onClick={() => handleOnClick(video[0].sender._id)}
          key={`${video[0].publicId}-${i}`}
        >
          {!!video[0].sender.pictures[0] &&
          !!video[0].sender.pictures[0].publicId ? (
            !!video[0] && !!video[0].sender.pictures[0].publicId ? (
              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                paddingX={"5%"}
                paddingY={3}
                style={{ alignItems: "baseline" }}
              >
                <Box alignItems="center">
                  <CloudinaryContext cloudName="localmassagepros">
                    <Image
                      alt={`${video[0].sender.username}-profile-pic`}
                      style={{
                        borderRadius: "50%",
                        height: 84,
                        width: 84,
                        marginBottom: "0px",
                      }}
                      loading="lazy"
                      publicId={video[0].sender.pictures[0].publicId}
                    ></Image>
                  </CloudinaryContext>
                  <Text paddingLeft={"5%"} bold>
                    Video Message{video.length > 1 ? "s" : undefined} from{" "}
                    {video[0].sender.username}
                  </Text>
                </Box>

                <VideoPlayer
                  publicId={video[video.length - 1].publicId}
                  height={90}
                  controls={false}
                />
              </Box>
            ) : (
              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                paddingX={"5%"}
                paddingY={3}
                style={{ alignItems: "baseline" }}
              >
                <Box alignItems="center">
                  <img
                    alt={`${video[0].sender.username}-profile-pic`}
                    style={{
                      borderRadius: "50%",
                      height: 84,
                      width: 84,
                      marginBottom: "8px",
                    }}
                    src={video[0].sender.pictures[0].url}
                  />
                  <Text paddingLeft={"5%"} bold>
                    Video Message{video.length > 1 ? "s" : undefined} from{" "}
                    {video[0].sender.username}
                  </Text>
                </Box>

                <VideoPlayer publicId={video[0].publicId} height={90} />
              </Box>
            )
          ) : (
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              paddingX={"5%"}
              paddingY={3}
              alignItems="center"
            >
              <Box alignItems="center">
                <Box
                  borderRadius="50%"
                  height={84}
                  width={84}
                  center
                  background={COLORS.lightGrey}
                  justifyContent="center"
                  marginBottom={8}
                >
                  <Icon
                    name="user"
                    size={ICON_SIZES.XX_LARGE}
                    color={COLORS.black}
                  />
                </Box>
                <Text paddingLeft={"5%"} bold>
                  Video Message{video.length > 1 ? "s" : undefined} from{" "}
                  {video[0].sender.username}
                </Text>
              </Box>

              <VideoPlayer publicId={video[0].publicId} height={90} />
            </Box>
          )}
        </Box>
      );
    })
  ) : (
    <Box
      display="flex"
      width="100%"
      borderTop={`solid 2px ${COLORS.grey}`}
      borderBottom={`solid 2px ${COLORS.grey}`}
    >
      <Text>No Video Messages at this time!</Text>
    </Box>
  );
};

export default withRouter(MessageContainer);
