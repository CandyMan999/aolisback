import React, { Component } from "react";
import { motion } from "framer-motion";
import Message from "./Message";
import { Loading, AnimatedHand, Text, Box, FONT_SIZES } from "../../components";
import ReactDOM from "react-dom";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.letters = [
      <Text bold fontSize={FONT_SIZES.XX_LARGE}>
        J
      </Text>,
      <Text bold fontSize={FONT_SIZES.XX_LARGE}>
        o
      </Text>,
      <Text bold fontSize={FONT_SIZES.XX_LARGE}>
        i
      </Text>,
      <Text bold fontSize={FONT_SIZES.XX_LARGE}>
        n
      </Text>,

      <Text bold fontSize={FONT_SIZES.XX_LARGE}>
        A
      </Text>,

      <Text bold fontSize={FONT_SIZES.XX_LARGE}>
        R
      </Text>,
      <Text bold fontSize={FONT_SIZES.XX_LARGE}>
        o
      </Text>,
      <Text bold fontSize={FONT_SIZES.XX_LARGE}>
        o
      </Text>,
      <Text bold fontSize={FONT_SIZES.XX_LARGE}>
        m
      </Text>,
      <AnimatedHand />,
    ];
  }

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
            <div
              className="join-a-room"
              style={{
                position:
                  this.props.mobile && !this.props.createInput
                    ? "absolute"
                    : undefined,
                top: "20%",
              }}
            >
              {this.letters.map((letter, index) => {
                return (
                  <motion.span
                    key={index}
                    style={{
                      display: "inline-block",
                      marginRight:
                        index === 3 || index === 4 ? "10px" : undefined,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.2 },
                    }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {letter}
                  </motion.span>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="message-list">
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
