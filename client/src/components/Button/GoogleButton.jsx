import React from "react";
import GoogleLogin from "react-google-login";

import { Box, Icon, ICON_SIZES } from "..";
import Button from ".";
import { COLORS } from "../../constants";

class GoogleButton extends React.PureComponent {
  handleOnClick = (response) => {
    this.props.onClick(response, !!this.props.shouldPersist);
  };

  render() {
    const { disabled } = this.props;

    return (
      <GoogleLogin
        style={{ padding: "3px", marginRight: "5px" }}
        clientId={process.env.REACT_APP_GOOGLE_ID}
        render={(renderProps) => (
          <Button
            width={112}
            onClick={renderProps.onClick}
            color={disabled ? COLORS.lightGrey : COLORS.googleRed}
            disabled={disabled}
          >
            <Box
              paddingLeft={4}
              paddingRight={10}
              paddingY={6}
              justifyContent="space-around"
            >
              <Icon
                name="google"
                color={COLORS.white}
                size={ICON_SIZES.X_LARGE}
              />
              <span
                style={{
                  color: COLORS.white,
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {this.props.label}
              </span>
            </Box>
          </Button>
        )}
        onSuccess={disabled ? undefined : this.handleOnClick}
        onFailure={this.handleOnClick}
      />
    );
  }
}

export default GoogleButton;
