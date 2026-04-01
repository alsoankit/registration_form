import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: window.process?.env?.API_KEY || "",
  authDomain: window.process?.env?.AUTH_DOMAIN || "",
  projectId: window.process?.env?.PROJECT_ID || "",
  storageBucket: window.process?.env?.STORAGE_BUCKET || "",
  messagingSenderId: window.process?.env?.MESSAGING_SENDER_ID || "",
  appId: window.process?.env?.APP_ID || "",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
