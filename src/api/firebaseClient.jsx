import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2SAUlVn8Bp2v-0JfIpatKeGo4Z39NxTc",
  authDomain: "pizzeria-forno.firebaseapp.com",
  projectId: "pizzeria-forno",
  storageBucket: "pizzeria-forno.firebasestorage.app",
  messagingSenderId: "1014074128400",
  appId: "1:1014074128400:web:29e2de5924a4c79ab8b295"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { firebaseConfig };
