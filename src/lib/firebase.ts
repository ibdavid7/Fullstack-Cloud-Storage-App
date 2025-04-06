import { initializeApp, initializeServerApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import { getAuth, signInWithCustomToken } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: "cloud-locker-927f8.firebaseapp.com",
//   projectId: "cloud-locker-927f8",
//   storageBucket: "cloud-locker-927f8.appspot.com",
//   messagingSenderId: "553090649104",
//   appId: "1:553090649104:web:3b4090d3a5909efc178e95",
// };

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "storage-project-42068.firebaseapp.com",
  projectId: "storage-project-42068",
  storageBucket: "storage-project-42068.firebasestorage.app",
  messagingSenderId: "405745540873",
  appId: "1:405745540873:web:6136284a73f942fa39fdd8",
  measurementId: "G-RNWJ5DY2KQ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);
export const storage = getStorage(app);
export const rootStorage = ref(storage);

const serverApp = initializeServerApp(firebaseConfig, {
  // authIdToken: "Your Auth ID Token",
});
export const serverDatabase = getFirestore(serverApp);
export const serverStorage = getStorage(serverApp);
export const serverRootStorage = ref(serverStorage);
export const serverAuth = getAuth(serverApp);
export const serverAppInstance = serverApp;
