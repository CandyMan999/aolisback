const { AuthenticationError, UserInputError } = require("apollo-server");
const { User } = require("../../models");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);

let TWO_FACTOR = {};

const generateAuthCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const setAuthCodeTimeout = (_id) => {
  setTimeout(() => {
    delete TWO_FACTOR[_id];
  }, 60000); // 60 seconds
};

module.exports = {
  addPhoneResolver: async (root, args, ctx) => {
    const { _id, phoneNumber, authCode } = args;

    try {
      // Check if the phone number is already in use
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser && existingUser._id !== _id) {
        //check if associated phone number is banned
        if (existingUser.isBanned) {
          throw new AuthenticationError(
            "A user accosiated with the number has been BANNED!"
          );
        }
        // check if phone number is in use
        throw new AuthenticationError("This phone number is already in use.");
      }

      // Generate a new auth code if not provided
      if (!authCode) {
        const twoFactor = generateAuthCode();
        TWO_FACTOR[_id] = twoFactor;

        try {
          const message = await client.messages.create({
            body: `GoneChatting's: authorization code ${twoFactor}`,
            messagingServiceSid,
            from: "+16508709194",
            to: phoneNumber,
          });

          console.log("success: ", message);
        } catch (err) {
          console.log("err sending text: ", err);
        }

        // Set a timeout to delete the auth code after 60 seconds
        setAuthCodeTimeout(_id);

        return { message: "Verification code sent." };
      }

      // Verify the auth code
      if (authCode && Number(authCode) !== Number(TWO_FACTOR[_id])) {
        throw new AuthenticationError("Invalid Verification Code");
      }
      // Update the phone number after verification

      let user;
      if (authCode && Number(authCode) === Number(TWO_FACTOR[_id])) {
        user = await User.findByIdAndUpdate(
          { _id },
          { phoneNumber, profileComplete: true },
          { new: true }
        ).populate("pictures");
      }

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
