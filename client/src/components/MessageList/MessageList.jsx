import React, { Component } from "react";
import Message from "./Message";
import ReactDOM from "react-dom";
import { Text, Box } from "../../components";
import { COLORS } from "../../constants";

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
          <div className="join-a-room">
            Join a Room!{" "}
            <span
              style={{
                fontSize: "100px",
              }}
            >
              &rarr;
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="message-list">
        {!!this.props.messages.length &&
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
                  !!message.author.pictures.length &&
                  message.author.pictures[0].url
                }
                createdAt={message.createdAt}
              />
            );
          })}
      </div>
    );
  }
}

export default MessageList;
