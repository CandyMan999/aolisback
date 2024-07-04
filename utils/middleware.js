const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);
const { Expo } = require("expo-server-sdk");

const parseToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.match(/^Bearer .*/))
    return res.status(401).json({ err: "unauthorized" });

  req.token = authHeader.split(" ")[1];
  next();
};
const createToken = (id) =>
  jwt.sign({ id }, process.env.SECRET, { expiresIn: "14d" });

const verifyToken = async ({ token }) => {
  try {
    return jwt.verify(
      token,
      process.env.SECRET || "supersecret",
      async (err, payload) => {
        if (err) {
          throw new AuthenticationError("Authorization denied");
        } else {
          return payload;
        }
      }
    );
  } catch (err) {
    throw new AuthenticationError(err);
  }
};

const verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.OAUTH_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (err) {
    throw new AuthenticationError(`Error verifying auth token`, err);
  }
};
const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError("You must be logged in");
  }
  return next(root, args, ctx, info);
};

const sendPushNotification = async (expoToken, username) => {
  try {
    let expo = new Expo();

    let messages = [];

    if (!Expo.isExpoPushToken(expoToken)) {
      console.error(`Push token ${expoToken} is not a valid Expo push token`);
      return;
    }

    messages.push({
      to: expoToken,
      sound: "default",
      title: "Gone Chatting",
      subtitle: "Never Catch a Catfish 🎣",
      body: `🚨 ${username} sent you a new video message`,
      data: { expoToken, username },
    });

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();

    let receiptIds = [];
    for (let ticket of tickets) {
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    }

    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    (async () => {
      for (let chunk of receiptIdChunks) {
        try {
          let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

          for (let receiptId in receipts) {
            let { status, message, details } = receipts[receiptId];
            if (status === "ok") {
              continue;
            } else if (status === "error") {
              console.error(
                `There was an error sending a notification: ${message}`
              );
              if (details && details.error) {
                console.error(`The error code is ${details.error}`);
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
  } catch (err) {
    console.log("err sending push");
  }
};

const pushNotificationProfile = async (expoToken) => {
  try {
    let expo = new Expo();

    let messages = [];

    if (!Expo.isExpoPushToken(expoToken)) {
      console.error(`Push token ${expoToken} is not a valid Expo push token`);
      return;
    }

    messages.push({
      to: expoToken,
      sound: "default",
      title: "Gone Chatting",
      subtitle: "This app is Brand New",
      body: `🚨 Fill out your profile or you will never get a date!`,
      data: { expoToken },
    });

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();

    let receiptIds = [];
    for (let ticket of tickets) {
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    }

    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    (async () => {
      for (let chunk of receiptIdChunks) {
        try {
          let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

          for (let receiptId in receipts) {
            let { status, message, details } = receipts[receiptId];
            if (status === "ok") {
              continue;
            } else if (status === "error") {
              console.error(
                `There was an error sending a notification: ${message}`
              );
              if (details && details.error) {
                console.error(`The error code is ${details.error}`);
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
  } catch (err) {
    console.log("err sending push");
  }
};

const pushNotificationPhoneNumber = async (
  expoToken,
  username,
  phoneNumber
) => {
  try {
    let expo = new Expo();

    let messages = [];

    if (!Expo.isExpoPushToken(expoToken)) {
      console.error(`Push token ${expoToken} is not a valid Expo push token`);
      return;
    }

    messages.push({
      to: expoToken,
      sound: "default",
      title: "Gone Chatting",
      subtitle: "Never Catch a Catfish 🎣",
      body: `📞 ${username} wants you to have their number ${phoneNumber}`,
      data: { expoToken, username, phoneNumber },
    });

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();

    let receiptIds = [];
    for (let ticket of tickets) {
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    }

    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    (async () => {
      for (let chunk of receiptIdChunks) {
        try {
          let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

          for (let receiptId in receipts) {
            let { status, message, details } = receipts[receiptId];
            if (status === "ok") {
              continue;
            } else if (status === "error") {
              console.error(
                `There was an error sending a notification: ${message}`
              );
              if (details && details.error) {
                console.error(`The error code is ${details.error}`);
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
  } catch (err) {
    console.log("err sending push");
  }
};

module.exports = {
  verifyToken,
  parseToken,
  verifyGoogleToken,
  createToken,
  authenticated,
  sendPushNotification,
  pushNotificationProfile,
  pushNotificationPhoneNumber,
};
