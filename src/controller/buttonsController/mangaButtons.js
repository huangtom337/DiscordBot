const { serverTimestamp } = require('firebase/firestore');
const {
  addToDatabase,
  deleteFromDatabase,
} = require('../../helpers/dataBaseQueries.js');

const subscribe = async (interaction, scrapedData) => {
  if (!scrapedData) throw Error('Clicked subscribe without fetching');

  const embed = JSON.parse(JSON.stringify(interaction.message.embeds));
  const customId = interaction.customId;
  const userId = interaction.user.id;
  const collectionName = customId.split('/').slice(0, 1)[0];
  const productId = userId + '/' + scrapedData.id;
  const createdAt = serverTimestamp();

  const canBeNotified = 'test';
  let user = {
    status: scrapedData.status,
    newestChapterNumber: scrapedData.newestChapterNumber,
    newestChapterID: scrapedData.newestChapterID,
    canBeNotified,
    mangaURL: scrapedData.URL,
    userId,
    mangaId: scrapedData.id,
    embed,
    newestChapterReadableAt: scrapedData.newestChapterReadableAt,
    createdAt,
    productId,
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
  const mangaId = customId.split('/').slice(1, 2)[0];
  const userId = interaction.user.id;
  const productId = userId + '/' + mangaId;

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
