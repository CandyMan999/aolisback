import React from "react";
import { connect } from "formik";

import { Box, Text } from "..";
import { COLORS } from "../../constants";

// import { FormikConnectedProps } from "../../types/formik";
import styled from "@emotion/styled";
import { css } from "@emotion/css";

// interface Props {
//   rows?: number;
//   cols?: number;
//   placeholder?: string;
//   maxLength?: number;
//   disabled?: boolean;
//   name: string;
//   onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
//   value?: string;
//   withoutFormik?: boolean;
//   width?: number;
//   full?: boolean;
//   fontSize?: number;
//   readOnly?: boolean;
// }

// interface TextareaProps {
//   value?: string;
//   fontSize?: number;
//   hasError?: boolean;
//   readOnly?: boolean;
// }

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
        />
        <Box
          position="absolute"
          bottom={-16}
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
  ({ value, fontSize, hasError, readOnly }) => ({
    border: `2px solid ${
      hasError ? COLORS.darkRed : !!value ? COLORS.darkGrey : COLORS.lightGrey
    }`,
    borderRadius: "6px",
    cursor: readOnly ? "pointer" : undefined,
    fontSize: fontSize ? `${fontSize}px` : "14px",
    padding: "6px 4px",
    transition: "border 0.5s",
    width: "100%",
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
