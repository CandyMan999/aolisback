const { ApolloError } = require("apollo-server");
const { fetchAffiliateDownloads } = require("../../utils/appStoreConnect");

module.exports = {
  getAffiliateDownloadsResolver: async (_, args) => {
    try {
      const data = await fetchAffiliateDownloads({
        reportDate: args && args.reportDate,
      });
      return data;
    } catch (error) {
      console.error(
        "Failed to fetch affiliate downloads from App Store Connect:",
        error
      );
      throw new ApolloError(error.message);
    }
  },
};
