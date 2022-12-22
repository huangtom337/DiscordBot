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

  let user = { userId, productId, channel, embed, createdAt };
  const response = await addToDatabase(user);

  if (!response) {
    await interaction.reply({ content: 'You have already subscribed to this' });
    return;
  }

  await interaction.reply({ content: 'successfully subscribed to this item' });
};

const unSubscribe = async (interaction) => {
  //customId : productSku/userId/buttontype
  const customId = interaction.customId;
  const productId = customId.split('/').slice(0, 2).join('/');

  const response = await deleteFromDatabase(productId);
  if (!response) {
    await interaction.reply({
      content: 'You already unsubscribed from this',
    });
    return;
  }

  await interaction.reply({ content: 'sucessfully unsubscribed' });
};

// returns query on sueccesful add, else null
const addToDatabase = async (user) => {
  //query firebase to check for duplicates
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('productId', '==', `${user.productId}`));
  const querySnapshot = await getDocs(q);

  // if user already subscribed to this
  if (querySnapshot.docs.length !== 0) return null;

  // add to database
  await addDoc(usersRef, user);

  return querySnapshot;
};

// returns query on sucessful delete, else null
const deleteFromDatabase = async (productId) => {
  //reference to db and query
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('productId', '==', `${productId}`)); //will be user specific because productId contains userId
  const querySnapshot = await getDocs(q);

  if (querySnapshot.docs.length === 0) return null;
  const docId = querySnapshot.docs[0].id;
  const docRef = doc(db, 'users', docId);
  await deleteDoc(docRef);
  return querySnapshot;
};

module.exports = { subscribe, unSubscribe };
