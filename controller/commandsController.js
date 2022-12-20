const client = require('../client.js');

const handleReady = () => {
  console.log(`Logged in as ${client.user.tag}!`);
};

const handleCommands = async (interaction) => {
  if (!interaction.isChatInputCommand) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.log('command not found');
    return;
  }
  await command.handler(interaction);
};

module.exports = {
  handleCommands,
  handleReady,
};
