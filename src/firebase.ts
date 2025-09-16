import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDZKJcx7JGSQjyRwepkPry6KJ6BcuzqM_g",
  authDomain: "piano8283-a9aca.firebaseapp.com",
  projectId: "piano8283-a9aca",
  storageBucket: "piano8283-a9aca.firebasestorage.app",
  messagingSenderId: "702581877359",
  appId: "1:702581877359:web:b3b87df6bfc47c0b93bb9a"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
