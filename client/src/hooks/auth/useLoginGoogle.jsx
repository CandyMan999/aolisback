import { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { CURRENT_USER_QUERY } from "../data/useCurrentUser";
import { setToken } from "../../utils/helpers";

export const LOGIN_GOOGLE_MUTATION = gql`
  mutation LoginGoogleMutation($idToken: String!) {
    loginGoogle(idToken: $idToken) {
      _id
      name
      picture
      email

      token
    }
  }
`;

const useLoginGoogle = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldPersist, setShouldPersist] = useState(false);
  const [onLoginMutation, { data, loading, error, client }] = useMutation(
    LOGIN_GOOGLE_MUTATION,
    {}
  );

  useEffect(() => {
    if (isLoading && !loading && data) {
      setToken(data.loginGoogle.token, (shouldPersist = false));
      client.writeQuery({
        query: CURRENT_USER_QUERY,
        data: { currentUser: data.loginGoogle.user },
      });
      onSuccess();
      setIsLoading(false);
    }
  }, [loading, data, isLoading]);

  const login = ({ token }) => {
    setShouldPersist(shouldPersist);
    setIsLoading(true);
    onLoginMutation({ variables: { idToken: token } });
  };

  return [login, error, isLoading];
};

export default useLoginGoogle;
