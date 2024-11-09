import { View, Text, Pressable } from "react-native";
import React from "react";
import { Href, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface ListHeaderProps {
  title: string;
  subtitle: string;
  pathname?: Href;
}

const ListHeader = ({ title, subtitle, pathname }: ListHeaderProps) => {
  const router = useRouter();
  const handlePress = () => {
    if (!pathname) return;
    return router.push(pathname);
  };
  return (
    <Pressable className="flex flex-row items-center" onPress={handlePress}>
      <View className="flex flex-1">
        <Text className="text-2xl font-bold">{title}</Text>
        <Text>{subtitle}</Text>
      </View>
      {pathname && <Ionicons name="chevron-forward" size={24} color={"black"} />}
    </Pressable>
  );
};

export default ListHeader;
