import React from "react";
import { Text } from "../..";
const VideoChannel = ({ channelOwner }) => {
  return (
    <div>
      <Text center className="videoTitle">
        {!!channelOwner
          ? `Join ${channelOwner}'s channel!`
          : "Join your own channel or click someone else's SCREEName to join their channel!"}
      </Text>
    </div>
  );
};

export default VideoChannel;
