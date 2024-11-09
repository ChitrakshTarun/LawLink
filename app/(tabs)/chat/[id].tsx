import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from "react-native";
import axios from "axios";

// Define types for message handling
interface Message {
  role: "user" | "bot";
  content: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY; // Replace with your OpenAI API key

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newUserMessage: Message = { role: "user", content: inputText };
    setMessages([...messages, newUserMessage]);

    try {
      const prompt = `I am JusticeGPT! Thank you for reaching me out. Your input: ${inputText}`;

      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          prompt,
          model: "gpt-3.5-turbo-instruct",
          temperature: 0.5,
          max_tokens: 1000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const botReply = response.data.choices[0]?.text || "No response from API.";
      const newBotMessage: Message = { role: "bot", content: botReply };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    } catch (error) {
      Alert.alert("Error", `Failed to fetch response from OpenAI API. ${error}`);
    }

    setInputText("");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <Text key={index} style={message.role === "user" ? styles.userMessage : styles.botMessage}>
            {message.content}
          </Text>
        ))}
      </ScrollView>
      <TextInput style={styles.input} placeholder="Type your message" value={inputText} onChangeText={setInputText} />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  messagesContainer: { flex: 1, marginBottom: 10 },
  userMessage: { alignSelf: "flex-end", padding: 10, backgroundColor: "#d1f5d3", borderRadius: 10, margin: 5 },
  botMessage: { alignSelf: "flex-start", padding: 10, backgroundColor: "#f0f0f0", borderRadius: 10, margin: 5 },
  input: { padding: 10, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, marginBottom: 10 },
});

export default ChatPage;
