import SafeScreen from "@/components/safe-screen/safeScreen";
import { useAuthStore } from "@/store/authStore";
import { Slot, Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {

 // const {checkAuth, user, token} = useAuthStore();

  // useEffect(()=>{
  //   checkAuth();
  // },[]);

  return (
    <SafeScreen>
      <Stack/>
    </SafeScreen>
  )
}
