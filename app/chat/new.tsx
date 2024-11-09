import React, { useState } from "react";
import { View, ScrollView, Image, Text, Pressable, KeyboardAvoidingView } from "react-native";
import * as Haptics from "expo-haptics";
import { PromptInterface } from "@/interfaces/Prompt";
import InputField from "@/components/InputField";
import { useRouter } from "expo-router";

export default function NewChatPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = async () => {
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

  return (
    <ScrollView keyboardDismissMode="on-drag" className="flex flex-1 p-4">
      <KeyboardAvoidingView behavior="height">
        <View className="flex flex-1 items-center">
          <Image source={require("@/assets/images/legalai-logo.png")} className="w-36 h-36" />
          <Text className="text-center text-lg font-bold pb-4">
            Describe your query to have LegalAI help resolve your legal query.
          </Text>
          <View className="flex flex-1 w-full pt-8 pb-2">
            <InputField
              subtitle="Summary"
              value={summary}
              onChangeText={setSummary}
              placeholder="Keep it apt and a one-liner"
            />
            <InputField
              subtitle="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="List all important info in detail."
            />
          </View>
          <Pressable onPress={handleSubmit} className={`bg-blue-500 p-4 rounded-lg opacity-100`}>
            <Text className="text-white text-center">Get Legal Advice</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
