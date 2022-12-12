const { SlashCommandBuilder } = require('@discordjs/builders')

const subscribeCommand = new SlashCommandBuilder()
  .setName('subscribe')
  .setDescription('site to subscribe to')
  .addStringOption((option) => {
    return option
      .setName('walmart')
      .setDescription('subscribe to walmart')
      .setRequired(true);
});

const subscribeJSON = subscribeCommand.toJSON()
const subscribeCommandName = subscribeCommand.name

module.exports = {
    subscribeJSON,
    subscribeCommandName
}
