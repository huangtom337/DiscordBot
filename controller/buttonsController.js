const {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} = require('firebase/firestore');
const db = require('../firebase.js');

const subscribe = async (interaction) => {
  const channel = interaction.message.channelId;
  const embed = JSON.parse(JSON.stringify(interaction.message.embeds));
  const customId = interaction.customId;
  const productId = customId.split('/').slice(0, 2).join('/');
  const createdAt = serverTimestamp();
  const userId = interaction.user.id;

  //query firebase to check for duplicates
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('productId', '==', `${productId}`));
  const querySnapshot = await getDocs(q);

  // if user already subscribed to this
  if (querySnapshot.docs.length !== 0) {
    await interaction.reply({ content: 'You have already subscribed to this' });
    return;
  }

  // add to database
  let user = { userId, productId, channel, embed, createdAt };
  await addDoc(usersRef, user).catch((err) => {
    throw err;
  });

  await interaction.reply({ content: 'successfully subscribed to this item' });
};

const unSubscribe = async (interaction) => {
  const customId = interaction.customId;
  const productId = customId.split('/').slice(0, 2).join('/');
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('productId', '==', `${productId}`));
  const querySnapshot = await getDocs(q);

  const docId = querySnapshot.docs[0].id;
  const docRef = doc(db, 'users', docId);
  await deleteDoc(docRef);
  interaction.reply({ content: 'sucessfully unsubscribed' });
};

module.exports = { subscribe, unSubscribe };
