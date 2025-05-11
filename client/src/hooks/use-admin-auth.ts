import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface AuthResponse {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface AuthStatus {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useAdminAuth(): AuthStatus {
  const { data, isLoading, error } = useQuery<AuthResponse>({
    queryKey: ['/api/auth/status'],
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  // Default to false when data is undefined
  const authData = data || { isAuthenticated: false, isAdmin: false };
  
  // Store auth status in localStorage for components that need to check admin status
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('isAuthenticated', authData.isAuthenticated.toString());
      localStorage.setItem('isAdmin', authData.isAdmin.toString());
    }
  }, [authData.isAuthenticated, authData.isAdmin, isLoading]);

  return {
    isAuthenticated: authData.isAuthenticated,
    isAdmin: authData.isAdmin,
    isLoading,
    error: error as Error | null,
  };
}
