import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";
import { useLegalAdvice } from "@/hooks/useLegalAdvice";
import { PromptInterface } from "@/interfaces/Prompt";

export default function LegalAdvicePage() {
  const { result, loading, getLegalAdvice, isConfigured } = useLegalAdvice();

  const handleGetAdvice = async () => {
    // Button press haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const testData: PromptInterface = {
      name: "John Smith",
      age: 35,
      email: "john.smith@example.com",
      criminalHistory: undefined,
      description:
        "I recently started a small e-commerce business selling handmade crafts. " +
        "A customer paid for products worth ₹50,000 but is now demanding a refund " +
        "after 45 days, despite our 30-day return policy being clearly mentioned " +
        "on the website. They're threatening legal action.",
    };

    getLegalAdvice(testData);
  };

  if (!isConfigured) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-center text-gray-600">
          Please set up your OpenAI API key and organization in environment variables.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <TouchableOpacity
        onPress={handleGetAdvice}
        disabled={loading}
        className={`bg-blue-500 p-4 rounded-lg ${loading ? "opacity-70" : "opacity-100"}`}
      >
        <Text className="text-white text-center">{loading ? "Getting Advice..." : "Get Legal Advice"}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#3B82F6" className="mt-5" />}

      {result && (
        <View className="mt-5 p-4 bg-gray-100 rounded-lg">
          <Text className="text-base">{result}</Text>
        </View>
      )}
    </View>
  );
}
