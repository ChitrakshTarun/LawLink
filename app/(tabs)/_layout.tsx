import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function TabLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#aaa",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "LegalAI",
          tabBarIcon: ({ color, size }) => <Ionicons name={"home-outline"} size={size * 1.2} color={color} />,
        }}
        listeners={{
          tabPress: () => {
            Haptics.selectionAsync();
          },
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          tabBarIcon: ({ size }) => <Ionicons name={"add-circle"} size={size} color={"black"} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Haptics.selectionAsync();
            router.push("/chat/new");
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name={"person-outline"} size={size * 1.2} color={color} />,
        }}
        listeners={{
          tabPress: () => {
            Haptics.selectionAsync();
          },
        }}
      />
    </Tabs>
  );
}
