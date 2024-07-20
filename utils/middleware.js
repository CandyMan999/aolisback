const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);
const { Expo } = require("expo-server-sdk");
const { CITIES } = require("./citiesList");

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
  phoneNumber,
  imageUrl
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
      data: { expoToken, username, phoneNumber, imageUrl },
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

const getDistanceFromCoords = (lat1, lng1, lat2, lng2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLng = deg2rad(lng2 - lng1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d * 0.621371 * 5280; //returning distance in feet
};

const deg2rad = (deg) => deg * (Math.PI / 180);

const findClosestCity = async (lat, long) => {
  try {
    let shortestDistance = null;
    let currentDistance = null;
    let cityName = null;

    for (const city of CITIES) {
      const cityLat = city.latitude;
      const cityLng = city.longitude;

      currentDistance = await getDistanceFromCoords(
        lat,
        long,
        cityLat,
        cityLng
      );

      if (shortestDistance === null || currentDistance < shortestDistance) {
        shortestDistance = currentDistance;
        cityName = city.city;
      }
    }

    return cityName;
  } catch (err) {
    console.log("error finding city: ", err);
  }
};

const pushNotificationWelcome = async (expoToken, coordinates) => {
  try {
    //coordinates are in the form [longitude, latitude]
    let expo = new Expo();

    let messages = [];
    let city = undefined;
    const long = coordinates[0];
    const lat = coordinates[1];

    if (lat || long) {
      city = await findClosestCity(lat, long);
    }

    if (!Expo.isExpoPushToken(expoToken)) {
      console.error(`Push token ${expoToken} is not a valid Expo push token`);
      return;
    }

    messages.push({
      to: expoToken,
      sound: "default",
      title: "Welcome to Gone Chatting! 🎉",
      subtitle: city
        ? `We just launched in ${city}!`
        : "We just launced in your city!",
      body: `More users are joining soon. Start sending video messages or sit back and relax.`,
      data: { expoToken, city },
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
  pushNotificationWelcome,
};
