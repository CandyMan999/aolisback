import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BLOCK_USER_MUTATION,
  FLAG_VIDEO_MUTATION,
  UNBLOCK_USER_MUTATION,
} from "../../graphql/mutations";

import { Box, Button, Text, Icon, ICON_SIZES } from "..";
import { COLORS } from "../../constants";

const BottomDrawer = ({
  isOpen,
  onClose,
  client,
  video,
  currentUser,
  blockID,
  dispatch,
  blockedUsers,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const BUTTONS = [
    {
      name: video && video.flagged ? "Flagged" : "Report Video",
      color: COLORS.white,
      onClick: () => handleFlagVideo(video._id),
      textColor: COLORS.red,
      marginTop: 20,
      marginBottom: 0,
      borderBottom: `solid 2px ${COLORS.black}`,
      boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
      icon:
        video && video.flagged ? (
          <Icon name={"flag"} size={ICON_SIZES.LARGE} color={COLORS.grey} />
        ) : null,
    },
    {
      name: isBlocked ? "UnBlock" : "Block User",
      color: COLORS.white,
      onClick: isBlocked ? () => handleUnBlockUser() : () => handleBlockUser(),
      textColor: COLORS.red,
      marginTop: 0,
      marginBottom: 0,
      borderBottom: `solid 2px ${COLORS.black}`,
      boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
      icon: isBlocked ? (
        <Icon name={"block"} size={ICON_SIZES.LARGE} color={COLORS.grey} />
      ) : null,
    },
    {
      name: "Cancel",
      color: COLORS.grey,
      onClick: onClose,
      textColor: COLORS.white,
      marginTop: 20,
      marginBottom: undefined,
      borderBottom: undefined,
      boxShadow: undefined,
      icon: null,
    },
  ];

  useEffect(() => {
    setMounted(true);

    setBlocked();
  }, []);

  const setBlocked = () => {
    setIsBlocked(false);

    blockedUsers.find((user) => {
      if (user._id === blockID) {
        return setIsBlocked(true);
      }
    });
  };

  const handleFlagVideo = async (videoID) => {
    try {
      const variables = {
        _id: videoID,
        flagged: true,
      };

      const { flagVideo } = await client.request(
        FLAG_VIDEO_MUTATION,
        variables
      );

      setTimeout(() => {
        onClose(true);
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBlockUser = async () => {
    try {
      const variables = {
        userID: currentUser._id,
        blockID,
      };
      const { block } = await client.request(BLOCK_USER_MUTATION, variables);

      setIsBlocked(true);
      await setTimeout(() => {
        onClose(true);
      }, 1000);

      setTimeout(() => {
        dispatch({ type: "UPDATE_BLOCKED", payload: block.blockedUsers });
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnBlockUser = async () => {
    try {
      const variables = {
        userID: currentUser._id,
        blockID,
      };
      const { unBlock } = await client.request(
        UNBLOCK_USER_MUTATION,
        variables
      );

      setIsBlocked(false);
      await setTimeout(() => {
        onClose(true);
      }, 1000);
      setTimeout(() => {
        dispatch({ type: "UPDATE_BLOCKED", payload: unBlock.blockedUsers });
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <motion.div
      animate={{
        height: !isOpen ? 0 : "30vh",
        background: !isOpen ? "rgba(0,0,0,0.0)" : "rgba(0,0,0,0.3)",
      }}
      transition={{ ease: "linear", duration: 0.2 }}
      style={drawerStyle(isOpen)}
    >
      <Box column width="100%" alignItems="center" paddingBottom={2}>
        {mounted &&
          BUTTONS.map((button, index) => (
            <Button
              key={index}
              width={"90%"}
              color={button.color}
              style={{
                marginTop: button.marginTop,
                marginBottom: button.marginBottom,
                borderBottom: button.borderBottom,
                boxShadow: button.boxShadow,
              }}
              onClick={button.onClick}
            >
              <Box width="100%" justifyContent="center" display="flex">
                {button.icon}
                <Text bold color={button.textColor}>
                  {button.name}
                </Text>
              </Box>
            </Button>
          ))}
      </Box>
    </motion.div>
  );
};

const drawerStyle = (isOpen) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100vw",
  zIndex: 1001,
  borderTopRightRadius: 30,
  borderTopLeftRadius: 30,
});

export default BottomDrawer;
