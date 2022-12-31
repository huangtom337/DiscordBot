const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  createAudioPlayer,
  joinVoiceChannel,
  getVoiceConnection,
} = require('@discordjs/voice');
const playCommand = new SlashCommandBuilder()
  .setName('play')
  .setDescription('play youtube music')
  .addStringOption((option) =>
    option
      .setName('url')
      .setDescription('enter youtube video link')
      .setRequired(true)
  );

const playCommandJSON = playCommand.toJSON();

const handler = async (interaction, client) => {
  if (!interaction.isChatInputCommand) return;

  const channelId = interaction.member.voice.channelId;
  const guildId = interaction.guildId;
  const adapterCreator = interaction.guild.voiceAdapterCreator;
  if (!channelId) {
    interaction.reply({ content: 'You must be in a voice channel to do this' });
    return;
  }
  const connection = joinVoiceChannel({
    channelId,
    guildId,
    adapterCreator,
  });

  // TODO: bot leaves when channel size is 1, put this in commandsController
  // TODO: make bot play music with given url. Code in index.js
  const numberOfUsers = interaction.member.voice.channel.members.length;
  if (numberOfUsers <= 1) {
    interaction.reply({ content: 'All users have left' });
    connection.destroy();
    return;
  }
};

module.exports = {
  data: playCommandJSON,
  handler,
};
