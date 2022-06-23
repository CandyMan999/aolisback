import React, { Component } from "react";
import { Input } from "../../components";
import { motion } from "framer-motion";

class CreateRoom extends Component {
  state = {
    roomName: "",
    touched: false,
  };

  handleChange = (e) => {
    this.setState({
      roomName: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const variables = {
      name: this.state.roomName,
      _id: this.props.currentUserID,
    };
    this.props.createRoom(variables);
    this.setState({ roomName: "", touched: false });
  };

  render() {
    return (
      <motion.div
        onClick={() => this.setState({ touched: !this.state.touched })}
        // onMouseEnter={() => this.setState({ touched: true })}
        // onMouseLeave={() => this.setState({ touched: false })}
        className="new-room-form"
        animate={{ width: this.state.touched ? "50vW" : "100%" }}
        transition={{ ease: "linear", duration: 0.5 }}
        style={{ border: "1px solid #69ffb4" }}
      >
        <form onSubmit={this.handleSubmit}>
          {/* <input
            value={this.state.roomName}
            onChange={this.handleChange}
            type="text"
            placeholder="Create Room"
            required
            autoFocus={false}
          /> */}
          <Input
            style={{
              height: "100%",
              width: "100%",
            }}
            fontSize={"10px"}
            withoutFormik
            value={this.state.roomName}
            onChange={this.handleChange}
            type="text"
            placeholder="Create Room"
            required
            autoFocus={false}
          />

          <button id="create-room-btn" type="submit">
            +
          </button>
        </form>
      </motion.div>
    );
  }
}

export default CreateRoom;
