const embedBuilder = require('../embedBuilders/ecommerceEmbedBuilder');

const dailyEcommerceResponseBuilders = async (subscriptions) => {
  let responses = [];

  subscriptions.forEach(async (subscription) => {
    const info = {
      name: subscription.title,
      url: subscription.url,
      siteName: subscription.site,
      thumbnailImage: subscription.thumbnailImage,
    };
    const embed = embedBuilder(info);

    responses = [...responses, embed];
  });

  return responses;
};

module.exports = dailyEcommerceResponseBuilders;
