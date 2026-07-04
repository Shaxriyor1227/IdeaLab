import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbkuFeparyTNCjVshKWFapZ3mbOelzYqc",
  authDomain: "idealab-a960d.firebaseapp.com",
  projectId: "idealab-a960d",
  storageBucket: "idealab-a960d.firebasestorage.app",
  messagingSenderId: "608971817676",
  appId: "1:608971817676:web:82aeaf6cb49e88e3983869",
  measurementId: "G-RBLM2FXHYB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export default app;
