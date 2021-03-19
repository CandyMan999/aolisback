import React from "react";

import { Box } from "..";

import { css } from "@emotion/css";
import { COLORS } from "../../constants";

// interface Props {
//   id: number;
//   text: string;
//   onSelect: (id: number) => void;
// }

class Option extends React.PureComponent {
  handleSelect = () => {
    this.props.onSelect(this.props.id);
  };

  render() {
    return (
      <Box
        className={optionStyle}
        border={`1px solid ${COLORS.lightGrey}`}
        background={COLORS.white}
        padding={4}
        onClick={this.handleSelect}
      >
        {this.props.text}
      </Box>
    );
  }
}

const optionStyle = css`
  &:hover {
    background: ${COLORS.lighterGrey};
  }
`;

export default Option;
