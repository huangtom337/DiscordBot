const { SlashCommandBuilder } = require('@discordjs/builders');
const embedBuilder = require('../helpers/embedBuilder.js');
const { primaryButton } = require('../helpers/buttonBuilder.js');

const checkOutCommand = new SlashCommandBuilder()
  .setName('checkout')
  .setDescription('site to subscribe to')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('e-commerce')
      .setDescription('Check out an e-commerce product')
      .addStringOption((option) =>
        option
          .setName('site')
          .setDescription('subscribe to bestbuy')
          .setRequired(true)
          .setChoices(
            {
              name: 'bestbuy',
              value: 'bestbuy',
            },
            {
              name: 'amazon',
              value: 'amazon',
            }
          )
      )
      .addStringOption((option) =>
        option
          .setName('city')
          .setDescription('enter your city name')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('item')
          .setDescription('enter item to check out')
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('manga')
      .setDescription('Check out a manga update status')
  );

const checkOutJSON = checkOutCommand.toJSON();

const handler = async (interaction) => {
  if (!interaction.isChatInputCommand) return;
  const site = interaction.options.data[0].options[0].value;
  const city = interaction.options.data[0].options[1].value;
  const item = interaction.options.data[0].options[2].value;

  const userId = interaction.user.id;
  const bestBuyScraper = require(`../scrapers/${site}.js`);

  const scrapedData = await bestBuyScraper(item, city).catch((err) => {
    interaction.reply({ content: `${err}`, ephemeral: true });
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
      site,
      product.salePrice,
      product.thumbnailImage,
      product.inStorePurchase,
      product.onlinePurchase
    );

    //button
    const subscribeButton = primaryButton(
      `${product.sku + '/' + userId + '/' + 'subscribe'}`,
      'Subscribe'
    );
    await interaction.user.send({
      embeds: [embed],
      components: [subscribeButton],
    });
  });
};

module.exports = {
  data: checkOutJSON,
  handler,
};
