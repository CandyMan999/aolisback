import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

export const CURRENT_USER_QUERY = gql`
  query CurrentUserQuery {
    currentUser {
      _id
      name
      email
      photos {
        _id
        url
      }
    }
  }
`;

const useCurrentUser = () => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY);
  const currentUser = loading || !data ? undefined : data.currentUser;

  return [currentUser, loading];
};

export default useCurrentUser;
