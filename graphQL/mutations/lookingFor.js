const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  lookingForResolver: async (root, args, ctx) => {
    const { lowEnd, highEnd, sex, kids, _id } = args;
    try {
      const profile = await User.findByIdAndUpdate(
        { _id },
        {
          lookingFor: {
            ageRange: {
              lowEnd,
              highEnd,
            },
            sex,
            kids,
          },
        },
        { new: true }
      );

      return profile.lookingFor;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
