import React, { useState } from "react";

import { CollapsableHeader, Box, Button, Text } from "../../../components";
import { COLORS } from "../../../constants";
import ConfirmationModal from "./ConfirmationModal";

const Settings = ({ state, client, dispatch }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <CollapsableHeader title={"Settings"}>
      <Box column width={"100%"} height={"100%"} alignItems="center">
        <Button
          coolStyle
          color={COLORS.red}
          style={{
            borderRadius: 12,
            width: "50%",
            border: `solid 1px ${COLORS.white}`,

            boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
          }}
          onClick={() => setShowModal(true)}
        >
          <Text bold>Delete Account</Text>
        </Button>
      </Box>
      {showModal && (
        <ConfirmationModal
          state={state}
          client={client}
          dispatch={dispatch}
          onClose={handleCloseModal}
        />
      )}
    </CollapsableHeader>
  );
};

export default Settings;
