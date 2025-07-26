import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4hGm8dY4JwOQZGOFOV3M9v7ZHqxzW0cE",
  authDomain: "notely-ce6b2.firebaseapp.com",
  projectId: "notely-ce6b2",
  storageBucket: "notely-ce6b2.firebasestorage.app",
  messagingSenderId: "68802222937",
  appId: "1:68802222937:web:80db26964b3e89faa0ca48",
  measurementId: "G-Y3M832JEGS",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
