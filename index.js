const client = require('./client.js')
const dotenv = require('dotenv')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord.js')
dotenv.config();


const commands = client.commands

//register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

//starting the bot
client.login(process.env.TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand) return;

  // interaction.options.data = [{name: '', description: '', type: '3'}]
  console.log(subscribeCommand.toJSON());
  if (interaction.commandName === 'subscribe') {
    // const walmartSubscription: string =
    //   interaction.options.getString('walmart')!;
    const siteName = interaction.options.data[0].name;
    const searchTerm = interaction.options.getString(`${siteName}`);
    console.log('itworked')
    // try {
    //   await interaction.reply({ content: walmartSubscription });
    // } catch (err) {
    //   console.log(err);
    // }
  }
});