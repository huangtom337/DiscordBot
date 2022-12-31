const embedBuilder = require('../embedBuilders/mangaEmbedBuilder.js');
const { primaryButton } = require('../buttonBuilder.js');

const mangaScraperResponseBuilder = async (scrapedData, interaction) => {
  const site = interaction.options.data[0].options[0].value;

  const info = {
    name: scrapedData.name,
    url: scrapedData.URL,
    siteName: site,
    thumbnailImage: scrapedData.imageURL,
    newestChapterNumber: scrapedData.newestChapterNumber,
    mangaStatus: scrapedData.status,
  };

  const embed = embedBuilder(info);
  const subscribeButton = primaryButton('manga/subscribe', 'Subscribe');
  const response = {
    embeds: [embed],
    components: [subscribeButton],
  };

  return [response];
};

const mangaShowAllBuilder = async (subscriptions, interaction) => {
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
      `${'manga' + '/' + doc.data().mangaId + '/' + 'unsubscribe'}`,
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

module.exports = { mangaScraperResponseBuilder, mangaShowAllBuilder };
