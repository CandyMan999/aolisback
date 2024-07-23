import React from "react";
import { Box } from "../../components";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import SearchResults from "./search-results/SearchResults";

const GridSearch = ({
  state,
  client,
  dispatch,
  currentUser,
  users,
  search,
}) => {
  const mobile = useMediaQuery("(max-width: 740px)");

  return (
    <Box
      height={"calc(100vH - 60px)"}
      width="100%"
      maxHeight={1066}
      paddingBottom={mobile ? 100 : undefined}
      justifyContent="center"
    >
      <Box
        style={{ display: "grid", margin: "20px", marginTop: 5 }}
        width="100%"
        height="fit-content"
        minHeight={"100%"}
        justifyContent="stretch"
        card={!users.length ? true : mobile ? false : true}
      >
        <SearchResults
          state={state}
          client={client}
          dispatch={dispatch}
          currentUser={currentUser}
          mobile={mobile}
          users={users}
          search={search}
        />
      </Box>
    </Box>
  );
};

export default GridSearch;
