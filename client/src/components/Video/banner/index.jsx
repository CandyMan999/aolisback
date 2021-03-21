import React, { useEffect, useState } from "react";
import { Text } from "../../../components";
const Banner = ({ channelOwner }) => {
  const [alert, setAlert] = useState(true);
  useEffect(() => {
    setTimeout(() => setAlert(false), 6000);
  });

  return (
    <div>
      <Text center className="videoTitle">
        {alert && (
          <Text color={"red"}>
            DOWNLOAD THE APP ITS FREE IF YOU ARE ON MOBILE
          </Text>
        )}
        {!!channelOwner
          ? `Join ${channelOwner}'s channel!`
          : "Join your own channel or click someone else's SCREEName to join their channel!"}
      </Text>
    </div>
  );
};

export default Banner;
