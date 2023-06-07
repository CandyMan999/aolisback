import React from "react";
import { Box, Loading } from "../../components";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import SearchResults from "./search-results/SearchResults";

const GridSearch = ({ state, client, dispatch, currentUser, users }) => {
  const mobile = useMediaQuery("(max-width: 740px)");

  return (
    <Box
      height={"calc(100vH - 60px)"}
      width="100%"
      maxHeight={1066}
      paddingBottom={mobile ? 100 : undefined}
    >
      <Box
        style={{ display: "grid", margin: "20px" }}
        width="100%"
        height="fit-content"
        minHeight={"100%"}
        justifyContent="stretch"
        card={mobile ? false : true}
      >
        {!!currentUser.username ? (
          <SearchResults
            state={state}
            client={client}
            dispatch={dispatch}
            currentUser={currentUser}
            mobile={mobile}
            users={users}
          />
        ) : (
          <Loading ring />
        )}
      </Box>
    </Box>
  );
};

export default GridSearch;
