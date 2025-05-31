// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDo1UL70LsK0Da8-R-3mQ-9mzV1B_GC0jc",
  authDomain: "zero-thinking-7892c.firebaseapp.com",
  projectId: "zero-thinking-7892c",
  storageBucket: "zero-thinking-7892c.appspot.com",
  messagingSenderId: "394510650093",
  appId: "1:394510650093:web:48b9163d36059781b35ae4",
  measurementId: "G-SBFKZRZLNP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export { db };
