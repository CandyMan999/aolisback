import React, { useState } from "react";
import { FaGoogle, FaApple, FaInstagram, FaCrown } from "react-icons/fa";
import {
  CollapsableHeader,
  Box,
  Button,
  Text,
  FONT_SIZES,
  Switch,
  TermsAgreement,
  PrivacyPolicyModal,
  FeedBackModal,
  LikeButton,
} from "../../../components";
import { TbMessageCircleHeart } from "react-icons/tb";
import { COLORS } from "../../../constants";
import ConfirmationModal from "./ConfirmationModal";
import iOSLogo from "../../../pictures/iOSLogo.png";
import { MdVideoChat } from "react-icons/md";
import { GiInfinity } from "react-icons/gi";

const Settings = ({ state, client, dispatch }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showFeedBackModal, setShowFeedBackModal] = useState(false);

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleToggleSounds = () => {
    setSoundsEnabled(!soundsEnabled);
  };

  const handleToggleTermsOfService = () => {
    try {
      dispatch({ type: "SHOW_TERMS", payload: !state.showTerms });
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowPrivacyModal = () => {
    setShowPrivacyModal(!showPrivacyModal);
  };

  const handleToggleFeedBackModal = () => {
    setShowFeedBackModal(!showFeedBackModal);
  };

  const handleGetMoreMinutes = () => {
    try {
      window.ReactNativeWebView.postMessage("BUY_MINUTES");
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetMoreMessages = () => {
    try {
      window.ReactNativeWebView.postMessage("BUY_MESSAGES");
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetMoreLikes = () => {
    try {
      window.ReactNativeWebView.postMessage("BUY_LIKES");
    } catch (err) {
      console.log(err);
    }
  };
  const handleChangeToPremium = () => {
    try {
      window.ReactNativeWebView.postMessage("GO_PREMIUM");
    } catch (err) {
      console.log(err);
    }
  };
  const handleChangeToUnlimited = () => {
    try {
      window.ReactNativeWebView.postMessage("GO_UNLIMITED");
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeToFree = () => {
    try {
      window.ReactNativeWebView.postMessage("GO_FREE");
    } catch (err) {
      console.log(err);
    }
  };

  const { currentUser } = state;
  const videoMinutesUsed =
    currentUser.plan.videoMinutesUsed < 60
      ? 0
      : Math.floor(currentUser.plan.videoMinutesUsed / 60);

  const videoMinutes =
    currentUser.plan.videoMinutes + currentUser.plan.additionalMinutes < 60
      ? 0
      : Math.floor(
          (currentUser.plan.videoMinutes + currentUser.plan.additionalMinutes) /
            60
        );
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
                onClick={handleChangeToFree}
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
            <Box row alignItems="center">
              <img height={50} width={50} src={iOSLogo} alt="Watermark-logo" />

              <Text>GoneChatting - Premium</Text>
              <FaCrown
                size={24}
                color={COLORS.deepPurple}
                style={{ marginLeft: 10 }}
              />
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
                onClick={handleChangeToPremium}
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
              <Text>GoneChatting - Unlimited</Text>
              <GiInfinity
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
                onClick={handleChangeToUnlimited}
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
              justifyContent="space-between"
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
                onClick={handleGetMoreMessages}
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
              justifyContent="space-between"
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
                onClick={handleGetMoreMinutes}
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
        <Box
          column
          alignItems="center"
          width="100%"
          justifyContent="space-between"
          alignContent="center"
          backgroundColor={COLORS.lightPurple}
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: "20px",
            marginBottom: 10,
          }}
        >
          <LikeButton
            relative
            bgColor={COLORS.white}
            onClick={handleGetMoreLikes}
          />
          <Text center marginLeft={10}>
            Get More Likes
          </Text>
          <Button
            onClick={handleGetMoreLikes}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `0px 2px 10px ${COLORS.pink}`,
              borderRadius: "20px",
              border: `solid 1px ${COLORS.pink}`,
              width: "80%",
            }}
            color={COLORS.black}
          >
            <Text bold margin={5} color={COLORS.pink}>
              Get
            </Text>
          </Button>
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
            <CollapsableHeader settings={true} title="Connected Accounts">
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

            <Box row alignItems="center" justifyContent="space-between">
              <Text>Email</Text>
              <Text>{currentUser.email}</Text>
            </Box>
            <Box row alignItems="center" justifyContent="space-between">
              <Text>Video Minutes Used</Text>
              <Box width="60%" justifyContent="flex-end">
                <Box column justifyContent="flex-end">
                  <Text margin={0} center bold>
                    {videoMinutesUsed} of {videoMinutes}
                  </Text>
                  <Text center margin={0} style={{ textAlign: "end" }}>
                    (Resets Sun. at midnight)
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box row alignItems="center" justifyContent="space-between">
              <Text>Video Messages Sent</Text>
              <Box width="50%" justifyContent="flex-end">
                <Box column>
                  <Text margin={0} bold center>
                    {currentUser.plan.messagesSent} of{" "}
                    {currentUser.plan.messages +
                      currentUser.plan.additionalMessages}
                  </Text>
                  <Text margin={0} style={{ textAlign: "end" }}>
                    (Resets daily at midnight)
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box row alignItems="center" justifyContent="space-between">
              <Text>Likes Sent</Text>
              <Box width="50%" justifyContent="flex-end">
                <Box column>
                  <Text margin={0} bold center>
                    {currentUser.plan.likesSent} of{" "}
                    {currentUser.plan.likes + currentUser.plan.additionalLikes}
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
              <Button
                onClick={handleToggleFeedBackModal}
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
                Open
              </Button>
            </Box>
            <Box row alignItems="center" justifyContent="space-between">
              <Text>Terms of Service</Text>
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
                onClick={handleToggleTermsOfService}
              >
                View
              </Button>
            </Box>
            <Box row alignItems="center" justifyContent="space-between">
              <Text>Privacy Policy</Text>
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
                onClick={() => handleShowPrivacyModal(true)}
              >
                View
              </Button>
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
            <Button
              color={COLORS.white}
              style={{
                border: `solid 1px ${COLORS.black}`,
                boxShadow: `0px 2px 10px ${COLORS.magenta}`,
                borderRadius: "20px",
              }}
            >
              <FaInstagram color={COLORS.magenta} size={36} />
            </Button>
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
          onClick={() => setShowDeleteModal(true)}
        >
          <Text bold>Delete Account</Text>
        </Button>
      </Box>
      {showDeleteModal && (
        <ConfirmationModal
          state={state}
          client={client}
          dispatch={dispatch}
          onClose={handleCloseModal}
        />
      )}
      {state.showTerms && (
        <TermsAgreement
          state={state}
          client={client}
          dispatch={dispatch}
          onClose={handleToggleTermsOfService}
        />
      )}
      {showPrivacyModal && (
        <PrivacyPolicyModal state={state} onClose={handleShowPrivacyModal} />
      )}
      {showFeedBackModal && (
        <FeedBackModal state={state} onClose={handleToggleFeedBackModal} />
      )}
    </CollapsableHeader>
  );
};

export default Settings;
