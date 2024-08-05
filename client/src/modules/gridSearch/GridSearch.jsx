import React from "react";
import { Box, Text } from "../../components";
import { COLORS } from "../../constants";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import SearchResults from "./search-results/SearchResults";

const GridSearch = ({
  state,
  client,
  dispatch,
  currentUser,
  users,
  search,
  fetchData,
  skip,
}) => {
  const mobile = useMediaQuery("(max-width: 740px)");

  return (
    <div
      style={{
        width: "100%",
        paddingBottom: mobile ? 50 : undefined,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        style={{
          display: "grid",
          margin: "20px",
          marginTop: !users || !users.length ? 20 : 5,
          border: !users.length ? `solid 2px ${COLORS.pink}` : undefined,
        }}
        background={!users || !users.length ? COLORS.lightPurple : undefined}
        width="100%"
        height="fit-content"
        minHeight={"100%"}
        justifyContent="stretch"
        card={!users.length ? true : false}
      >
        <SearchResults
          state={state}
          client={client}
          dispatch={dispatch}
          currentUser={currentUser}
          mobile={mobile}
          users={users}
          search={search}
          fetchData={fetchData}
          skip={skip}
        />
      </Box>
    </div>
  );
};

export default GridSearch;
