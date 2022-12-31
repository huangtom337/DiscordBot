const client = require('../client.js');

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
  const type = customId[0];
  if (purpose === 'subscribe') {
    const { subscribe } = require(`./buttonsController/${type}Buttons`);
    subscribe(interaction, scrapedData).catch((err) => {
      interaction.reply({ content: err + ' please restart' });
      console.log(err);
    });
  } else {
    const { unSubscribe } = require(`./buttonsController/${type}Buttons`);
    unSubscribe(interaction);
  }
};

// TODO: handle checking when user leaves and make bot leave the channel as well
const handleVoiceCommands = async (oldState, newState) => {
  if (oldState.member.user.bot) return;

  const channelId = newState.member.voice.channelId;

  if (newState.member.voice.channel) {
    console.log(oldState.member.voice.channel);
  }
};

module.exports = {
  handleButtonCommand,
  handleChatCommands,
  handleReady,
  handleVoiceCommands,
};
