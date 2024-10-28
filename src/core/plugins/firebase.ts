import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  type User
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGmJBV-QiLVuOOK7cGwXL5yF8kKAqq-8w",
  authDomain: "tic-tac-toe-online-5ea30.firebaseapp.com",
  projectId: "tic-tac-toe-online-5ea30",
  storageBucket: "tic-tac-toe-online-5ea30.appspot.com",
  messagingSenderId: "1029232308172",
  appId: "1:1029232308172:web:dc7a00d69a52717755f769",
  measurementId: "G-EB26HKYNWT",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export {
  auth,
  provider,
  signInWithPopup,
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onAuthStateChanged,
  signOut, 
};

export type { User };
