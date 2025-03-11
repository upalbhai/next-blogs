// lib/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your Firebase configuration (replace with your credentials)
const firebaseConfig = {
    apiKey: "AIzaSyD-9cb7koBnbWoQELGnysQn77nkKlAYOlM",
    authDomain: "blog-site-be21f.firebaseapp.com",
    projectId: "blog-site-be21f",
    storageBucket: "blog-site-be21f.firebasestorage.app",
    messagingSenderId: "377539855759",
    appId: "1:377539855759:web:f1a055aca4c79d312337fa"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Functions for authentication
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export { auth, signInWithGoogle, logOut };
