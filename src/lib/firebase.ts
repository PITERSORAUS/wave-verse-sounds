
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD003Z9Jy9KiGWqmA1NpGqT8J2feWqNnq8",
  authDomain: "stereomix-prod.firebaseapp.com",
  projectId: "stereomix-prod",
  storageBucket: "gs://stereomix-prod.firebasestorage.app",
  messagingSenderId: "1017434587195",
  appId: "1:1017434587195:web:66d940a54e2d111e131c1e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
