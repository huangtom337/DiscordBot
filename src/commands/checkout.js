const { SlashCommandBuilder } = require('@discordjs/builders');

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
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('manga')
      .setDescription('Check out a manga update status')
  );

const checkOutJSON = checkOutCommand.toJSON();

const handler = async (interaction, client) => {
  if (!interaction.isChatInputCommand) return;

  const subCommandHandler = require(`./subCommands/${interaction.options._subcommand}`);
  const responses = await subCommandHandler(interaction, client);

  // sends responses
  responses.forEach(async (response) => await interaction.user.send(response));
};

module.exports = {
  data: checkOutJSON,
  handler,
};
