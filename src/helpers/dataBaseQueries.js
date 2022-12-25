const {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} = require('firebase/firestore');
const { primaryButton } = require('../helpers/buttonBuilder.js');
const db = require('../firebase.js');

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

//get all subscriptions that a user has
const getAllUserSubscriptions = async (interaction) => {
  const usersRef = collection(db, 'users');
  const userId = interaction.user.id;

  const q = query(
    usersRef,
    where('userId', '==', `${userId}`),
    orderBy('createdAt')
  );
  const subscriptions = await getDocs(q);

  return subscriptions;
};

// returns a snapshop to all documents in a collection
const getAllSubscriptions = async () => {
  const usersRef = collection(db, 'users');

  return await getDocs(usersRef);
};
module.exports = {
  addToDatabase,
  deleteFromDatabase,
  getAllUserSubscriptions,
  getAllSubscriptions,
};
