import { GraphQLClient } from "graphql-request";
import { getToken } from "./utils/helpers";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://gone-chatting-03f3321e7ebb.herokuapp.com"
    : "http://localhost:4000/graphql";

export const useClient = () => {
  return new GraphQLClient(BASE_URL, {
    headers: { authorization: getToken() },
  });
};
