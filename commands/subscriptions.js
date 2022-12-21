const { SlashCommandBuilder } = require('@discordjs/builders');

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
  await interaction.reply('fuck you');
};

module.exports = {
  data: subscriptionsJSON,
  handler,
};
