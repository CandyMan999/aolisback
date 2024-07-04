const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");
const { pushNotificationPhoneNumber } = require("../../utils/middleware");

module.exports = {
  sendPhoneNumberResolver: async (root, args, ctx) => {
    const { expoToken, username, phoneNumber } = args;
    try {
      pushNotificationPhoneNumber(expoToken, username, phoneNumber);

      return { status: true };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
