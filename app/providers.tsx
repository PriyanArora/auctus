"use client";

import { createContext, useContext, type ReactNode } from "react";
import { BusinessProvider } from "@/lib/demo/BusinessContext";
import { ToastProvider } from "@/lib/ToastContext";
import { useSession } from "@/lib/session/use-session";

type AuthContextValue = ReturnType<typeof useSession>;

const AuthContext = createContext<AuthContextValue>({
  session: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useSession();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <BusinessProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </BusinessProvider>
  );
}
