import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { useAuth0, Auth0Provider } from "react-native-auth0";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <StatusBar barStyle={"dark-content"} />
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerTitle: "Index",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
