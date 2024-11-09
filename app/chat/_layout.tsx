import { Stack } from "expo-router";

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="new"
        options={{
          presentation: "modal",
          headerTitle: "New Chat",
        }}
      />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
