const { AuthenticationError, UserInputError } = require("apollo-server");
const { User } = require("../../models");
const { pushNotificationWelcome } = require("../../utils/middleware");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);
const serviceSid = process.env.TWILIO_VERIFY_SID;

module.exports = {
  addPhoneResolver: async (root, args, ctx) => {
    const { _id, phoneNumber, authCode } = args;

    try {
      // Check if the phone number is already in use
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser && existingUser._id.toString() !== _id) {
        // Check if associated phone number is banned
        if (existingUser.isBanned) {
          throw new AuthenticationError(
            "A user associated with the number has been BANNED!"
          );
        }
        // Check if phone number is in use
        throw new AuthenticationError("This phone number is already in use.");
      }

      if (!authCode) {
        try {
          await client.verify.v2.services(serviceSid).verifications.create({
            channel: "sms",
            to: phoneNumber,
          });

          return { message: "Verification code sent." };
        } catch (err) {
          console.error("Error sending text: ", err);
          throw new AuthenticationError(err);
        }
      } else {
        try {
          const verificationCheck = await client.verify.v2
            .services(serviceSid)
            .verificationChecks.create({ to: phoneNumber, code: authCode });

          if (verificationCheck.status === "approved") {
            const user = await User.findByIdAndUpdate(
              { _id },
              { phoneNumber, profileComplete: true },
              { new: true }
            ).populate("pictures");

            pushNotificationWelcome(user.expoToken, user.location.coordinates);

            return user;
          } else {
            throw new AuthenticationError("Invalid verification code.");
          }
        } catch (err) {
          console.error("Error verifying code: ", err);
          throw new AuthenticationError(err);
        }
      }
    } catch (err) {
      console.error("General error: ", err);
      throw new AuthenticationError(err.message);
    }
  },
  sendTwoFactorResolver: async (root, args, ctx) => {
    const { phoneNumber, authCode } = args;

    try {
      // Check if the phone number is already in use
      const existingUser = await User.findOne({ phoneNumber });

      if (!existingUser) {
        throw new AuthenticationError(
          "No Account for this phone number exists. Just go create a new account if this is the phone number you want to use."
        );
        return;
      }

      if (!authCode) {
        try {
          await client.verify.v2.services(serviceSid).verifications.create({
            channel: "sms",
            to: phoneNumber,
          });

          return {
            message: "Verification code sent.",
            username: existingUser.username,
          };
        } catch (err) {
          console.error("Error sending text: ", err);
          throw new AuthenticationError(err);
        }
      } else {
        try {
          const verificationCheck = await client.verify.v2
            .services(serviceSid)
            .verificationChecks.create({ to: phoneNumber, code: authCode });

          if (verificationCheck.status === "approved") {
            return { message: "Redirect", username: existingUser.username };
          } else {
            throw new AuthenticationError("Invalid verification code.");
          }
        } catch (err) {
          console.error("Error verifying code: ", err);
          throw new AuthenticationError(err);
        }
      }
    } catch (err) {
      console.error("General error: ", err);
      throw new AuthenticationError(err.message);
    }
  },
};
