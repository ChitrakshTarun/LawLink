import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";
import { useLegalAdvice } from "@/hooks/useLegalAdvice";
import { useLocalSearchParams } from "expo-router";
import Message from "@/components/MessageComponent";

export default function ResponsePage() {
  const { data: rawData } = useLocalSearchParams<{ id: string; data: string }>();
  const data = JSON.parse(rawData);
  const { result, getLegalAdvice } = useLegalAdvice();

  useEffect(() => {
    const handleSubmit = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      getLegalAdvice(data);
    };

    handleSubmit();
  }, []);

  return (
    <ScrollView keyboardDismissMode="on-drag" className="flex flex-1 p-4">
      <View className="flex flex-1 items-center gap-4">
        <Message isUser content={data.description} />
        <Message content={result ? result : "Thinking..."} />
      </View>
    </ScrollView>
  );
}
