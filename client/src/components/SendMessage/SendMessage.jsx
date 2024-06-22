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
        style={{ paddingBottom: "1%" }}
      >
        <Box
          position="relative"
          width={"90%"}
          height={"100%"}
          display="flex"
          alignItems="center"
        >
          <Box
            flex={1}
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "20px",
              marginLeft: "1%",
              boxShadow: `0px 1px 8px 4px ${
                this.state.message ? COLORS.vividBlue : `rgba(0, 0, 0, 0.3)`
              }`,
            }}
          >
            <input
              disabled={this.props.disabled}
              onChange={this.handleChange}
              style={{
                border: "none",
                flex: 1,
                height: "100%",
                padding: "10px",
                borderRadius: "20px",
                outline: "none",
              }}
              value={this.state.message}
              placeholder="Type your message and hit ENTER"
              type="text"
            />
          </Box>

          {!isMobile && (
            <Box
              position="absolute"
              right={5}
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding="0 10px"
              backgroundColor={
                this.state.message ? COLORS.lightPurple : undefined
              }
              borderRadius={10}
              style={{
                transition: "background-color 0.4s",
                cursor: "pointer",
              }}
              onClick={this.handleSubmit}
            >
              <Icon
                name="send"
                color={this.state.message ? COLORS.pink : undefined}
              />
            </Box>
          )}
        </Box>
      </form>
    );
  }
}

export default SendMessageForm;
