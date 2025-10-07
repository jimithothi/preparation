"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config/api";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (check cookie)
    const storedUser = getCookie("user");
    
    // Note: The 'token' cookie is HttpOnly (set by server), so we can't access it here
    // We only check if user data exists
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        deleteCookie("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: Allows server to set HttpOnly cookie
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const result = await response.json();
      console.log("Login response:", result); // Debug log
      
      const userData = {
        id: result.data._id,
        email: result.data.email,
        name: result.data.email.split("@")[0], // Use email prefix as name
      };

      setUser(userData);
      
      // Store only user data in cookie (token is already set by server as HttpOnly)
      setCookie("user", JSON.stringify(userData), 1);
      
      // Use window.location for more reliable redirect
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear HttpOnly cookie
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Important: Send cookies
      });
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with logout even if API fails
    } finally {
      // Clear client-side data
      setUser(null);
      deleteCookie("user");
      
      // Redirect to login
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
