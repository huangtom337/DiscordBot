const { SlashCommandBuilder } = require('@discordjs/builders');
const embedBuilder = require('../helpers/embedBuilder.js');

const subscribeCommand = new SlashCommandBuilder()
  .setName('subscribe')
  .setDescription('site to subscribe to')
  .addStringOption((option) =>
    option
      .setName('bestbuy')
      .setDescription('subscribe to bestbuy')
      .setRequired(true)
  );

const subscribeJSON = subscribeCommand.toJSON();

const handler = async (interaction) => {
  if (!interaction.isChatInputCommand) return;

  const data = interaction.options.data[0];
  const scraper = require(`../scrapers/${data.name}.js`);
  const scrapedData = await scraper(data.value).catch(() => {
    interaction.reply({ content: 'No Item Found', ephemeral: true });
    return null;
  });

  if (!scrapedData) {
    return;
  } else {
    await interaction.reply({ content: 'Item Found', ephemeral: true });
  }

  scrapedData.forEach(async (product) => {
    const embed = embedBuilder(
      product.name,
      product.productUrl,
      data.name,
      product.salePrice,
      product.thumbnailImage,
      product.image,
      product.inStorePurchase,
      product.onlinePurchase
    );
    await interaction.user.send({ embeds: [embed] });
  });
};

module.exports = {
  data: subscribeJSON,
  handler,
};
