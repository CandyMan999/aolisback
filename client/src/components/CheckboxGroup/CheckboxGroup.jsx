import React, { Fragment } from "react";
import { Checkbox } from "..";

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
