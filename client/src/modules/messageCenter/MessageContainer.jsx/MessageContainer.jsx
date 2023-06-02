import React from "react";
import { Image, CloudinaryContext } from "cloudinary-react";

import {
  Box,
  Text,
  Icon,
  ICON_SIZES,
  VideoPlayer,
  FONT_SIZES,
  Picture,
} from "../../../components";
import { COLORS } from "../../../constants";
import { withRouter } from "react-router-dom";

const MessageContainer = ({
  history,
  client,
  dispatch,
  currentUser,
  receivedVideos,
  mobile,
}) => {
  const handleOnClick = (senderID) => {
    history.push({
      pathname: "/message",
      search: `?sender=${senderID}`,
    });
  };

  return receivedVideos && receivedVideos.length > 0 ? (
    <Box width="100%" column display="flex">
      {receivedVideos.map((video, i) => {
        const isLastMessage = i === receivedVideos.length - 1;
        return (
          <Box
            display="flex"
            width="100%"
            borderTop={`solid 1px ${COLORS.grey}`}
            borderBottom={
              isLastMessage
                ? `solid 2px ${COLORS.grey}`
                : `solid 1px ${COLORS.grey}`
            }
            onClick={() => handleOnClick(video[0].sender._id)}
            key={`${video[0].publicId}-${i}`}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              paddingX={"5%"}
              paddingY={3}
            >
              <Box alignItems="center" width={!mobile ? "100%" : undefined}>
                <Picture
                  height={84}
                  width={84}
                  profilePic={video[0].sender.pictures[0]}
                  name={video[0].sender.username}
                />
                <Text paddingLeft={"5%"} bold>
                  Video Message{video.length > 1 ? "s" : undefined} from{" "}
                  {video[0].sender.username}
                </Text>
              </Box>
              <Box onClick={() => handleOnClick(video[0].sender._id)}>
                <VideoPlayer
                  publicId={video[video.length - 1].publicId}
                  height={90}
                  controls={false}
                  fullScreen={true}
                  borderRadius={"10px"}
                />
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  ) : (
    <Box height={"calc(100vH - 60px)"} width="100%" maxHeight={1066}>
      <Box
        style={{ margin: "20px", textAlign: "center" }}
        width="100%"
        height={"60vH"}
        justifyContent="space-around"
        paddingBottom={"10%"}
        card
      >
        <Box display={"flex"} column justifyContent="space-around">
          <Box centerText>
            <Text fontSize={FONT_SIZES.X_LARGE} bold>
              No Video Messages At This Time!
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default withRouter(MessageContainer);
