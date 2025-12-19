// app/_layout.tsx
import SafeScreen from "@/components/safe-screen/safeScreen";
import { useAuthStore } from "@/store/authStore";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot, useRouter } from "expo-router"; // remove useSegments
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const { checkAuth, user, token, isLoading }: any = useAuthStore();

  const [isReady, setIsReady] = useState(false);

  // Step 1: Check auth once on mount
  useEffect(() => {
    checkAuth().finally(() => {
      setIsReady(true); // Mark ready even if auth fails
    });
  }, [checkAuth]);

  // Step 2: Redirect based ONLY on auth state when ready
  useEffect(() => {
    if (!isReady || isLoading) return;

    const isSignedIn = !!user && !!token;

    if (isSignedIn) {
      router.replace("/(tab)/create"); // or "/(tab)" or "/(tab)/home"
    } else {
      router.replace("/(auth)/login");
    }
  }, [isReady, isLoading, user, token, router]);

  // Show loading until auth is fully checked
  if (isLoading ) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#4361EE" />
        </View>
      </SafeAreaProvider>
    );
  }

  // Now safe to render the actual app
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}