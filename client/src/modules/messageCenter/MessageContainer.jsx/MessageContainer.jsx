import React, { useEffect } from "react";

import {
  Box,
  Text,
  VideoPlayer,
  FONT_SIZES,
  Picture,
  Icon,
  ICON_SIZES,
} from "../../../components";
import { COLORS } from "../../../constants";
import { withRouter } from "react-router-dom";

const MessageContainer = ({ history, receivedVideos, mobile }) => {
  useEffect(() => {
    if (receivedVideos && !!receivedVideos.length) {
      sortByNewest();
    }
  }, [receivedVideos]);

  const handleOnClick = (senderID) => {
    history.push({
      pathname: "/message",
      search: `?sender=${senderID}`,
    });
  };

  const sortByNewest = () => {
    return receivedVideos.sort((a, b) => {
      const viewedA = a.some((video) => !video.viewed);
      const viewedB = b.some((video) => !video.viewed);

      if (viewedA && !viewedB) {
        return -1; // Move group with viewed videos to a lower index
      } else if (!viewedA && viewedB) {
        return 1; // Move group with unviewed videos to a higher index
      } else {
        return 0; // Keep the order unchanged
      }
    });
  };

  return receivedVideos && receivedVideos.length > 0 ? (
    <Box width="100%" column display="flex">
      {receivedVideos.map((group, i) => {
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
            onClick={() => handleOnClick(group[0].sender._id)}
            key={`${group[0].publicId}-${i}`}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              paddingX={"5%"}
              paddingY={3}
            >
              <Box alignItems="center" width={!mobile ? "100%" : undefined}>
                <Box>
                  <Picture
                    height={84}
                    width={84}
                    withShadow={true}
                    profilePic={group[0].sender.pictures[0]}
                    name={group[0].sender.username}
                  />
                  <Box
                    position="absolute"
                    top={-20}
                    right={-30}
                    borderRadius={"50%"}
                  >
                    {group.some((video) => !video.viewed) && (
                      <Icon
                        style={{ zIndex: 100 }}
                        name="new"
                        size={ICON_SIZES.XXX_LARGE}
                        color={COLORS.red}
                        fill={COLORS.white}
                      />
                    )}
                  </Box>
                </Box>

                <Text paddingLeft={"5%"} bold>
                  Video Message{group.length > 1 ? "s" : undefined} from{" "}
                  {group[0].sender.username}
                </Text>
              </Box>
              <Box
                maxWidth={120}
                onClick={() => handleOnClick(group[0].sender._id)}
              >
                <VideoPlayer
                  publicId={group[group.length - 1].publicId}
                  // videoUrl={group[group.length - 1].url}
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
        style={{
          margin: "20px",
          textAlign: "center",
          borderColor: COLORS.pink,
          opacity: 0.8,
        }}
        background={COLORS.lightPurple}
        width="100%"
        height={"60vH"}
        justifyContent="space-around"
        paddingBottom={"10%"}
        card
      >
        <Box display={"flex"} column justifyContent="space-around">
          <Box centerText>
            <Text fontSize={FONT_SIZES.X_LARGE} bold color={COLORS.deepPurple}>
              No Video Messages At This Time!
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default withRouter(MessageContainer);
