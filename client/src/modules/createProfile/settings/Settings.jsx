import React, { useState } from "react";
import {
  FaGoogle,
  FaApple,
  FaInstagram,
  FaStar,
  FaRocket,
  FaCrown,
} from "react-icons/fa";
import {
  CollapsableHeader,
  Box,
  Button,
  Text,
  ICON_SIZES,
  FONT_SIZES,
  Loading,
  Icon,
  Switch,
} from "../../../components";
import { TbMessageCircleHeart } from "react-icons/tb";
import { COLORS } from "../../../constants";
import ConfirmationModal from "./ConfirmationModal";
import iOSLogo from "../../../pictures/iOSLogo.png";
import { MdVideoChat } from "react-icons/md";

const Settings = ({ state, client, dispatch }) => {
  const [showModal, setShowModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleToggleSounds = () => {
    setSoundsEnabled(!soundsEnabled);
  };

  const { currentUser } = state;
  const videoMinutesUsed = Math.floor(currentUser.plan.videoMinutesUsed / 60);
  const isGoogleConnected = !!currentUser.googleId;
  const isAppleConnected = !!currentUser.appleId;

  return (
    <CollapsableHeader title={"Settings"} fullWidth={true}>
      <Box column width={"100%"} height={"100%"} alignItems="center">
        <Text
          bold
          fontSize={FONT_SIZES.X_LARGE}
          color={COLORS.main}
          marginTop={0}
        >
          Plans
        </Text>

        <Box column width="100%">
          <Box
            column
            alignItems="center"
            marginBottom={10}
            backgroundColor={COLORS.lightPurple}
            style={{
              padding: "10px",
              borderRadius: "10px",
              boxShadow:
                currentUser.plan.planType === "Free"
                  ? `0 0 10px ${COLORS.pink}`
                  : "none",
            }}
          >
            <Box row>
              <img height={50} width={50} src={iOSLogo} alt="Watermark-logo" />

              <Text>GoneChatting - Free</Text>
            </Box>
            <Text bold center>
              3 messages per day, 15 Video Chat minutes per week
            </Text>
            {currentUser.plan.planType === "Free" ? (
              <Text bold color={COLORS.pink} fontSize={FONT_SIZES.LARGE}>
                Current Plan
              </Text>
            ) : (
              <Button
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: `0px 2px 10px ${COLORS.pink}`,
                  borderRadius: "20px",
                  border: `solid 1px ${COLORS.pink}`,
                }}
                width="80%"
                color={COLORS.black}
              >
                <Text bold margin={5} color={COLORS.vividBlue}>
                  Change Plan
                </Text>
              </Button>
            )}
          </Box>
          <Box
            column
            alignItems="center"
            marginBottom={10}
            backgroundColor={COLORS.lightPurple}
            style={{
              padding: "10px",
              borderRadius: "10px",
              boxShadow:
                currentUser.plan.planType === "Premium"
                  ? `0 0 10px ${COLORS.pink}`
                  : "none",
            }}
          >
            <Box row>
              <img height={50} width={50} src={iOSLogo} alt="Watermark-logo" />

              <Text>GoneChatting - Premium</Text>
            </Box>
            <Text bold center>
              6 messages per day, 30 Video Chat minutes per week & more!
            </Text>
            {currentUser.plan.planType === "Premium" ? (
              <Text bold color={COLORS.pink} fontSize={FONT_SIZES.LARGE}>
                Current Plan
              </Text>
            ) : (
              <Button
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: `0px 2px 10px ${COLORS.pink}`,
                  borderRadius: "20px",
                  border: `solid 1px ${COLORS.pink}`,
                }}
                width="80%"
                color={COLORS.black}
              >
                <Text bold margin={5} color={COLORS.vividBlue}>
                  Change Plan
                </Text>
              </Button>
            )}
          </Box>
          <Box
            column
            alignItems="center"
            backgroundColor={COLORS.lightPurple}
            style={{
              padding: "10px",
              borderRadius: "10px",
              boxShadow:
                currentUser.plan.planType === "Unlimited"
                  ? `0 0 10px ${COLORS.pink}`
                  : "none",
            }}
          >
            <Box row alignItems="center">
              <img height={50} width={50} src={iOSLogo} alt="Watermark-logo" />
              <Text>GoneChatting - Unlimited</Text>{" "}
              <FaCrown
                size={24}
                color={COLORS.deepPurple}
                style={{ marginLeft: 10 }}
              />
            </Box>
            <Text bold center>
              Unlimited everything, see who likes you & more!
            </Text>
            {currentUser.plan.planType === "Unlimited" ? (
              <Text bold color={COLORS.pink} fontSize={FONT_SIZES.LARGE}>
                Current Plan
              </Text>
            ) : (
              <Button
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: `0px 2px 10px ${COLORS.pink}`,
                  borderRadius: "20px",
                  border: `solid 1px ${COLORS.pink}`,
                }}
                width="80%"
                color={COLORS.black}
              >
                <Text bold margin={5} color={COLORS.vividBlue}>
                  Change Plan
                </Text>
              </Button>
            )}
          </Box>
        </Box>

        <Box
          width="100%"
          style={{
            paddingTop: "20px",
            borderRadius: "20px",
          }}
        >
          <Box
            row
            alignItems="center"
            width="100%"
            justifyContent="space-between"
          >
            <Box
              column
              width="48%"
              marginRight={10}
              height="80%"
              alignItems="center"
              backgroundColor={COLORS.lightPurple}
              style={{
                padding: "20px",
                borderRadius: "20px",
                marginBottom: "20px",
              }}
            >
              <TbMessageCircleHeart size={36} color={COLORS.pink} />
              <Text center marginLeft={10}>
                Get More Messages
              </Text>
              <Button
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: `0px 2px 10px ${COLORS.pink}`,
                  borderRadius: "20px",
                  border: `solid 1px ${COLORS.pink}`,
                }}
                color={COLORS.black}
              >
                <Text bold margin={5} color={COLORS.pink}>
                  Get
                </Text>
              </Button>
            </Box>
            <Box
              column
              alignItems="center"
              width="48%"
              height="80%"
              backgroundColor={COLORS.lightPurple}
              style={{
                padding: "20px",
                borderRadius: "20px",
                marginBottom: "20px",
              }}
            >
              <MdVideoChat size={36} color={COLORS.deepPurple} />
              <Text center marginLeft={10}>
                Get More Video Minutes
              </Text>
              <Button
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: `0px 2px 10px ${COLORS.pink}`,
                  borderRadius: "20px",
                  border: `solid 1px ${COLORS.pink}`,
                }}
                color={COLORS.black}
              >
                <Text bold margin={5} color={COLORS.pink}>
                  Get
                </Text>
              </Button>
            </Box>
          </Box>
        </Box>

        <Text bold fontSize={FONT_SIZES.X_LARGE} color={COLORS.main} margin={0}>
          Account Info
        </Text>
        <Box
          width="90%"
          marginY={15}
          style={{
            backgroundColor: COLORS.lightPurple,
            padding: "20px",
            borderRadius: "20px",
          }}
        >
          <Box column marginY={10} width="100%">
            <CollapsableHeader title="Connected Accounts">
              <Box row alignItems="center">
                {isGoogleConnected && (
                  <Button
                    color={COLORS.white}
                    style={{
                      border: `solid 1px ${COLORS.black}`,
                      boxShadow: `0px 2px 10px ${COLORS.lighterGrey}`,
                      borderRadius: "20px",
                    }}
                  >
                    <FaGoogle color={COLORS.pink} size={24} />
                  </Button>
                )}
                {isAppleConnected && (
                  <Button
                    color={COLORS.white}
                    style={{
                      border: `solid 1px ${COLORS.black}`,
                      boxShadow: `0px 2px 10px ${COLORS.lighterGrey}`,
                      borderRadius: "20px",
                    }}
                  >
                    <FaApple color={COLORS.pink} size={24} />
                  </Button>
                )}
                {!isGoogleConnected && !isAppleConnected && (
                  <Text>No connected accounts</Text>
                )}
              </Box>
            </CollapsableHeader>
            <Box row alignItems="center" justifyContent="space-between">
              <Text>Phone Number</Text>
              <Text>{currentUser.phoneNumber}</Text>
            </Box>
            <Box row alignItems="center" justifyContent="space-between"></Box>
            <Box row alignItems="center" justifyContent="space-between">
              <Text>Email</Text>
              <Text>{currentUser.email}</Text>
            </Box>
            <Box row alignItems="center" justifyContent="space-between">
              <Text>Video Minutes Used</Text>
              <Box width="60%" justifyContent="flex-end">
                <Box column justifyContent="flex-end">
                  <Text margin={0} center bold>
                    {videoMinutesUsed} minutes
                  </Text>
                  <Text center margin={0} style={{ textAlign: "end" }}>
                    (Resets Sunday at midnight)
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box row alignItems="center" justifyContent="space-between">
              <Text>Video Messages Sent</Text>
              <Box width="50%" justifyContent="flex-end">
                <Box column>
                  <Text margin={0} bold center>
                    {currentUser.plan.messagesSent}
                  </Text>
                  <Text margin={0} style={{ textAlign: "end" }}>
                    (Resets daily at midnight)
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Text bold fontSize={FONT_SIZES.X_LARGE} color={COLORS.main} margin={0}>
          Preferences
        </Text>
        <Box
          width="90%"
          marginY={15}
          style={{
            backgroundColor: COLORS.lightPurple,
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Box column marginY={10} width="100%">
            <Box row alignItems="center" justifyContent="space-between">
              <Text>Push Notifications</Text>
              <Switch
                checked={notificationsEnabled}
                onChange={handleToggleNotifications}
              />
            </Box>
            <Box row alignItems="center" justifyContent="space-between">
              <Text>App Sounds / Vibration</Text>
              <Switch checked={soundsEnabled} onChange={handleToggleSounds} />
            </Box>
          </Box>
        </Box>
        <Text bold fontSize={FONT_SIZES.X_LARGE} color={COLORS.main} margin={0}>
          Support
        </Text>
        <Box
          width="90%"
          marginY={15}
          style={{
            backgroundColor: COLORS.lightPurple,
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Box column marginY={10} width="100%">
            <Box row alignItems="center" justifyContent="space-between">
              <Text>Feedback</Text>
              <Button>Submit</Button>
            </Box>
            <Box row alignItems="center" justifyContent="space-between">
              <Text>Terms of Service</Text>
              <Button>View</Button>
            </Box>
            <Box row alignItems="center" justifyContent="space-between">
              <Text>Privacy Policy</Text>
              <Button>View</Button>
            </Box>
          </Box>
        </Box>
        <Text bold fontSize={FONT_SIZES.X_LARGE} color={COLORS.main} margin={0}>
          Social
        </Text>
        <Box
          width="90%"
          marginY={15}
          style={{
            backgroundColor: COLORS.lightPurple,
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Box
            row
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Text>Follow us on Instagram</Text>
            <FaInstagram color={COLORS.magenta} size={36} />
          </Box>
        </Box>

        <Button
          coolStyle
          color={COLORS.red}
          style={{
            borderRadius: 12,
            width: "50%",
            border: `solid 1px ${COLORS.white}`,
            boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
            marginTop: 20,
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
