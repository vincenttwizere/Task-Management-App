import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC5iHtPBq4eFJMM6gYAQT-mBWx66BZXtGk",
  authDomain: "task-flow-demo-7c462.firebaseapp.com",
  projectId: "task-flow-demo-7c462",
  storageBucket: "task-flow-demo-7c462.appspot.com",
  messagingSenderId: "954326524783",
  appId: "1:954326524783:web:0c6f1c1d3c8bd44d5e9cc4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 