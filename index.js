const client = require('./client.js');

// const cheerio = require('cheerio');
const {
  handleChatCommands,
  handleReady,
  handleButtonCommand,
} = require('./controller/commandsController.js');

// starting the bot
client.login(process.env.TOKEN);

client.on('ready', handleReady);

client.on('interactionCreate', handleChatCommands);

client.on('interactionCreate', handleButtonCommand);

// webscraper
