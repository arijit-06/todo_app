import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

export const signInWithEmail = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(`Sign in failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(`Sign up failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const signInWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    throw new Error(`Google sign in failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const logout = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const resetPassword = async (email: string) => {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(`Password reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
