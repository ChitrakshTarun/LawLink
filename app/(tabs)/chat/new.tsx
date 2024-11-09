import React, { useState } from "react";
import { View, ScrollView, Image, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { PromptInterface } from "@/interfaces/Prompt";
import InputField from "@/components/InputField";
import { useRouter } from "expo-router";

export default function NewChatPage() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [criminalHistory, setCriminalHistory] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string>("");

  const handleSubmit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const data: PromptInterface = {
      name: name,
      age: parseInt(age),
      email: email,
      criminalHistory: criminalHistory,
      description: description,
    };
    router.push({
      pathname: "/(tabs)/chat/[id]",
      params: {
        data: JSON.stringify(data),
      },
    });
  };

  return (
    <ScrollView keyboardDismissMode="on-drag" className="flex flex-1 p-4">
      <View className="flex flex-1 items-center">
        <Image source={require("@/assets/images/legalai-logo.png")} className="w-48 h-48" />
        <Text className="text-center text-xl font-bold pb-16">
          Enter relevant details regarding your query to ask LegalAI for relevant advice.
        </Text>
        <InputField value={name} onChangeText={setName} iconName="person" placeholder="Enter your name..." />
        <InputField
          value={age}
          onChangeText={setAge}
          iconName="calendar"
          placeholder="Enter your age..."
          keyboardType="numeric"
        />
        <InputField
          value={email}
          onChangeText={setEmail}
          iconName="mail"
          placeholder="Enter your email..."
          keyboardType="email-address"
        />
        <InputField
          value={criminalHistory}
          onChangeText={setCriminalHistory}
          iconName="mail"
          placeholder="Enter your criminal history (if any)..."
        />
        <InputField
          value={description}
          onChangeText={setDescription}
          iconName="briefcase"
          placeholder="Enter the case's description..."
        />
        <Pressable onPress={handleSubmit} className={`bg-blue-500 p-4 rounded-lg opacity-100`}>
          <Text className="text-white text-center">"Get Legal Advice"</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
