import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "../../firebase";

let authUnsubscribe = null; // 🔒 prevent multiple listeners

export const useAuthStore = create((set) => ({
  /* ---------- STATE ---------- */
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  error: null,

  /* ---------- INIT AUTH LISTENER ---------- */
  initAuthListener: () => {
    // ⛔ already listening
    if (authUnsubscribe) return;

    authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        set({
          authUser: {
            uid: user.uid,
            email: user.email,
            name: user.displayName || "User",
            photoURL: user.photoURL || null
          },
          isCheckingAuth: false
        });
      } else {
        set({
          authUser: null,
          isCheckingAuth: false
        });
      }
    });
  },

  /* ---------- SIGN UP ---------- */
  signup: async ({ fullName, email, password }) => {
    try {
      set({ isSigningUp: true, error: null });

      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, {
        displayName: fullName
      });

      set({
        authUser: {
          uid: res.user.uid,
          email: res.user.email,
          name: fullName,
          photoURL: null
        },
        isSigningUp: false
      });
    } catch (err) {
      set({
        error: err.message,
        isSigningUp: false
      });
    }
  },

  /* ---------- LOGIN ---------- */
  login: async ({ email, password }) => {
    try {
      set({ isLoggingIn: true, error: null });

      const res = await signInWithEmailAndPassword(auth, email, password);

      set({
        authUser: {
          uid: res.user.uid,
          email: res.user.email,
          name: res.user.displayName || "User",
          photoURL: res.user.photoURL || null
        },
        isLoggingIn: false
      });
    } catch (err) {
      set({
        error: err.message,
        isLoggingIn: false
      });
    }
  },

  /* ---------- LOGOUT ---------- */
  logout: async () => {
    await signOut(auth);

    set({
      authUser: null,
      isCheckingAuth: false
    });
  }
}));
