import React from "react";
import { connect } from "formik";

import { Box } from "..";

class Checkbox extends React.PureComponent {
  handleChange = () => {
    const {
      formik: { setFieldValue, values },
      name,
      value,
      onChange,
      withoutFormik,
    } = this.props;

    if (!!onChange && withoutFormik) {
      return onChange(!value);
    }

    const fieldValue = values[name];

    // Single means its just a true false field, so we toggle it
    if (!value) {
      return setFieldValue(name, !fieldValue);
    }

    if (fieldValue.includes(value)) {
      setFieldValue(
        name,
        fieldValue.filter((val) => val !== value)
      );
    } else {
      setFieldValue(name, [...fieldValue, value]);
    }
  };

  render() {
    const {
      label,
      name,
      value,
      formik: { values, touched, errors, setFieldValue, ...rest },
      withoutFormik,
    } = this.props;

    return (
      <Box onClick={this.handleChange} marginY={12} center>
        <input
          checked={
            withoutFormik
              ? value
              : value
              ? values[name].includes(value)
              : values[name]
          }
          type="checkbox"
          readOnly
        />
        {label && (
          <Box paddingX={8}>
            <p>{label}</p>
          </Box>
        )}
      </Box>
    );
  }
}

export default connect(Checkbox);
