import { useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import AdminAuthContext from "./AdminAuthContext";
import { auth, db } from "../services/firebase/firebase";
import type {
  AdminAuthContextValue,
  AdminCodedError,
  AdminProfile,
  LoginAdminInput,
} from "../types/admin";

function createAdminError(code: string, message: string): AdminCodedError {
  const error = new Error(message) as AdminCodedError;
  error.code = code;
  return error;
}

async function readAdminProfile(firebaseUser: User): Promise<AdminProfile> {
  const profileReference = doc(db, "users", firebaseUser.uid);
  const profileSnapshot = await getDoc(profileReference);

  if (!profileSnapshot.exists()) {
    throw createAdminError(
      "admin/profile-not-found",
      "This account does not have an Admin profile.",
    );
  }

  const profileData = profileSnapshot.data();

  if (profileData.role !== "admin") {
    throw createAdminError(
      "admin/not-authorized",
      "This account is not authorized to access the Admin Portal.",
    );
  }

  if (profileData.active !== true) {
    throw createAdminError(
      "admin/account-inactive",
      "This Admin account is currently inactive.",
    );
  }

  return {
    ...profileData,
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    role: "admin",
    active: true,
  } as AdminProfile;
}

function AdminAuthProvider({ children }: PropsWithChildren) {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);

      if (!firebaseUser) {
        setAdminUser(null);
        setAdminProfile(null);
        setAuthLoading(false);
        return;
      }

      try {
        const profile = await readAdminProfile(firebaseUser);
        setAdminUser(firebaseUser);
        setAdminProfile(profile);
      } catch (error: unknown) {
        console.error("Admin session validation failed:", error);
        setAdminUser(null);
        setAdminProfile(null);
        await signOut(auth);
      } finally {
        setAuthLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  async function loginAdmin({
    email,
    password,
    rememberMe,
  }: LoginAdminInput): Promise<AdminProfile> {
    const persistence = rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence;

    await setPersistence(auth, persistence);

    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );

    try {
      const profile = await readAdminProfile(credential.user);
      setAdminUser(credential.user);
      setAdminProfile(profile);
      return profile;
    } catch (error: unknown) {
      await signOut(auth);
      throw error;
    }
  }

  async function sendAdminPasswordReset(email: string): Promise<void> {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      throw createAdminError(
        "admin/email-required",
        "Enter your Admin email address first.",
      );
    }

    await sendPasswordResetEmail(auth, cleanEmail);
  }

  async function logoutAdmin(): Promise<void> {
    await signOut(auth);
    setAdminUser(null);
    setAdminProfile(null);
  }

  const contextValue = useMemo<AdminAuthContextValue>(
    () => ({
      adminUser,
      adminProfile,
      authLoading,
      loginAdmin,
      logoutAdmin,
      sendAdminPasswordReset,
    }),
    [adminUser, adminProfile, authLoading],
  );

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export default AdminAuthProvider;
