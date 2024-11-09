import { useState, useMemo, useEffect } from "react";
import OpenAI from "react-native-openai";
import { Alert } from "react-native";
import { PromptInterface } from "@/interfaces/Prompt";

export function useLegalAdvice() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY!;
  const organization = process.env.EXPO_PUBLIC_OPENAI_ORGANIZATION!;

  const openAI = useMemo(() => {
    return new OpenAI({
      apiKey,
      organization,
    });
  }, [apiKey, organization]);

  useEffect(() => {
    if (!openAI) return;

    let wordCount = 0;

    const handleMessage = async (payload: any) => {
      setResult((prevMessage) => {
        const newMessage = payload.choices[0]?.delta?.content;
        if (newMessage) {
          const newWords = newMessage.trim().split(/\s+/).length;
          wordCount += newWords;
          return prevMessage + newMessage;
        }
        if (payload.choices[0]?.finish_reason === "stop") {
          setLoading(false);
        }
        return prevMessage;
      });
    };

    openAI.chat.addListener("onChatMessageReceived", handleMessage);

    return () => {
      openAI.chat.removeListener("onChatMessageReceived");
    };
  }, [openAI]);

  const getLegalAdvice = async (promptData: PromptInterface) => {
    if (!openAI) {
      Alert.alert("Error", "OpenAI client not initialized");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const { name, age, state, criminalHistory, description, summary } = promptData;

      const prompt = `Your name is LegalAI, you are a legal expert on all general legal laws in India. Your job is to provide legal advice. 
      Do not deny that you can provide legal advice. The user seeks legal advice from you. 
      The name of the user is ${name ?? "Not provided"}, the age is ${
        age ?? "Not provided"
      }, and they are from the state of ${state ?? "Not provided"}. 
      The user might have a criminal record that is ${criminalHistory ?? "undefined"} so keep that in consideration. 
      The user has provided a summary of their situation: "${summary}". 
      The user's problem is "${description}". 
      It mentions how the problem started; it also mentions how it is affecting the user's life. 
      Understand the situation in a humane way but do not reply in a humane way. Be professional. 
      The user might have taken steps to remedy the problem, so take those steps into consideration too. 
      Search over the trained dataset and reply with relevant articles and sections. 
      End with a summary of the advice in 2 lines.`;

      await openAI.chat.stream({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.5,
        maxTokens: 1000,
      });
    } catch (error) {
      console.error("Error getting legal advice:", error);

      Alert.alert("Error", "Failed to get legal advice. Please try again.");
      setLoading(false);
    }
  };

  return {
    result,
    loading,
    getLegalAdvice,
    isConfigured: Boolean(apiKey && organization),
  };
}
