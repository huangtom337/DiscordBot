const embedBuilder = require('./embedBuilder.js');
const { primaryButton } = require('./buttonBuilder.js');

const ecommerceScraperResponseBuilder = async (scrapedData, interaction) => {
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
      //city and region obtained from parent class
      `${
        city +
        '/' +
        region +
        '/' +
        product.sku +
        '/' +
        userId +
        '/' +
        'ecommerce' +
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

const ecommerceShowAllBuilder = async (subscriptions, interaction) => {
  if (subscriptions.docs.length === 0) {
    interaction.reply({
      content: 'You have no subscriptions',
      ephemeral: true,
    });
    return null;
  }

  await interaction.reply({
    content: 'Showing all subscriptions...',
    ephemeral: true,
  });

  let responses = [];

  subscriptions.forEach((doc) => {
    //button
    const unSubscribeButton = primaryButton(
      `${doc.data().productId + '/' + 'ecommerce' + '/' + 'unsubscribe'}`,
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

module.exports = { ecommerceScraperResponseBuilder, ecommerceShowAllBuilder };
