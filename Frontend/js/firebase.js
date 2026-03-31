// 🔥 Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// 🔐 Auth
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 📦 Realtime Database
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// 🔑 YOUR FIREBASE CONFIG (from Firebase console)
const firebaseConfig = {
    apiKey: "AIzaSyCDrSupju3AvhV3u4wRUzdpGowyJBpeW5Q",
    authDomain: "aaranyak-911d6.firebaseapp.com",
    databaseURL: "https://aaranyak-911d6-default-rtdb.firebaseio.com",
    projectId: "aaranyak-911d6",
    storageBucket: "aaranyak-911d6.firebasestorage.app",
    messagingSenderId: "484894981143",
    appId: "1:484894981143:web:f9c765d81b08dbee6ab052"
};


// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Initialize Auth
const auth = getAuth(app);

// 📦 Initialize Database
const db = getDatabase(app);

// ✅ EXPORT BOTH
export { auth, db };