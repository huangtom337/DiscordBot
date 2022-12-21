const client = require('../client.js');

const handleReady = () => {
  console.log(`Logged in as ${client.user.tag}!`);
};

const handleChatCommands = async (interaction) => {
  if (!interaction.isChatInputCommand) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.log('command not found');
    return;
  }
  await command.handler(interaction);
};

const handleButtonCommand = async (interaction) => {
  if (!interaction.isButton()) return;

  const product = interaction.message.embeds[0];
  console.log(interaction.message.embeds);
  const channel = client.channels.cache.get(`${interaction.channelId}`);
  await interaction.reply({ content: 'successfully subscribed to this item' });
};

module.exports = {
  handleButtonCommand,
  handleChatCommands,
  handleReady,
};
