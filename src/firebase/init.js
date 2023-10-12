import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyCAzzwjmq66WpXJJNe4W0WQTvcvyTIMUfo",
    authDomain: "vue-todo-fa501.firebaseapp.com",
    projectId: "vue-todo-fa501",
    storageBucket: "vue-todo-fa501.appspot.com",
    messagingSenderId: "531308482007",
    appId: "1:531308482007:web:06e66c0fefb741ec2c0f92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();
export const auth = getAuth();