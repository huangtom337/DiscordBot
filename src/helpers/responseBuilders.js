const embedBuilder = require('./embedBuilder.js');
const { primaryButton } = require('./buttonBuilder.js');

const scraperResponseBuilder = async (scrapedData, interaction) => {
  let responses = [];

  const userId = interaction.user.id;
  const site = interaction.options.data[0].options[0].value;

  scrapedData.forEach(async (product) => {
    const embed = embedBuilder(
      product.name,
      product.productUrl,
      site,
      product.salePrice,
      product.thumbnailImage,
      product.inStorePurchase,
      product.onlinePurchase
    );

    //button
    const subscribeButton = primaryButton(
      `${
        city +
        '/' +
        region +
        '/' +
        product.sku +
        '/' +
        userId +
        '/' +
        'subscribe'
      }`,
      'Subscribe'
    );

    const response = {
      embeds: [embed],
      components: [subscribeButton],
    };
    responses = [...responses, response];
  });

  return responses;
};

const queryResponseBuilder = async (subscriptions, interaction) => {
  if (subscriptions.docs.length === 0) {
    interaction.reply({
      content: 'You have no subscriptions',
      ephemeral: true,
    });
    return;
  }

  await interaction.reply({
    content: 'Showing all subscriptions...',
    ephemeral: true,
  });

  let responses = [];

  subscriptions.forEach((doc) => {
    //button
    const unSubscribeButton = primaryButton(
      `${doc.data().productId + '/' + 'unsubscribe'}`,
      'Delete'
    );
    response = {
      embeds: doc.data().embed,
      components: [unSubscribeButton],
    };
    responses = [...responses, response];
  });

  return responses;
};

module.exports = { scraperResponseBuilder, queryResponseBuilder };
