import { Stack } from "expo-router";

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="new"
        options={{
          headerTitle: "New Chat",
        }}
      />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
