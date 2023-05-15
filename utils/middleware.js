const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

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

module.exports = {
  verifyToken,
  parseToken,
  verifyGoogleToken,
  createToken,
  authenticated,
};
