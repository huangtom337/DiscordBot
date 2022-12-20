const client = require('./client.js');

// const cheerio = require('cheerio');
const {
  handleCommands,
  handleReady,
} = require('./controller/commandsController.js');

// starting the bot
client.login(process.env.TOKEN);

client.on('ready', handleReady);

client.on('interactionCreate', handleCommands);

// webscraper
