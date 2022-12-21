const client = require('../client.js');
const {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} = require('firebase/firestore');
const db = require('../firebase.js');

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

  //assigned button id to product sku
  const productSku = interaction.customId;
  const channel = interaction.message.channelId;
  const userId = interaction.user.id;
  const embed = JSON.parse(JSON.stringify(interaction.message.embeds));

  //query firebase to check for duplicates
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    where('userId', '==', `${userId}`),
    where('productSku', '==', `${productSku}`)
  );
  const querySnapshot = await getDocs(q);

  // if user already subscribed to this

  if (querySnapshot.docs.length !== 0) {
    await interaction.reply({ content: 'You have already subscribed to this' });
    return;
  }

  // add to database
  let user = { userId, productSku, channel, embed };
  await addDoc(usersRef, user).catch((err) => {
    throw err;
  });

  await interaction.reply({ content: 'successfully subscribed to this item' });
};

module.exports = {
  handleButtonCommand,
  handleChatCommands,
  handleReady,
};
