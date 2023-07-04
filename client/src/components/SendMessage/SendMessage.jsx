import React, { Component } from "react";
import { Icon, Box } from "../../components";
import { COLORS } from "../../constants";
import { isMobile } from "react-device-detect";

class SendMessageForm extends Component {
  state = {
    message: "",
  };

  handleChange = (e) => {
    this.setState({
      message: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.sendMessage(this.state.message);
    this.setState({
      message: "",
    });
  };

  handleIsLoggedIn = async () => {
    try {
      if (!this.props.currentUserID) {
        this.props.dispatch({ type: "TOGGLE_SIGNUP", payload: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className="send-message-form"
        onClick={() => this.handleIsLoggedIn()}
      >
        <Box position="relative" width={"100%"} height={"100%"}>
          <input
            disabled={this.props.disabled}
            onChange={this.handleChange}
            style={{ boxShadow: `0px 1px 8px 4px rgba(0, 0, 0, 0.3)` }}
            value={this.state.message}
            placeholder="Type your message and hit ENTER"
            type="text"
          />

          {!isMobile && (
            <Box
              position="absolute"
              right={5}
              top={"15%"}
              backgroundColor={this.state.message ? COLORS.green : undefined}
              borderRadius={10}
              paddingTop={2}
              paddingRight={2}
              paddingBottom={4}
              paddingLeft={4}
              onClick={this.handleSubmit}
            >
              <Icon
                name="send"
                color={this.state.message ? COLORS.white : undefined}
              />
            </Box>
          )}
        </Box>
      </form>
    );
  }
}

export default SendMessageForm;
