"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface AuthContextType {
  isSessionExpired: boolean;
  sessionExpiredRedirectUrl?: string;
  triggerSessionExpired: (redirectUrl?: string) => void;
  clearSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [sessionExpiredRedirectUrl, setSessionExpiredRedirectUrl] = useState<
    string | undefined
  >();

  const triggerSessionExpired = useCallback((redirectUrl?: string) => {
    setIsSessionExpired(true);
    setSessionExpiredRedirectUrl(redirectUrl);
  }, []);

  const clearSessionExpired = useCallback(() => {
    setIsSessionExpired(false);
    setSessionExpiredRedirectUrl(undefined);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isSessionExpired,
        sessionExpiredRedirectUrl,
        triggerSessionExpired,
        clearSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
