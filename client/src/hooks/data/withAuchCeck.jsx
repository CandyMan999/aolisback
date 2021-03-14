import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

export const AUTH_QUERY = gql`
  {
    currentUser {
      id
    }
  }
`;

const withAuthCheck = () => {
  const { data, loading } = useQuery(AUTH_QUERY);

  const isLoggedIn = !!(data && data.currentUser && data.currentUser._id);

  return [isLoggedIn, loading];
};

export default withAuthCheck;
