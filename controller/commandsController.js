const client = require('../client.js');
const { subscribe, unSubscribe } = require('./buttonsController');

const handleReady = () => {
  console.log(`Logged in as ${client.user.tag}!`);
};

const handleChatCommands = async (interaction) => {
  if (!interaction.isChatInputCommand || interaction.isButton()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.log('command not found');
    return;
  }
  await command.handler(interaction);
};

const handleButtonCommand = async (interaction) => {
  if (!interaction.isButton()) return;

  const customId = interaction.customId.split('/');
  const purpose = customId[customId.length - 1];
  if (purpose === 'subscribe') {
    subscribe(interaction);
  } else {
    unSubscribe(interaction);
  }
};

module.exports = {
  handleButtonCommand,
  handleChatCommands,
  handleReady,
};
