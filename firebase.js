// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBRE4cDRIyyCc7WYnL4v1CHmQ2UHgp_Dlo',
  authDomain: 'discordbot-6740f.firebaseapp.com',
  projectId: 'discordbot-6740f',
  storageBucket: 'discordbot-6740f.appspot.com',
  messagingSenderId: '1086405382530',
  appId: '1:1086405382530:web:9c2974fc54edb7a1907f9b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
