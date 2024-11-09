import { View, Text, Image, Pressable, Linking } from "react-native";
import React from "react";
import { Tabs, useLocalSearchParams } from "expo-router";
import lawyers from "@/data/lawyers.json";
import LawyerCard from "@/components/LawyerCard";
import { LawyerInterface } from "@/interfaces/Lawyer";
import InputField from "@/components/InputField";
import { Ionicons } from "@expo/vector-icons";

const LawyerInfoPage = () => {
  const { id: name } = useLocalSearchParams<{ id: string }>();
  const data: LawyerInterface | undefined = lawyers.find((lawyer) => lawyer.name === name);
  const { imageUrl, specialization, experience, rating, email, phone, location, firm, education, practicingAreas } =
    data!;
  return (
    <>
      <Tabs.Screen
        options={{
          headerTitle: name,
        }}
      />

      <View className="p-4">
        <View className="flex-row items-center space-x-4 gap-4">
          <View className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden">
            <Image
              source={require("@/assets/images/legalai-logo.png")}
              className="w-full h-full"
              defaultSource={require("@/assets/images/legalai-logo.png")}
            />
          </View>

          <View className="flex flex-1">
            <Text className="text-xl font-bold text-gray-900">{firm} Firm</Text>
            <Text className=" text-gray-600 mt-1">{experience} experience</Text>
            <Text className=" text-gray-600 mt-1">{rating} ★</Text>
          </View>
          <View className="flex flex-row gap-8">
            <Pressable onPress={() => Linking.openURL(`mailto:${email}`)}>
              <Ionicons name="mail" size={24} color={"black"} />
            </Pressable>
            <Pressable onPress={() => Linking.openURL(`tel:${phone}`)}>
              <Ionicons name="call" size={24} color={"black"} />
            </Pressable>
          </View>
        </View>
        <View className="mt-4 mb-12">
          <View className="flex-row flex-wrap gap-2">
            {practicingAreas.map((area, index) => (
              <View key={index} className="bg-gray-900 px-3 py-1 rounded-full">
                <Text className="text-gray-100 text-sm">{area}</Text>
              </View>
            ))}
          </View>
        </View>
        <InputField
          editable={false}
          subtitle="Education"
          iconName="school"
          value={education}
          onChangeText={() => {}}
          placeholder="Education"
        />
        <InputField
          editable={false}
          subtitle="Email"
          iconName="mail"
          value={email}
          onChangeText={() => {}}
          placeholder="Education"
        />
        <InputField
          editable={false}
          iconName="location"
          subtitle="Location"
          value={location}
          onChangeText={() => {}}
          placeholder="Education"
        />
      </View>
    </>
  );
};

export default LawyerInfoPage;
