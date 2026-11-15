
import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithPopup, signOut } from "firebase/auth";

import { auth, googleProvider } from "@/firebase";
import api from "@/axios";

// LOGIN WITH GOOGLE
export const loginUser = createAsyncThunk(
  "auth/login",
  async (_, { rejectWithValue }) => {
    try {
      // Firebase Google authentication
      const result = await signInWithPopup(auth, googleProvider);

      // Get Firebase ID token
      const firebaseToken = await result.user.getIdToken();

      // Send token to backend and receive JWT cookie
      const { data } = await api.post("/api/auth/login", {
        token: firebaseToken,
      });

      return data.user;
    } catch (error) {
      // Roll back Firebase login if backend authentication fails
      if (auth.currentUser) {
        await signOut(auth).catch(() => {});
      }

      return rejectWithValue(
        error.response?.data?.message || error.message || "Google login failed"
      );
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    let logoutError = null;

    try {
      // Clear JWT cookie from backend
      await api.post("/api/auth/logout");
    } catch (error) {
      logoutError =
        error.response?.data?.message || "Backend logout failed";
    }

    // Sign out from Firebase
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase logout error:", error);
    }

    if (logoutError) {
      return rejectWithValue(logoutError);
    }

    return true;
  }
);

// GET CURRENT LOGGED-IN USER
export const getCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/users/me");

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch user"
      );
    }
  }
);
