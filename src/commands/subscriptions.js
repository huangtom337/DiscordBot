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
  if (!interaction.isChatInputCommand) return;

  const subCommandHandler = require(`./subscriptionsSubCommands/subscriptions_${interaction.options._subcommand}`);
  const responses = await subCommandHandler(interaction);
  if (!responses) return;

  responses.forEach(async (response) => await interaction.user.send(response));
};

module.exports = {
  data: subscriptionsJSON,
  handler,
};
