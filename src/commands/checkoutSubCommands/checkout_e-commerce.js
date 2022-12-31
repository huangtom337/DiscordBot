const locationInput = require('../../controller/chatInputController.js');
const {
  ecommerceScraperResponseBuilder,
} = require('../../helpers/responseBuilders/ecommerceResponseBuilder.js');

let scrapedResponse;

const ecommerceHandler = async (interaction, client) => {
  [region, city] = await locationInput(interaction, client);
  const site = interaction.options.data[0].options[0].value;
  const item = interaction.options.data[0].options[1].value;

  const scraper = require(`../../scrapers/${interaction.options._subcommand}/${site}.js`);
  const location = city + '/' + region;
  const searchParameter = { item, location };

  const scrapedData = await scraper(searchParameter).catch((err) => {
    interaction.followUp({ content: `${err}`, ephemeral: true });
    return null;
  });

  if (!scrapedData) return null;

  await interaction.followUp({ content: 'Item Found', ephemeral: true });

  //extract data for global usage
  scrapedResponse = scrapedData;

  return ecommerceScraperResponseBuilder(scrapedData, interaction);
};

const getScrapedResponse = () => {
  return scrapedResponse;
};
module.exports = { getScrapedResponse, subCommandHandler: ecommerceHandler };
