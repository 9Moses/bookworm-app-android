// store/authStore.ts
import { API_URL } from "@/constants/api";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  user: any;
  token: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;     // fixed typo
  authError: string | null;

  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,
  authError: null,

  clearError: () => set({ authError: null }),

  checkAuth: async () => {
    set({ isCheckingAuth: true, authError: null });
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedToken && storedUser) {
        set({ token: storedToken, user: JSON.parse(storedUser) });
      }
    } catch (error) {
      console.error("Auth check failed", error);
      set({ authError: "Failed to verify session" });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, authError: null });
    try {
        const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("LOGIN RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data?.message || "Login failed");
    }

    const token = data?.payload?.token;
    const user = data?.payload?.user;

    if (!token || !user) {
      throw new Error("Invalid login response");
    }

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      user,
      isLoading: false,
      isCheckingAuth: false,
    });

    return { success: true };
    } catch (error: any) {
      const message = error.message || "Network error. Please try again.";
      set({ authError: message, isLoading: false });
      return { success: false, message };
    }finally {
      set({ isLoading: false });
    }
  },

  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true, authError: null });
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || "Registration failed";
        set({ authError: message, isLoading: false });
        return { success: false, message };
      }

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: data.user, isLoading: false });

      return { success: true, message: "User registered successfully" };
    } catch (error: any) {
      const message = error.message || "Network error. Please try again.";
      set({ authError: message, isLoading: false });
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ token: null, user: null, authError: null });
    }
  },
}));