import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { auth } from "../lib/firebase";



export const useAuthStore = create((set) => ({
  user: null,
  isLoggingIn: false,
  isSigningUp: false,
  error: null,

  /* ---------- SIGN UP ---------- */
  signup: async ({ fullName, email, password }) => {
    try {
      set({ isSigningUp: true, error: null });

      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 👤 Set display name
      await updateProfile(res.user, {
        displayName: fullName
      });

      set({
        user: {
          uid: res.user.uid,
          email: res.user.email,
          name: fullName,
          photoURL: res.user.photoURL || null
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
        user: {
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
    set({ user: null });
  }
}));
