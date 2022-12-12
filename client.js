const { Client, Collection, GatewayIntentBits } = require('discord.js')
const fs = require('fs')
const path = require('path')

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.DirectMessages,
    ],
}) 

client.commands = new Collection();

//commands

//fetch commands
(function () {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath);

    for (let file of commandFiles) {
        
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        client.commands.set(command.subscribeCommandName, command.subscribeJSON);
    }
})();


module.exports = client;