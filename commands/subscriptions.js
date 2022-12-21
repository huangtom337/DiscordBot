const { SlashCommandBuilder } = require('@discordjs/builders');
const { primaryButton } = require('../helpers/buttonBuilder.js');
const {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} = require('firebase/firestore');
const db = require('../firebase.js');

const subscriptionsCommand = new SlashCommandBuilder()
  .setName('subscriptions')
  .setDescription('check current subscriptions')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('e-commerce')
      .setDescription('Check current e-commerce subscriptions')
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('manga')
      .setDescription('Check current manga subscriptions')
  );

const subscriptionsJSON = subscriptionsCommand.toJSON();

const handler = async (interaction) => {
  const usersRef = collection(db, 'users');
  const userId = interaction.user.id;

  const q = query(
    usersRef,
    where('userId', '==', `${userId}`),
    orderBy('createdAt')
  );
  const subscriptions = await getDocs(q);

  if (subscriptions.docs.length === 0) {
    interaction.reply({
      content: 'You have no subscriptions',
      ephemeral: true,
    });
    return;
  }

  interaction.reply({
    content: 'Showing all subscriptions...',
    ephemeral: true,
  });

  subscriptions.forEach((doc) => {
    //button
    const unSubscribeButton = primaryButton(
      `${doc.data().productId + '/' + 'unsubscribe'}`,
      'Delete'
    );
    interaction.user.send({
      embeds: doc.data().embed,
      components: [unSubscribeButton],
    });
  });
};

module.exports = {
  data: subscriptionsJSON,
  handler,
};
