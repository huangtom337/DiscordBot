const locationInput = require('../../controller/chatInputController.js');
const {
  ecommerceScraperResponseBuilder,
} = require('../../helpers/responseBuilders.js');

const ecommerceHandler = async (interaction, client) => {
  [region, city] = await locationInput(interaction, client);
  const site = interaction.options.data[0].options[0].value;
  const item = interaction.options.data[0].options[1].value;

  const scraper = require(`../../scrapers/${site}.js`);

  const searchParameter = { item, city, region };

  const scrapedData = await scraper(searchParameter).catch((err) => {
    interaction.followUp({ content: `${err}`, ephemeral: true });
    return null;
  });

  if (!scrapedData) {
    return null;
  } else {
    await interaction.followUp({ content: 'Item Found', ephemeral: true });
  }

  return ecommerceScraperResponseBuilder(scrapedData, interaction);
};

module.exports = ecommerceHandler;
