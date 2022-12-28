const embedBuilder = require('../embedBuilder.js');
const { primaryButton } = require('../buttonBuilder.js');

const ecommerceScraperResponseBuilder = async (scrapedData, interaction) => {
  let responses = [];

  const site = interaction.options.data[0].options[0].value;

  scrapedData.forEach(async (product) => {
    const inStoreStatus = checkInStoreStatus(product.inStorePurchase);
    const onlineStatus = checkOnlineStatus(product.onlinePurchase);

    const info = {
      name: product.name,
      url: product.productUrl,
      siteName: site,
      price: product.salePrice,
      thumbnailImage: product.thumbnailImage,
      inStore: inStoreStatus,
      online: onlineStatus,
    };
    const embed = embedBuilder(info);

    //button

    const subscribeButton = primaryButton(
      //city and region obtained from parent class
      `${'ecommerce' + '/' + 'subscribe'}`,
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
      `${'ecommerce' + '/' + 'unsubscribe'}`,
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

const checkInStoreStatus = (itemStatus) => {
  switch (itemStatus) {
    case 'InStock':
      return 'Item is in stock';

    case 'OutOfStock':
      return 'Item is out of stock';

    case 'Preorder':
      return 'Item can be preordered online';

    case 'OnlineOnly':
      return 'Item can only be purchased online';

    default:
      return itemStatus;
  }
};

const checkOnlineStatus = (itemStatus) => {
  switch (itemStatus) {
    case 'InStock':
      return 'Item is in stock';

    case 'SoldOutOnline':
      return 'Item is out of stock';

    case 'Preorder':
      return 'Item can be preordered online';

    case 'InStoreOnly':
      return 'Item can only be purchased in store';

    case 'InStockOnlineOnly':
      return 'Item is in stock';

    default:
      return itemStatus;
  }
};

module.exports = { ecommerceScraperResponseBuilder, ecommerceShowAllBuilder };
