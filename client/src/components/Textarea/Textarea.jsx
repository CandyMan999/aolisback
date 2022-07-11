import React from "react";
import { connect } from "formik";

import { Box, Text } from "..";
import { COLORS } from "../../constants";

import styled from "@emotion/styled";
import { css } from "@emotion/css";

class Textarea extends React.PureComponent {
  handleChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e);
    } else {
      this.props.formik.setFieldValue(this.props.name, e.currentTarget.value);
    }
  };

  render() {
    const {
      cols,
      disabled,
      fontSize,
      formik: { values, touched, errors, setFieldValue, ...rest },
      full,
      maxLength,
      name,
      onChange,
      placeholder,
      readOnly,
      rows,
      value,
      height,
      width,
      withoutFormik,
    } = this.props;

    const hasError = !withoutFormik && !!errors && !!errors[name];

    const currentValue = value || (!withoutFormik && values[name]) || "";

    return (
      <Box
        direction="column"
        marginY={4}
        marginX={8}
        width={full ? "100%" : width}
      >
        <StyledTextarea
          disabled={disabled || readOnly}
          cols={cols}
          hasError={hasError}
          maxLength={maxLength}
          onChange={this.handleChange}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={rows}
          value={currentValue}
          fontSize={fontSize}
          height={height}
          width={width}
        />
        <Box
          position="absolute"
          right={10}
          bottom={-10}
          display="flex"
          justifyContent="flex-end"
        >
          <Text fontSize="small" color={COLORS.darkGrey}>
            {currentValue.length} of {maxLength} characters
          </Text>
        </Box>

        {hasError && <p className={errorStyles}>{errors[name]}</p>}
      </Box>
    );
  }
}

const StyledTextarea = styled("textarea")(
  ({ value, fontSize, hasError, readOnly, height, width }) => ({
    border: `2px solid ${
      hasError ? COLORS.darkRed : !!value ? COLORS.darkGrey : COLORS.lightGrey
    }`,
    borderRadius: "6px",
    cursor: readOnly ? "pointer" : undefined,
    fontSize: fontSize ? `${fontSize}px` : "14px",
    padding: "6px 4px",
    height: height ? `${height}px` : undefined,
    transition: "border 0.5s",
    // width: width ? width : "100%",
    resize: "vertical",
    [":focus"]: {
      outline: 0,
    },
    ["::placeholder"]: {
      color: COLORS.grey,
    },
  })
);

const errorStyles = css`
  color: ${COLORS.darkRed};
  font-size: "11px";
  margin: 0;
  position: "absolute";
  top: "36px";
`;

export default connect(Textarea);
