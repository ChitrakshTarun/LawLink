import { View, Text, Pressable, Dimensions } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { PromptInterface } from "@/interfaces/Prompt";
import { useRouter } from "expo-router";

interface QueriesCard {
  summary: string;
  description: string;
}

const QueriesCard = ({ summary, description }: QueriesCard) => {
  const router = useRouter();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    const data: PromptInterface = {
      name: "John Smith",
      age: parseInt("35"),
      state: "Delhi",
      email: "john.smith@gmail.com",
      summary: summary,
      criminalHistory: undefined,
      description: description,
    };
    router.push({
      pathname: "/chat/response",
      params: {
        data: JSON.stringify(data),
      },
    });
  };

  const { width } = Dimensions.get("window");
  const cardWidth = width * 0.7; // 90% of screen width

  return (
    <Pressable onPress={handlePress} className="flex flex-row bg-white rounded-xl p-6" style={{ width: cardWidth }}>
      <View>
        <Text className="text-xl font-bold">{summary}</Text>
        <Text numberOfLines={1}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={"black"} />
    </Pressable>
  );
};

export default QueriesCard;
