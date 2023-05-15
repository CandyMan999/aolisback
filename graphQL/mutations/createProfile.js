const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  createProfileResolver: async (root, args, ctx) => {
    const {
      intro,
      age,
      sex,
      occupation,
      singleTime,
      drink,
      smoke,
      marijuana,
      drugs,
      kids,
      _id,
    } = args;
    try {
      const profile = await User.findByIdAndUpdate(
        { _id },
        {
          intro,
          age,
          sex,
          occupation,
          singleTime,
          drink,
          smoke,
          marijuana,
          drugs,
          kids,
        },
        { new: true }
      ).populate("pictures");

      return profile;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
