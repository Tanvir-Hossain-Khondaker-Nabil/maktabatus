import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCSMQzM2h9ofhKBd1cN5tfVI8ptUcYx_Og",
  authDomain: "maktabatussalam-91976.firebaseapp.com",
  projectId: "maktabatussalam-91976",
  storageBucket: "maktabatussalam-91976.appspot.com",
  messagingSenderId: "945188951787",
  appId: "1:945188951787:web:3c0953c28041458d6350ae",
  measurementId: "G-4EWEHBLXRR"
};


// Initialize Firestore and Storage
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);