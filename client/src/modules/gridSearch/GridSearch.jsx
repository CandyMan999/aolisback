import React, { useState } from "react";
import { Box, Text, Wrapper } from "../../components";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { css } from "@emotion/css";
import SearchResults from "./search-results/SearchResults";

const GridSearch = ({ state, client, dispatch, currentUser, users }) => {
  const mobile = useMediaQuery("(max-width: 740px)");

  return (
    <Box
      // justifyContent={mobile ? "" : "space-around"}
      height={"calc(100vH - 60px)"}
      width="100%"
      maxHeight={1066}
      // flexWrap={mobile ? "wrap" : ""}
      // paddingBottom={mobile ? 20 : undefined}
    >
      <Box
        // className={!!therapists.length ? gridStyle(mobile) : ""}
        style={{ display: "grid", margin: "20px" }}
        width="100%"
        height="100%"
        justifyContent="space-around"
        card
      >
        <SearchResults
          state={state}
          client={client}
          dispatch={dispatch}
          currentUser={currentUser}
          mobile={mobile}
          users={users}
        />
      </Box>
    </Box>
  );
};

const gridStyle = (mobile) =>
  css({
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    justifyItems: "center",
    paddingBottom: "0px",
    marginBottom: "0px",
    maxHeight: mobile ? undefined : "1220px",
    overflowY: !mobile ? "scroll" : undefined,
    "@media (max-width: 1180px)": {
      gridTemplateColumns: "1fr 1fr",
    },
  });

export default GridSearch;
