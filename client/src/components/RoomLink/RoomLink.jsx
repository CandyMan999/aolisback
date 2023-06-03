import React from "react";
import { useHistory } from "react-router-dom";
import { Text } from "../../components";
import { COLORS } from "../../constants";

const RoomLink = ({ dispatch, video, user }) => {
  let history = useHistory();
  const handleRoomClick = (roomId) => {
    dispatch({ type: "CHANGE_ROOM", payload: roomId });
    history.push("/");
  };

  return (
    <Text
      position={video ? "absolute" : undefined}
      style={!video ? undefined : { zIndex: 20, top: 50 }}
      margin={0}
      onClick={() => handleRoomClick(user.room._id)}
      center
      className="logo font-effect-fire-animation"
      color={COLORS.magenta}
      bold
    >
      Room: {user.room.name}
    </Text>
  );
};

export default RoomLink;
