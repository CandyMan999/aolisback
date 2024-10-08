import React, { Component } from "react";

import Message from "./Message";
import { Loading, Box, JoinARoom, RoomList } from "../../components";
import ReactDOM from "react-dom";
// import goneChattingSVG from "../../pictures/goneChatting.svg";
import MainLogo from "../../pictures/MainLogo.png";

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
            <Box row height="100%">
              {!this.props.showRoomList && (
                <Box
                  justifyContent="center"
                  height={"100%"}
                  width={"100%"}
                  alignItems="center"
                  margin="auto"
                  style={{
                    overflow:
                      this.props.mobile && this.props.currentUserID
                        ? undefined
                        : "hidden",
                  }}
                >
                  {(!this.props.currentUserID || !this.props.mobile) && (
                    <img
                      width={"95%"}
                      style={{ opacity: 0.3 }}
                      src={MainLogo}
                      alt="Gone Chatting"
                    />
                  )}

                  <div
                    className="join-a-room"
                    style={{
                      position: "absolute",
                      top: "20%",
                    }}
                  >
                    {this.props.mobile && this.props.currentUserID && (
                      <JoinARoom isPointingDown={false} />
                    )}
                  </div>
                </Box>
              )}

              <RoomList
                roomId={this.props.roomId}
                subscribeToRoom={this.props.subscribeToRoom}
                rooms={this.props.rooms}
                currentUser={this.props.currentUser}
                loading={this.props.loading}
                mobile={this.props.mobile}
                showRoomList={this.props.showRoomList}
              />
            </Box>
          )}
        </div>
      );
    }

    return (
      <div
        className="message-list"
        style={{
          overflowY: "scroll",
        }}
      >
        {this.props.loading ? (
          <Loading ring size={"150px"} />
        ) : (
          !!this.props.messages.length &&
          !this.props.showRoomList &&
          this.props.messages.map((message, index) => {
            const isReply = !!message.replyTo;
            const replyToAuthor =
              isReply && message.replyTo.author
                ? message.replyTo.author.username
                : null;
            const replyToText =
              isReply && message.replyTo.text ? message.replyTo.text : null;
            console.log("message: ", message);
            return (
              <Message
                usernameClick={this.props.usernameClick}
                key={index}
                username={message.author.username}
                text={message.text}
                roomId={this.props.roomId}
                messageRoomId={message.room._id}
                currentUserID={
                  !!this.props.currentUserID && this.props.currentUserID
                }
                authorId={message.author._id}
                picture={
                  !!message.author.pictures.length && message.author.pictures[0]
                }
                currentUser={this.props.currentUser}
                createdAt={message.createdAt}
                commentId={message._id}
                replyToAuthor={replyToAuthor} // Pass replyTo author
                replyToText={replyToText} // Pass replyT
              />
            );
          })
        )}

        {this.props.showRoomList && (
          <RoomList
            roomId={this.props.roomId}
            subscribeToRoom={this.props.subscribeToRoom}
            rooms={this.props.rooms}
            currentUser={this.props.currentUser}
            loading={this.props.loading}
            mobile={this.props.mobile}
            showRoomList={this.props.showRoomList}
          />
        )}
      </div>
    );
  }
}

export default MessageList;
