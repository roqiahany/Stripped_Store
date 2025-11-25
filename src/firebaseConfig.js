// src/firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC6dWY8ZQel0gAfQYK_EN7uBlCmIYDVYtM',
  authDomain: 'stripped-store.firebaseapp.com',
  projectId: 'stripped-store',
  storageBucket: 'stripped-store.firebasestorage.app',
  messagingSenderId: '167612515778',
  appId: '1:167612515778:web:d4989c9dcfbc13e731825b',
  measurementId: 'G-VJF7Z65M5T',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);
