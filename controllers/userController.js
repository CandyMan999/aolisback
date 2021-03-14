const { OAuth2Client } = require("google-auth-library");
const { User, Picture } = require("../models");
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async (idToken) => {
  const googleUser = await verifyAuthToken(idToken);

  const user = await checkIfUserExists(googleUser.email);

  return user ? user : createNewUser(googleUser);
};

const verifyAuthToken = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.OAUTH_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (err) {
    console.err(`Error verifying auth token`, err);
  }
};

const checkIfUserExists = async (email) => {
  return await User.findOne({ email }).populate("pictures");
};

const createNewUser = async (googleUser) => {
  const { name, email, picture } = googleUser;

  const user = await new User({ name, email }).save();

  const newPhoto = await Picture.create({ url: picture, user: user._id });

  const userUpdated = await User.findByIdAndUpdate(
    {
      _id: user._id,
    },
    { $push: { pictures: newPhoto } },
    { new: true }
  ).populate("pictures");

  return userUpdated;
};
