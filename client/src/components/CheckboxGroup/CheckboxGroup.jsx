import React, { Fragment } from "react";
import { Checkbox } from "..";

// interface Option {
//   value: string | number;
//   label: string;
// }

// interface Props {
//   name: string;
//   options: Option[];
// }

class CheckboxGroup extends React.PureComponent {
  render() {
    return (
      <Fragment>
        {this.props.options.map(({ value, label }) => (
          <Checkbox
            key={value}
            name={this.props.name}
            value={value}
            label={label}
          />
        ))}
      </Fragment>
    );
  }
}

export default CheckboxGroup;
