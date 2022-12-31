const {
  mangaShowAllBuilder,
} = require('../../helpers/responseBuilders/mangaResponseBuilder.js');
const { getAllUserSubscriptions } = require('../../helpers/dataBaseQueries.js');

const mangaSubscriptions = async (interaction) => {
  const subscriptions = await getAllUserSubscriptions(interaction, 'manga');
  return mangaShowAllBuilder(subscriptions, interaction);
};

module.exports = mangaSubscriptions;
