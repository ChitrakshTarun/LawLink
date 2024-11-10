import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { LawyerInterface } from "@/interfaces/Lawyer";
import { router, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

const LawyerCard = ({ name, rating, practicingAreas }: LawyerInterface) => {
  const handlePress = () => {
    Haptics.selectionAsync();
    router.push({
      pathname: "/lawyers/[id]",
      params: {
        id: name,
      },
    });
  };
  return (
    <Pressable onPress={handlePress} className={`bg-white w-full rounded-xl p-6 m-2 self-center`}>
      {/* Header Section */}
      <View className="flex-row items-center space-x-4 gap-4">
        <View className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden">
          <Image
            source={require("@/assets/images/lawlink-logo.png")}
            className="w-full h-full"
            defaultSource={require("@/assets/images/lawlink-logo.png")}
          />
        </View>

        <View className="flex flex-1">
          <Text className="text-xl font-bold text-gray-900">{name}</Text>
          <Text className=" text-gray-600 mt-1">{rating} ★</Text>
        </View>
      </View>

      {/* Practice Areas */}
      <View className="mt-4">
        <Text className="font-medium text-gray-900 mb-2">Practice Areas</Text>
        <View className="flex-row flex-wrap gap-2">
          {practicingAreas.map((area, index) => (
            <View key={index} className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-gray-800 text-sm">{area}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

export default LawyerCard;
