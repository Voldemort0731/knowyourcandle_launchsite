"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useGoogleLogin } from "@react-oauth/google";

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  isPro?: boolean;
}

interface AuthContextType {
  user: GoogleUser | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const userInfo = await response.json();
        
        // Fetch subscription status from our DB
        let isPro = false;
        try {
          const subRes = await fetch(`/api/verify-access?email=${encodeURIComponent(userInfo.email)}`, { 
            cache: 'no-store' 
          });
          const subData = await subRes.json();
          isPro = subData.hasAccess;
        } catch (err) {
          console.error("Failed to fetch subscription status", err);
        }
        
        setUser({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          isPro,
        });
      } catch (err) {
        console.error("Failed to fetch user info", err);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Login Failed", error);
      setLoading(false);
    },
    onNonOAuthError: () => setLoading(false),
  });

  const login = () => {
    setLoading(true);
    googleLogin();
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
