import React, { Component } from "react";

class CreateRoom extends Component {
  state = {
    roomName: "",
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
    this.setState({ roomName: "" });
  };

  render() {
    return (
      <div className="new-room-form">
        <form onSubmit={this.handleSubmit}>
          <input
            value={this.state.roomName}
            onChange={this.handleChange}
            type="text"
            placeholder="Create New Room"
            required
          />
          <button id="create-room-btn" type="submit">
            +
          </button>
        </form>
      </div>
    );
  }
}

export default CreateRoom;
