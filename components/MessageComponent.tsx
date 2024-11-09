import React from "react";
import { View, Text } from "react-native";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";

interface MessageProps {
  isUser?: boolean;
  content: string;
}

const Message = ({ isUser, content }: MessageProps) => {
  return (
    <View className="flex flex-row w-full items-center gap-4">
      <View className="items-start h-full">
        {isUser ? (
          <Ionicons name={"person"} size={24} color={"black"} />
        ) : (
          <FontAwesome6 name={"gavel"} size={24} color={"black"} />
        )}
      </View>
      <Text className="flex pt-1 flex-1 text-md">{content}</Text>
    </View>
  );
};

export default Message;
