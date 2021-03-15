import React from "react";
import { Box, Button, Text } from "../../components";
import { COLORS } from "../../constants";

class RoomList extends React.Component {
  render() {
    const { rooms, roomId, currentUser } = this.props;

    return (
      <div className="rooms-list">
        <ul>
          <h3>Rooms:</h3>
          {rooms &&
            rooms.map((room) => {
              const active = roomId === room._id ? "active" : "";
              const numberOfUsers =
                room.users && room.users.length ? room.users.length : 0;
              return (
                <Box
                  borderTop={active && `solid 2px ${COLORS.themeGreen}`}
                  borderBottom={active && `solid 2px ${COLORS.themeGreen}`}
                  key={room._id}
                  display="flex"
                  onClick={() => this.props.subscribeToRoom(room._id)}
                >
                  <Text
                    color={active ? COLORS.themeGreen : COLORS.lightGrey}
                    textShadow={active && `-2px 2px 3px ${COLORS.textRed}`}
                    className="userNumber"
                  >
                    {room.name}: Online {numberOfUsers}
                  </Text>
                </Box>
              );
            })}
        </ul>
      </div>
    );
  }
}

export default RoomList;
