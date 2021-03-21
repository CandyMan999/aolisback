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
      margin,
      padding,
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
      margin,
      padding,
    } = this.props;

    return (
      <Box onClick={this.handleChange} marginY={12} margin={margin} center>
        {label && (
          <Box paddingY={8} padding={padding}>
            <p style={{ margin: "0px" }}>{label}</p>
          </Box>
        )}
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
      </Box>
    );
  }
}

export default connect(Checkbox);
