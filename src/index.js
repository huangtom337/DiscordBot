const client = require('./client.js');
const {
  runAtSpecificTimeOfDay,
  dailyScrapesEcommerce,
} = require('./scrapers/dailyScrapes.js');

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

// periodically scrapes

// runAtSpecificTimeOfDay(20, 00, () => {
//   dailyScrapesEcommerce();
// });
