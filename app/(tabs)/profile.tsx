import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Pressable } from "react-native";
import { useAuth } from "@/providers/Auth0Provider";
import InputField from "@/components/InputField";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "@/store";

const ProfilePage = () => {
  const { isAuthenticated, loading, login, logout, user, updateUser } = useAuth();

  const name = storage.getString("user.name");
  const age = storage.getString("user.age");
  const email = storage.getString("user.email");
  const state = storage.getString("user.state");
  const [pictureUrl, setPictureUrl] = useState(user?.picture || "");

  const handleSave = async () => {
    try {
      await updateUser({ name, picture: pictureUrl });
      alert("Profile updated successfully");
    } catch (e) {
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center p-5 bg-gray-100">
        <ActivityIndicator size="large" color="#0A84FF" />
        <Text className="mt-3 text-lg text-gray-600">Loading auth state...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-5">
      {isAuthenticated && user ? (
        <>
          <Tabs.Screen
            options={{
              headerRight: () => (
                <Pressable className="mr-4" onPress={logout}>
                  <Ionicons name="log-out-outline" size={24} color={"black"} />
                </Pressable>
              ),
            }}
          />
          <View className="items-center mb-6">
            <Image
              className="w-20 h-20 rounded-full mb-4"
              source={{ uri: pictureUrl }}
              defaultSource={require("@/assets/images/placeholder.png")}
            />
            <Text className="text-xl font-semibold text-gray-800">{name}</Text>
          </View>
          <View className="space-y-4">
            <InputField
              editable={false}
              iconName="person"
              subtitle="Username"
              placeholder="Set a username"
              value={name}
              onChangeText={() => {}}
            />
            <InputField
              editable={false}
              iconName="calendar"
              subtitle="Age"
              placeholder="Set your age"
              value={`${age} years`}
              onChangeText={() => {}}
            />
            <InputField
              editable={false}
              iconName="mail"
              subtitle="Email"
              placeholder="Set an email address"
              value={email}
              onChangeText={() => {}}
            />
            <InputField
              editable={false}
              iconName="location"
              subtitle="State"
              placeholder="Set your state"
              value={state}
              onChangeText={() => {}}
            />
          </View>
        </>
      ) : (
        <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg items-center mt-5" onPress={login}>
          <Text className="text-white text-lg font-semibold">Login with Auth0</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default ProfilePage;
