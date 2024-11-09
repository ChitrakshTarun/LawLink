import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "@/global.css";
import { Auth0Provider } from "@/providers/Auth0Provider";

export default function RootLayout() {
  return (
    <Auth0Provider>
      <GestureHandlerRootView>
        <StatusBar barStyle={"dark-content"} />
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="chat"
            options={{
              headerShown: false,
              animation: "slide_from_bottom",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name="lawyers"
            options={{
              headerShown: false,
              headerBackTitle: "Back",
              presentation: "modal",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GestureHandlerRootView>
    </Auth0Provider>
  );
}
