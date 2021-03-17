import React from "react";
import OutsideClickHandler from "react-outside-click-handler";

const WithOutsideClickHandler = ({ onOutsideClick, isActive, children }) =>
  isActive ? (
    <OutsideClickHandler onOutsideClick={onOutsideClick}>
      {children}
    </OutsideClickHandler>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  );

export default WithOutsideClickHandler;
