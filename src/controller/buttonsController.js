const { serverTimestamp } = require('firebase/firestore');
const {
  addToDatabase,
  deleteFromDatabase,
} = require('../helpers/dataBaseQueries.js');

const subscribe = async (interaction, scrapedData) => {
  if (!scrapedData) throw Error('Clicked subscribe without fetching');

  const channel = interaction.message.channelId;
  const embed = JSON.parse(JSON.stringify(interaction.message.embeds));
  const customId = interaction.customId;
  const userId = interaction.user.id;
  const collectionName = customId.split('/').slice(0, 1)[0];

  const url = embed[0].url.split('/');
  const sku = url[url.length - 1];
  const productId = userId + '/' + sku;

  [scrapedData] = scrapedData.filter((product) => product.sku === sku);

  const canBeNotified = scrapedData.canBeNotified;
  const locationIDs = scrapedData.locationIDs;
  const status = {
    inStore: scrapedData.inStorePurchase,
    online: scrapedData.onlinePurchase,
  };

  const createdAt = serverTimestamp();

  let user = {
    status,
    canBeNotified,
    locationIDs,
    userId,
    productId,
    channel,
    embed,
    createdAt,
  };
  const response = await addToDatabase(user, collectionName);

  if (!response) {
    await interaction.reply({ content: 'You have already subscribed to this' });
    return;
  }

  await interaction.reply({ content: 'successfully subscribed to this item' });
};

const unSubscribe = async (interaction) => {
  const embed = JSON.parse(JSON.stringify(interaction.message.embeds));
  const customId = interaction.customId; // collectionType/purpose
  const collectionName = customId.split('/').slice(0, 1)[0];

  const url = embed[0].url.split('/');
  const sku = url[url.length - 1];
  const userId = interaction.user.id;
  const productId = userId + '/' + sku;

  const response = await deleteFromDatabase(productId, collectionName);
  if (!response) {
    await interaction.reply({
      content: 'You already unsubscribed from this',
    });
    return;
  }

  await interaction.reply({ content: 'sucessfully unsubscribed' });
};

module.exports = { subscribe, unSubscribe };
