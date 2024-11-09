import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/global.css";
import { Auth0Provider } from "@/providers/Auth0Provider";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <Auth0Provider>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </Auth0Provider>
  );
}
