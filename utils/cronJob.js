const { User } = require("../models");
const cron = require("node-cron");
const { pushNotificationProfile } = require("../utils/middleware");

const { Expo } = require("expo-server-sdk");
let expo = new Expo();
require("dotenv").config();

const cronJob = async () => {
  try {
    cron.schedule(
      "0 0 */12 * *'",
      async () => {
        const users = await User.find({
          $or: [
            { intro: { $exists: false } },
            { sex: { $exists: false } },
            { occupation: { $exists: false } },
            { drink: { $exists: false } },
            { marijuana: { $exists: false } },
            { kids: { $exists: false } },
            { drugs: { $exists: false } },
          ],
        });

        const allTokens = users.map((user) => user.expoToken);

        for (let pushToken of allTokens) {
          if (pushToken) {
            pushNotificationProfile(pushToken);
          }
        }
      },
      { scheduled: true, timezone: "America/Denver" }
    );
  } catch (err) {
    console.log("error running cron: ", err);
  }
};

module.exports = {
  cronJob,
};
