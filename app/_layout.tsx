import SafeScreen from "@/components/safe-screen/safeScreen";
import { useAuthStore } from "@/store/authStore";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

interface AuthStore {
  checkAuth: () => void;
  user: string;
  token: string;
}

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token }: AuthStore = useAuthStore() as AuthStore;

  useEffect(() => {
    checkAuth();
  }, []);

  //handle navigation based on the auth state
  useEffect(() => {
    const isAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !isAuthScreen) router.replace("/(auth)");
    else if (isSignedIn && isAuthScreen) router.replace("/(tab)");
  }, [user, token, segments]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tab)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
