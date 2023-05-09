import React, { useContext, useState, useEffect, Fragment } from "react";
import {
  Box,
  Icon,
  ICON_SIZES,
  VideoPlayer,
  Text,
  FONT_SIZES,
} from "../../components";
import { COLORS } from "../../constants";
import { useHistory, useLocation } from "react-router-dom";

import { useClient } from "../../client";
import Context from "../../context";

const Message = () => {
  let history = useHistory();
  const location = useLocation();
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const currentUser = state.currentUser;
  const { sentVideos, receivedVideos } = currentUser;
  const senderID = new URLSearchParams(location.search).get("sender");

  const [groupedReceived, setGroupReceived] = useState(null);

  useEffect(() => {
    if (receivedVideos && !!receivedVideos.length && !!senderID) {
      groupVideosBySender(receivedVideos, sentVideos);
    }
  }, [senderID]);

  const groupVideosBySender = async (receivedVids, sentVids) => {
    const array = [];

    for (const video of receivedVids) {
      const senderId = video.sender._id;

      if (senderId === senderID) {
        array.push(video);
      }
    }

    for (const video of sentVids) {
      const senderId = video.receiver._id;

      if (senderId === senderID) {
        array.push(video);
      }
    }
    const data = await orderByCreatedAt(array);
    console.log("ordered: ", data);
    setGroupReceived(data);
  };

  const orderByCreatedAt = (array) => {
    return array.sort((a, b) => {
      const dateA = new Date(parseInt(a.createdAt));
      const dateB = new Date(parseInt(b.createdAt));
      return dateA - dateB;
    });
  };

  const handleOnClick = () => {
    history.push({
      pathname: "/message-center",
    });
  };

  return (
    groupedReceived &&
    !!groupedReceived.length && (
      <Fragment>
        <Text width={"100%"} bold fontSize={FONT_SIZES.XX_LARGE} center>{`${
          groupedReceived[0].sender._id === currentUser._id
            ? groupedReceived[0].receiver.username
            : groupedReceived[0].sender.username
        }'s Messages`}</Text>
        <Box
          display="flex"
          margin={20}
          justifyContent="space-around"
          card
          height={"auto"}
          style={{ overflow: "scroll" }}
          width="auto"
          maxHeight={1066}
          column
        >
          <Box
            onClick={handleOnClick}
            position="absolute"
            top={20}
            zIndex={20}
            right={
              groupedReceived[0].sender._id === currentUser._id ? undefined : 40
            }
            left={
              groupedReceived[0].sender._id === currentUser._id ? 40 : undefined
            }
          >
            <Icon
              name="back"
              size={ICON_SIZES.XXX_LARGE}
              color={COLORS.black}
            />
          </Box>
          {groupedReceived &&
            !!groupedReceived.length &&
            groupedReceived.map((video) => {
              return (
                <Box
                  key={video.publicId}
                  width="100%"
                  display="flex"
                  justifyContent={
                    video.sender._id === currentUser._id
                      ? "flex-end"
                      : undefined
                  }
                >
                  <Box column>
                    <VideoPlayer
                      publicId={video.publicId}
                      controls={true}
                      height={100}
                      width={150}
                    />
                    <Text center bold>
                      {video.sender._id === currentUser._id
                        ? "Sent Video"
                        : "Received Video"}
                    </Text>
                  </Box>
                </Box>
              );
            })}
        </Box>
      </Fragment>
    )
  );
};

export default Message;
