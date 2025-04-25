
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5DqwZ4aZEkNw4W1tQnmv7pegc9X3qJOQ",
  authDomain: "nibtube-68833.firebaseapp.com",
  projectId: "nibtube-68833",
  storageBucket: "nibtube-68833.appspot.com",
  messagingSenderId: "479041709810",
  appId: "1:479041709810:web:967e8e40ba3f18d4c2126b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export default app;