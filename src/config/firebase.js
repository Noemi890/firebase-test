import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyA1-OmruGU5FRomeenR4Il4K0gNM3hwsnw",
  authDomain: "fir-test-8ca56.firebaseapp.com",
  projectId: "fir-test-8ca56",
  storageBucket: "fir-test-8ca56.appspot.com",
  messagingSenderId: "612282549490",
  appId: "1:612282549490:web:49c5a45a70175ad8f27c6b",
  measurementId: "G-1MXTQ51FJH"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)