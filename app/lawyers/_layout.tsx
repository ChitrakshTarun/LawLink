import { Stack } from "expo-router";
import { useRouter } from "expo-router";

export default function ChatLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Lawyers",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen name="response" />
    </Stack>
  );
}
