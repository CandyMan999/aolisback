import React, { useState, Fragment } from "react";

import { Modal, Text, Box, Button, FONT_SIZES } from "../../../components";
import { COLORS } from "../../../constants";
import { DELETE_ACCOUNT_MUTATION } from "../../../graphql/mutations";

const ConfirmationModal = ({ state, client, dispatch, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);

      const { deleteAccount } = await client.request(
        DELETE_ACCOUNT_MUTATION,
        {}
      );

      if (deleteAccount) {
        setLoading(false);
        setSuccess(deleteAccount);
        setTimeout(() => {
          onClose();
          dispatch({ type: "UPDATE_USER", payload: {} });
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      console.log("error deleting account: ", err);
    }
  };

  return (
    <Modal isLoading={loading} onClose={onClose} height={350} state={state}>
      <Box
        column
        width={"100%"}
        height={"100%"}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box column width="100%">
          {success ? (
            <Text
              center
              fontSize={FONT_SIZES.X_LARGE}
              bold
              color={COLORS.textRed}
            >
              Your account has been deleted!
            </Text>
          ) : (
            <Fragment>
              <Text center fontSize={FONT_SIZES.X_LARGE} bold>
                Are you sure you want to delete your account?
              </Text>
              <Text center>
                If you delete your account, you will permanently lose your
                profile, messages, photos and videos. If you delete your
                account, this action cannot be undone.
              </Text>
            </Fragment>
          )}
        </Box>
        <Box width="100%" justifyContent="space-between">
          <Button
            coolStyle
            color={COLORS.red}
            style={{
              borderRadius: 12,
              width: "60%",
              border: `solid 1px ${COLORS.white}`,
              boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
            }}
            onClick={handleDeleteAccount}
          >
            <Text bold>Delete Account</Text>
          </Button>
          <Button
            onClick={onClose}
            coolStyle
            color={COLORS.lightGrey}
            style={{
              borderRadius: 12,
              width: "60%",
              border: `solid 1px ${COLORS.white}`,
              boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
            }}
          >
            <Text bold>Cancel</Text>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
