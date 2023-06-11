import React, { Component } from "react";

import Message from "./Message";
import { Loading, Box, JoinARoom } from "../../components";
import ReactDOM from "react-dom";
import goneChattingSVG from "../../pictures/goneChatting.svg";

class MessageList extends Component {
  componentWillUpdate() {
    const node = ReactDOM.findDOMNode(this);
    this.shouldScrollToBottom =
      node.scrollTop + node.clientHeight + 100 >= node.scrollHeight;
  }

  componentDidUpdate() {
    if (this.shouldScrollToBottom) {
      const node = ReactDOM.findDOMNode(this);
      node.scrollTop = node.scrollHeight;
    }
  }

  render() {
    if (!this.props.roomId) {
      return (
        <div className="message-list">
          {this.props.loading ? (
            <Loading ring size={"150px"} />
          ) : (
            <Box
              justifyContent="center"
              height={"100%"}
              width={"100%"}
              alignItems="center"
            >
              <img
                height={this.props.mobile ? undefined : "100%"}
                width={"100%"}
                style={{ opacity: 0.3 }}
                src={goneChattingSVG}
                alt="Gone Chatting"
              />
              <div
                className="join-a-room"
                style={{
                  position: "absolute",
                  top: "20%",
                }}
              >
                {this.props.mobile && <JoinARoom isPointingDown={false} />}
              </div>
            </Box>
          )}
        </div>
      );
    }

    return (
      <div
        className="message-list"
        style={{ overflowY: "scroll", overflowX: "hidden" }}
      >
        {this.props.loading ? (
          <Loading ring size={"150px"} />
        ) : (
          !!this.props.messages.length &&
          this.props.messages.map((message, index) => {
            return (
              <Message
                usernameClick={this.props.usernameClick}
                key={index}
                username={message.author.username}
                text={message.text}
                roomId={this.props.roomId}
                messageRoomId={message.room._id}
                currentUser={!!this.props.currentUser && this.props.currentUser}
                authorId={message.author._id}
                picture={
                  !!message.author.pictures.length && message.author.pictures[0]
                }
                createdAt={message.createdAt}
              />
            );
          })
        )}
      </div>
    );
  }
}

export default MessageList;
