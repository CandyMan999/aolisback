import React from "react";
import { motion } from "framer-motion";
import GoogleLogin from "react-google-login";

class GoogleButton extends React.PureComponent {
  handleOnClick = (response) => {
    this.props.onClick(response, !!this.props.shouldPersist);
  };

  render() {
    const { disabled } = this.props;

    return (
      <motion.div whileTap={{ scale: 0.7 }} whileHover={{ scale: 1.1 }}>
        <GoogleLogin
          style={{ padding: "3px", marginRight: "5px" }}
          clientId={process.env.REACT_APP_GOOGLE_ID}
          disabled={disabled}
          theme={"dark"}
          buttonText={this.props.label}
          onSuccess={disabled ? undefined : this.handleOnClick}
          onFailure={this.handleOnClick}
        />
      </motion.div>
    );
  }
}

export default GoogleButton;
