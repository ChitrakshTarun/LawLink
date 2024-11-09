import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";
import { useLegalAdvice } from "@/hooks/useLegalAdvice";
import { useLocalSearchParams } from "expo-router";

export default function NewChatPage() {
  const { id, data: rawData } = useLocalSearchParams<{ id: string; data: string }>();
  const data = JSON.parse(rawData);
  const { result, loading, getLegalAdvice, isConfigured } = useLegalAdvice();
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [criminalHistory, setCriminalHistory] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const handleSubmit = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      getLegalAdvice(data);
    };

    handleSubmit();
  }, []);

  return (
    <ScrollView keyboardDismissMode="on-drag" className="flex flex-1 p-4">
      <View className="flex flex-1 items-center">
        {!result && <ActivityIndicator size="large" color="#3B82F6" className="mt-5" />}
        {result && (
          <View className="mt-5 p-4 bg-gray-100 rounded-lg">
            <Text>{result}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
