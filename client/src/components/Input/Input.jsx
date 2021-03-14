import React from "react";
import { connect } from "formik";

import { Box } from "..";
import { COLORS } from "../../constants";
import styled from "@emotion/styled";
import { css } from "@emotion/css";

// interface Props {
//   disabled?: boolean;
//   hasClose?: boolean;
//   name: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onClose?: () => void;
//   placeholder?: string;
//   readOnly?: boolean;
//   type?: string;
//   value?: string;
//   withoutFormik?: boolean;
//   width?: number;
//   full?: boolean;
//   fontSize?: number;
// }

// interface InputProps {
//   hasError?: boolean;
//   readOnly?: boolean;
//   value?: string;
//   fontSize?: number;
// }

class Input extends React.PureComponent {
  handleChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e);
    } else {
      this.props.formik.setFieldValue(this.props.name, e.currentTarget.value);
    }
  };

  render() {
    const {
      disabled,
      formik: { values, touched, errors, setFieldValue, ...rest },
      full,
      fontSize,
      hasClose,
      name,
      onClose,
      placeholder,
      readOnly,
      type,
      value,
      width,
      withoutFormik,
    } = this.props;

    const hasError = !withoutFormik && !!errors && !!errors[name];

    return (
      <Box
        direction="column"
        marginY={4}
        marginX={8}
        width={full ? "100%" : width}
      >
        <StyledInput
          disabled={disabled || readOnly}
          readOnly={readOnly}
          hasError={hasError}
          onChange={this.handleChange}
          placeholder={placeholder || ""}
          type={type}
          fontSize={fontSize}
          value={value || (!withoutFormik && values[name]) || ""}
        />
        {hasClose && !!onClose && (
          <Box
            onClick={this.props.onClose}
            position="absolute"
            top={6}
            right={16}
          >
            <p style={{ color: COLORS.grey, margin: 0 }}>X</p>
          </Box>
        )}
        {hasError && <p className={errorStyles}>{errors[name]}</p>}
      </Box>
    );
  }
}

const StyledInput = styled.input(({ value, hasError, readOnly, fontSize }) => ({
  background: readOnly && !value ? COLORS.lighterGrey : undefined,
  border: "none",
  borderBottom: `2px solid ${
    hasError
      ? COLORS.darkRed
      : !!value && !readOnly
      ? COLORS.darkGrey
      : COLORS.lightGrey
  }`,
  cursor: readOnly ? "pointer" : undefined,
  fontSize: fontSize ? `${fontSize}px` : "14px",
  padding: "6px 4px",
  transition: "border-bottom 0.5s",
  width: "100%",
  [":focus"]: {
    outline: 0,
  },
  ["::placeholder"]: {
    color: COLORS.grey,
  },
}));

const errorStyles = css({
  color: COLORS.darkRed,
  fontSize: "11px",
  margin: 0,
  position: "absolute",
  top: "36px",
});

export default connect(Input);
