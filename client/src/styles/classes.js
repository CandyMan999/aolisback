import { css } from "@emotion/css";
import { COLORS } from "../constants";

export const navbar = css`
  background: ${COLORS.darkestGrey};
  height: 60px;
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;

  div p {
    cursor: pointer;
  }
`;

export const navText = css`
  color: ${COLORS.lighterGrey};
  text-decoration: none;

  &:hover {
    color: ${COLORS.white};
  }
`;
