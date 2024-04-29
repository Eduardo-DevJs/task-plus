import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHgWVU3oQqjpboatq1QYJpcwh4M-OonwQ",
  authDomain: "tasksplus-16a55.firebaseapp.com",
  projectId: "tasksplus-16a55",
  storageBucket: "tasksplus-16a55.appspot.com",
  messagingSenderId: "669448494236",
  appId: "1:669448494236:web:c630cb83519db0f395e159",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
