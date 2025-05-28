// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBvJ4h_zIX7wJiBcVDwqyey0MT_pg2ZiqI',
  authDomain: 'ecoride-7ddce.firebaseapp.com',
  projectId: 'ecoride-7ddce',
  storageBucket: 'ecoride-7ddce.firebasestorage.app',
  messagingSenderId: '881851025497',
  appId: '1:881851025497:web:ce8cf129471847aa948948',
  measurementId: 'G-L2G2Q3PPPX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Initialise l'app Firebase

// Initialise Firestore (base NoSQL)
const db = getFirestore(app);

export { db };
