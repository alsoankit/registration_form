// js/auth.js

import {
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth, provider } from "./firebase-config.js";
import { isEmailAllowlisted } from "./firestore.js"; // 👈 NEW import

/**
 * Handles the Google Sign-In popup flow.
 * @returns {Promise<object>} A result object with user data on success or an error code on failure.
 */
export async function signInUser() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 1) Must be KIIT email
    const email = (user.email || "").toLowerCase();
    if (!email.endsWith("@kiit.ac.in")) {
      await signOut(auth);
      return { success: false, error: "invalid-email" };
    }

    // 2) Extract roll
    const roll = email.split("@")[0];

    // 3) Allow 24… immediately; else check allowlist (fail closed on any error)
    if (!roll.startsWith("24")) {
      const allowed = await isEmailAllowlisted(email);
      if (!allowed) {
        await signOut(auth);
        return { success: false, error: "ineligible-batch" };
      }
    }

    // ✅ All checks passed
    return {
      success: true,
      user: {
        uid: user.uid,
        displayName: user.displayName,
        email,
        rollNumber: roll,
      },
    };
  } catch (error) {
    console.error("Authentication Error:", error.code, error.message);
    return { success: false, error: error.code };
  }
}

/**
 * Handles the Sign-Out flow.
 * @returns {Promise<object>} A result object indicating success or failure.
 */
export async function signOutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout Error:", error);
    return { success: false, error: error.code };
  }
}
