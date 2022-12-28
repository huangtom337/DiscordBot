const client = require('../client.js');
const { subscribe, unSubscribe } = require('./buttonsController');

let scrapedData;

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
  scrapedData = await command.handler(interaction, client);
};

const handleButtonCommand = async (interaction) => {
  if (!interaction.isButton()) return;

  const customId = interaction.customId.split('/');
  const purpose = customId[customId.length - 1];
  if (purpose === 'subscribe') {
    subscribe(interaction, scrapedData).catch((err) => {
      interaction.reply({ content: err + ' please restart' });
      console.log(err);
    });
  } else {
    unSubscribe(interaction);
  }
};

module.exports = {
  handleButtonCommand,
  handleChatCommands,
  handleReady,
};
