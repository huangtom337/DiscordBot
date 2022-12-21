const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require('@discordjs/builders');
const { ButtonStyle } = require('discord.js');
const embedBuilder = require('../helpers/embedBuilder.js');

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
          .setName('item')
          .setDescription('enter item to check out')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('region')
          .setDescription('enter the province code')
          .setMaxLength(2)
          .setMinLength(2)
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
  const item = interaction.options.data[0].options[1].value;
  const region = interaction.options.data[0].options[2].value;
  const scraper = require(`../scrapers/${site}.js`);

  const scrapedData = await scraper(item, region).catch((err) => {
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
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`${product.sku}`)
        .setLabel('Click to subscribe for notification')
        .setStyle(ButtonStyle.Primary)
    );
    await interaction.user.send({ embeds: [embed], components: [row] });
  });
};

module.exports = {
  data: checkOutJSON,
  handler,
};
