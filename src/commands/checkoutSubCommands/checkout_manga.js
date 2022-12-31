const {
  mangaScraperResponseBuilder,
} = require('../../helpers/responseBuilders/mangaResponseBuilder.js');
// TODO: implement subscription to manga sites
let scrapedResponse;

const mangaHandler = async (interaction, client) => {
  const site = interaction.options.data[0].options[0].value;
  const item = interaction.options.data[0].options[1].value;

  const scraper = require(`../../scrapers/${interaction.options._subcommand}/${site}.js`);

  const scrapedData = await scraper(item).catch((err) => {
    interaction.reply({ content: `${err}`, ephemeral: true });
    return null;
  });

  if (!scrapedData) return null;

  await interaction.reply({ content: 'Item Found', ephemeral: true });

  //extract data for global usage
  scrapedResponse = scrapedData;

  return mangaScraperResponseBuilder(scrapedData, interaction);
};

const getScrapedResponse = () => {
  return scrapedResponse;
};
module.exports = { getScrapedResponse, subCommandHandler: mangaHandler };
