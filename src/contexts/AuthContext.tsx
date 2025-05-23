import React, { createContext, useState, useContext, useEffect } from "react";
import { api } from "../lib/api";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (otp: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if the user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Set the token in axios defaults
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Get user data
          const response = await api.get("/user/profile");
          setUser(response.data);
        }
      } catch (err) {
        // Clear any invalid token
        localStorage.removeItem("token");
        api.defaults.headers.common["Authorization"] = "";
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.post("/accounts/login", { email, password });
      const { token, email: userEmail } = response.data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Set basic user data from login response
      setUser({ id: "", email: userEmail });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    password1: string,
    name?: string
  ) => {
    try {
      setLoading(true);
      await api.post("/accounts/signup", {
        email,
        password,
        password1,
        first_name: name,
      });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Optional: call logout endpoint if your backend requires it
      // await api.post('/logout');

      localStorage.removeItem("token");
      api.defaults.headers.common["Authorization"] = "";
      setUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setLoading(true);
      await api.post("/accounts/forgot-password", { email });
      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to request password reset"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setLoading(true);
      await api.post("/accounts/verify-otp-password-recovery", { email, otp });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      setLoading(true);
      await api.post("/accounts/reset-password", { token, password });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      setLoading(true);
      await api.post("/accounts/send-verification-otp");
      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to send verification email"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (otp: string) => {
    try {
      setLoading(true);
      await api.post("/accounts/verify-user", { otp });

      // Refresh user data after verification
      const response = await api.get("/user/profile");
      setUser(response.data);

      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify email");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setLoading(true);
      // Redirect to Google login URL provided by your backend
      window.location.href = `${api.defaults.baseURL}/accounts/google/login`;
      // The redirect will handle the rest
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login with Google");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        requestPasswordReset,
        verifyOTP,
        resetPassword,
        sendVerificationEmail,
        verifyEmail,
        googleLogin,
        error,
        clearError,
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
