import React from "react";
import { connect } from "formik";

import { Box } from "..";
import { COLORS } from "../../constants";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import { FONT_SIZES } from "../Text";

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
      formik: FormikFormProps,
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
      error,
      mobile,
      marginX,
      marginRight,
      paddingX,
      borderRadius,
      withoutFormik,
    } = this.props;

    const hasError =
      !withoutFormik &&
      !!FormikFormProps.errors &&
      !!FormikFormProps.errors[name];

    return (
      <Box
        direction="column"
        marginY={4}
        marginX={marginX ? marginX : 8}
        marginRight={marginRight ? marginRight : undefined}
        height={hasError ? 50 : undefined}
        width={full ? "100%" : width}
        paddingX={paddingX ? paddingX : undefined}
      >
        <StyledInput
          style={{ borderRadius: borderRadius ? borderRadius : undefined }}
          disabled={disabled || readOnly}
          readOnly={readOnly}
          hasError={hasError}
          fontColor={COLORS.black}
          onChange={this.handleChange}
          placeholder={placeholder || ""}
          type={type}
          fontSize={mobile ? FONT_SIZES.X_SMALL : fontSize}
          value={
            value || (!withoutFormik && FormikFormProps.values[name]) || ""
          }
          width={width}
        />
        {hasClose && !!onClose && (
          <Box
            onClick={this.props.onClose}
            position="absolute"
            top={6}
            left={"95%"}
          >
            <p style={{ color: COLORS.grey, margin: 0 }}>X</p>
          </Box>
        )}
        {error && <p className={errorStyles}>{error}</p>}
        {hasError && (
          <p className={errorStyles}>{FormikFormProps.errors[name]}</p>
        )}
      </Box>
    );
  }
}

const StyledInput = styled.input(
  ({ value, hasError, readOnly, fontSize, width }) => ({
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
    autofocus: false,
    transition: "border-bottom 0.5s",
    width: width ? width : "100%",
    ":focus": {
      outline: 0,
    },
    "::placeholder": {
      color: readOnly ? COLORS.darkGrey : COLORS.grey,
    },
  })
);

const errorStyles = css({
  color: COLORS.darkRed,
  fontSize: "11px",
  margin: 0,
  position: "absolute",
  top: "36px",
});

export default connect(Input);
