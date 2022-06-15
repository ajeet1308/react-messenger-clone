// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
// };
const firebaseConfig = {
  apiKey: "AIzaSyAYAOWRLL7bg2LrYY8wnUCZcRS1gMUReNE",
  authDomain: "react-messenger-61b7c.firebaseapp.com",
  databaseURL: "http://react-messenger-61b7c.firebaseio.com",
  projectId: "react-messenger-61b7c",
  storageBucket: "react-messenger-61b7c.appspot.com",
  messagingSenderId: "509497047981",
  appId: "1:509497047981:web:7e23bc6ae0b8d5a288bf24"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth,db,storage};