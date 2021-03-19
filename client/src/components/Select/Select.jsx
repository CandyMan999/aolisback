import React from "react";
import { connect } from "formik";

import { Box, Input } from "..";
import Option from "./Option";
import { COLORS } from "../../constants";

// import { FormikConnectedProps } from "../../../../UNUSED_TS_TYPES/formik";
import OutsideClickHandler from "react-outside-click-handler";

// interface SelectOption {
//   id: number;
//   text: string;
// }

// declare type OnChangeArg = SelectOption | string | number | null;

// interface Props {
//   isTypeahead?: boolean;
//   name: string;
//   onChange?: (value: OnChangeArg) => void;
//   options: SelectOption[];
//   placeholder: string;
//   value?: any;
//   withoutFormik?: boolean;
//   horizontal?: boolean;
//   openLeft?: number;
//   openRight?: number;
// }

// interface State {
//   showDropdown: boolean;
//   currentValue: string | null;
// }

class Select extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showDropdown: false,
      currentValue: props.isTypeahead ? "" : null,
    };
  }

  getTextForOption = (id) => {
    const option = this.props.options.find((option) => id === option.id);
    return option ? option.text : "";
  };

  handleChange = (value) => {
    if (this.props.withoutFormik) {
      this.props.onChange(value);
    } else {
      this.props.formik.setFieldValue(this.props.name, value);
    }
  };

  handleInputChange = (e) => {
    this.setState({ currentValue: e.currentTarget.value });
  };

  handleOptionSelect = (id) => {
    this.handleChange(id);
    this.setState({ showDropdown: false, currentValue: null });
  };

  handleClose = () => {
    this.handleChange(null);
    this.setState({ currentValue: null });
  };

  showDropdown = () => {
    this.setState({ showDropdown: true });
  };

  closeDropdown = () => {
    this.setState({ showDropdown: false });
  };

  render() {
    const {
      isTypeahead,
      name,
      placeholder,
      withoutFormik,
      formik: { values, touched, errors },
      horizontal,
      openLeft,
      openRight,
    } = this.props;

    const value = withoutFormik ? this.props.value : values && values[name];

    let options = this.props.options;
    if (isTypeahead && !!this.state.currentValue) {
      options = options.filter((option) =>
        option.text
          .toLowerCase()
          .includes(this.state.currentValue.toLowerCase())
      );
    }

    return (
      <OutsideClickHandler onOutsideClick={this.closeDropdown}>
        <Box noFlex>
          <Box noFlex onClick={this.showDropdown}>
            <Input
              hasClose={isTypeahead}
              name={name}
              onChange={this.handleInputChange}
              onClose={
                isTypeahead && !!this.props.value ? this.handleClose : undefined
              }
              placeholder={placeholder}
              readOnly={!isTypeahead}
              value={this.state.currentValue || this.getTextForOption(value)}
              withoutFormik
            />
          </Box>
          {this.state.showDropdown && (
            <Box
              display={horizontal ? "flex" : undefined}
              noFlex={!horizontal}
              boxShadow={`2px 2px 0 0 ${COLORS.grey}`}
              position="absolute"
              zIndex={10}
              left={horizontal && openLeft ? openLeft : undefined}
              right={horizontal && openRight ? openRight : undefined}
              maxHeight={!horizontal ? 230 : undefined}
              width={horizontal ? "fit-content" : "100%"}
              overflowX={horizontal ? "auto" : undefined}
              overflowY={horizontal ? undefined : "auto"}
              borderRadius={8}
            >
              {options.map(({ id, text }) => (
                <Option
                  key={id}
                  id={id}
                  text={text}
                  onSelect={this.handleOptionSelect}
                />
              ))}
            </Box>
          )}
        </Box>
      </OutsideClickHandler>
    );
  }
}

export default connect(Select);
