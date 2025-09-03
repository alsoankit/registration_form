// js/firestore.js

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase-config.js";

/**
 * Submits the completed form data to Firestore.
 * @param {string} uid The user's unique ID.
 * @param {object} formData The collected data from the form.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function submitFormToDB(uid, formData) {
  if (!uid) {
    return { success: false, error: "no-user" };
  }

  try {
    const docRef = doc(db, "submissions", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: false, error: "already-submitted" };
    }

    await setDoc(docRef, {
      ...formData,
      submittedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error writing to Firestore:", error);
    return { success: false, error: error.code };
  }
}

/**
 * Checks the 'config/settings' document to see if registrations are open.
 * @returns {Promise<boolean>} True if registrations are open, false otherwise.
 */
export async function getRegistrationStatus() {
  try {
    // Publicly readable per security rules
    const docRef = doc(db, "config", "settings");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().registrationsOpen === true) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error reading registration status:", error);
    return false; // Default to closed on any error
  }
}

/**
 * Returns true if the full email exists as a key in /config/allowlist.emails.
 * - Requires the caller to be authenticated (per security rules).
 * - Fails closed (returns false) on any error.
 * @param {string} email Full email to check (e.g., "25057001@kiit.ac.in")
 * @returns {Promise<boolean>}
 */
export async function isEmailAllowlisted(email) {
  try {
    const normalized = (email || "").toLowerCase();
    const ref = doc(db, "config", "allowlist");
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;

    const data = snap.data();
    return !!(data && data.emails && data.emails[normalized] === true);
  } catch (err) {
    console.error("Allowlist check failed:", err);
    return false;
  }
}
