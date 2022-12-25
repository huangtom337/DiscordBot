const { SlashCommandBuilder } = require('@discordjs/builders');
const { queryResponseBuilder } = require('../helpers/responseBuilders.js');
const { getAllUserSubscriptions } = require('../helpers/dataBaseQueries.js');

const subscriptionsCommand = new SlashCommandBuilder()
  .setName('subscriptions')
  .setDescription('check current subscriptions')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('e-commerce')
      .setDescription('Check current e-commerce subscriptions')
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('manga')
      .setDescription('Check current manga subscriptions')
  );

const subscriptionsJSON = subscriptionsCommand.toJSON();

const handler = async (interaction) => {
  const subscriptions = await getAllUserSubscriptions(interaction);
  const responses = await queryResponseBuilder(subscriptions, interaction);

  responses.forEach(async (response) => await interaction.user.send(response));
};

module.exports = {
  data: subscriptionsJSON,
  handler,
};
