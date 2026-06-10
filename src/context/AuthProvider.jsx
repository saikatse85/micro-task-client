"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // NORMALIZE EMAIL
  const normalizeEmail = useCallback(
    (email) => email?.trim().toLowerCase(),
    [],
  );

  // LOGOUT
  const logoutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH FROM MONGODB
  const fetchMongoUser = useCallback(
    async (email) => {
      try {
        const res = await fetch(
          `/api/users/${encodeURIComponent(normalizeEmail(email))}`,
        );

        const data = await res.json();

        // IMPORTANT: return data.user not raw data
        return data?.user || null;
      } catch (error) {
        console.log("Mongo fetch error:", error);
        return null;
      }
    },
    [normalizeEmail],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      try {
        if (!firebaseUser?.email) {
          setUser(null);
          setLoading(false);
          setAuthChecked(true);
          return;
        }

        const email = normalizeEmail(firebaseUser.email);

        let dbUser = null;
        let retry = 0;

        // RETRY LOGIC (MongoDB delay fix)
        while (!dbUser && retry < 5) {
          dbUser = await fetchMongoUser(email);

          if (!dbUser) {
            await new Promise((r) => setTimeout(r, 500));
          }

          retry++;
        }

        if (dbUser) {
          setUser({
            email: dbUser.email,
            name: dbUser.name || firebaseUser.displayName,
            photoURL: dbUser.photoURL || firebaseUser.photoURL,
            role: dbUser.role || "worker",
            coin: dbUser.coin ?? 0,
          });
        } else {
          // fallback Firebase only
          setUser({
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: "worker",
            coin: 0,
          });
        }
      } catch (error) {
        console.log("Auth error:", error);
        setUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    });

    return () => unsubscribe();
  }, [fetchMongoUser, normalizeEmail]);

  // MANUAL REFRESH (after profile update)
  const refreshUser = async () => {
    try {
      if (!user?.email) return;

      const dbUser = await fetchMongoUser(user.email);

      if (dbUser) {
        setUser((prev) => ({
          ...prev,
          ...dbUser,
        }));
      }
    } catch (error) {
      console.log("Refresh error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authChecked,
        logoutUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
