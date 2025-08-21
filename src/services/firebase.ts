import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const requiredEnvVars = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: REACT_APP_FIREBASE_${key.toUpperCase()}`);
  }
}

const firebaseConfig = requiredEnvVars;

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fix for WebChannel connection issues
if (process.env.NODE_ENV === 'development') {
  // Force long polling for development to avoid WebChannel errors
  try {
    (db as any).settings?.({ experimentalForceLongPolling: true });
  } catch (error) {
    console.log('Firestore settings already initialized');
  }
}

export default app;
