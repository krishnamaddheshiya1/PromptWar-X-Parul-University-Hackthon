import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { UserProfile, UserRole } from "../types";

// Firebase configuration provided by the user
export const firebaseConfig = {
  apiKey: "AIzaSyA1gVR6mWnD2OlmOa-f9xgzoIj694D_7NY",
  authDomain: "mentor-caa6a.firebaseapp.com",
  projectId: "mentor-caa6a",
  storageBucket: "mentor-caa6a.firebasestorage.app",
  messagingSenderId: "319437411914",
  appId: "1:319437411914:web:d0419ff909eae8e603f8b3",
  measurementId: "G-YTT2ZYBKGG",
};

// Initialize Firebase App safely (singleton pattern)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics conditionally to prevent iframe/cookie sandbox exceptions
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Firebase Analytics not supported in this environment:", err);
    });
}
export { analytics };

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Helper to convert Firebase User + metadata to our application UserProfile
export function mapFirebaseUserToProfile(
  fbUser: FirebaseUser,
  customRole: UserRole = "student",
  extra?: { department?: string; institution?: string; rollNumber?: string }
): UserProfile {
  return {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split("@")[0] || "Academic Candidate",
    email: fbUser.email || "user@mentor.edu",
    role: customRole,
    rollNumber: extra?.rollNumber || "CS21B" + Math.floor(100 + Math.random() * 899),
    department: extra?.department || "Computer Science & Engineering",
    institution: extra?.institution || "National Institute of Technology",
    avatarUrl:
      fbUser.photoURL ||
      `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    joinedAt: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
}

// Authentication Helpers
export async function firebaseSignIn(email: string, pass: string): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

export async function firebaseSignUp(
  email: string,
  pass: string,
  displayName: string
): Promise<FirebaseUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
}

export async function firebaseSignInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function firebaseSignOut(): Promise<void> {
  await signOut(auth);
}
