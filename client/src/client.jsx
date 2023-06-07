import { useState, useEffect } from "react";
import { GraphQLClient } from "graphql-request";
import { getToken } from "./utils/helpers";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://aol-is-back.herokuapp.com/graphql"
    : "http://localhost:4000/graphql";

export const useClient = () => {
  // useEffect(() => {
  //   const token = getToken();
  //   setIdToken(token);
  // }, []);

  return new GraphQLClient(BASE_URL, {
    headers: { authorization: getToken() },
  });
};
