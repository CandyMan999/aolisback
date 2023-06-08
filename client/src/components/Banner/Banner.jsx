import React from "react";

import { Box, Text, Icon } from "..";
import { COLORS } from "../../constants";
import { FONT_SIZES, ICON_SIZES } from "..";

// interface Props {
//   show: boolean;
//   duration?: number;
//   message: string;
//   closable?: boolean;
//   type?: "alert" | "success" | "error" | "info";
// }

// interface State {
//   show: boolean;
//   timeout?: any;
// }

class Banner extends React.PureComponent {
  constructor(props) {
    super(props);

    const { color, backgroundColor, iconName } = this.calculateColors();

    this.color = color;
    this.backgroundColor = backgroundColor;
    this.iconName = iconName;

    this.state = {
      show: props.show,
    };
  }

  componentDidMount() {
    this.props.show && this.props.duration && this.startTimer();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.duration) {
      // going from not showing to showing
      if (!!this.props.show && !prevProps.show) {
        this.startTimer();
      }

      // going from showing to not showing
      if (!this.props.show && !!prevProps.show) {
        this.killTimer();
        this.setState({ show: false, timeout: undefined });
      }
    } else {
      if (prevState.show !== this.props.show) {
        this.setState({ show: this.props.show });
      }
    }
  }

  componentWillUnmount() {
    const { timeout } = this.state;
    if (!!timeout) {
      clearTimeout(timeout);
    }
  }

  startTimer = () => {
    this.killTimer();
    this.setState({
      timeout: setTimeout(
        () => this.setState({ show: false }),
        this.props.duration
      ),
      show: true,
    });
  };

  killTimer = () => {
    const { timeout } = this.state;
    if (!!timeout) {
      clearTimeout(timeout);
    }
  };

  calculateColors = () => {
    switch (this.props.type) {
      case "alert":
        return {
          color: COLORS.textYellow,
          backgroundColor: COLORS.backgroundYellow,
          iconName: "alertCircle",
        };
      case "success":
        return {
          color: COLORS.textGreen,
          backgroundColor: COLORS.backgroundGreen,
          iconName: "checkCircle",
        };
      case "error":
        return {
          color: COLORS.textRed,
          backgroundColor: COLORS.backgroundRed,
          iconName: "minusCircle",
        };
      case "info":
        return {
          color: COLORS.textBlue,
          backgroundColor: COLORS.backgroundBlue,
          iconName: "infoCircle",
        };
      default:
        return {
          color: COLORS.black,
          backgroundColor: COLORS.white,
          iconName: "user",
        };
    }
  };

  handleClose = () => {
    this.killTimer();
    this.setState({
      show: false,
      timeout: undefined,
    });
  };

  render() {
    const { mobile } = this.props;
    return this.state.show ? (
      <Box
        width="95%"
        justifyContent="center"
        background={this.backgroundColor}
        paddingY={mobile ? 4 : 16}
        borderRadius={8}
        marginTop={5}
        position="fixed"
        bottom={20}
        zIndex={30}
        boxShadow={`2px 2px 4px 2px rgba(0, 0, 0, 0.3)`}
      >
        <Box center marginRight={mobile ? 15 : undefined}>
          <Box paddingRight={mobile ? 8 : 16}>
            <Icon
              name={this.iconName}
              color={this.color}
              size={ICON_SIZES.X_LARGE}
            />
          </Box>

          <Text
            marginRight={mobile ? 15 : 5}
            fontSize={mobile ? FONT_SIZES.SMALL : FONT_SIZES.LARGE}
            color={this.color}
          >
            {this.props.message}
          </Text>
        </Box>

        <Box
          style={{ alignItems: "flex-start" }}
          marginTop={mobile ? 5 : 15}
          position="absolute"
          right={mobile ? 12 : 24}
          height="100%"
          center
          margin={mobile ? 0 : undefined}
        >
          <Icon
            name="close"
            color={this.color}
            size={mobile ? ICON_SIZES.SMALL : ICON_SIZES.MEDIUM}
            onClick={this.handleClose}
            hoverColor={`${this.color}33`}
          />
        </Box>
      </Box>
    ) : null;
  }
}

export default Banner;
