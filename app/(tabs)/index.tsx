import { View, Text, ScrollView } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import LawyerCard from "@/components/LawyerCard";
import prompts from "@/data/sampleprompts.json";
import lawyers from "@/data/lawyers.json";
import { LawyerInterface } from "@/interfaces/Lawyer";
import ListHeader from "@/components/ListHeader";
import QueriesCard from "@/components/QueriesCard";

const getRandomLawyers = (data: LawyerInterface[], count: number = 3): LawyerInterface[] => {
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const HomePage = () => {
  const randomLawyers = getRandomLawyers(lawyers);

  return (
    <ScrollView className="flex flex-1 p-4">
      {/* PREVIOUS QUERIES */}
      <ListHeader title="Try LegalAI" subtitle="Use these prompts for inspiration" />
      <FlashList
        contentContainerClassName="pt-2"
        ItemSeparatorComponent={() => <View className="px-2" />}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={prompts}
        keyExtractor={(item) => item.summary}
        renderItem={({ item }) => <QueriesCard summary={item.summary} description={item.description} />}
        estimatedItemSize={3}
      />
      {/* LAWYER CONNECT */}

      <FlashList
        contentContainerClassName="pt-2"
        ListHeaderComponent={() => (
          <ListHeader
            title="Lawyer Connect"
            subtitle="Connect with the best lawyers to handle your case"
            pathname={"/lawyers"}
          />
        )}
        ItemSeparatorComponent={() => <View className="px-2" />}
        data={randomLawyers}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <LawyerCard
            name={item.name}
            imageUrl={item.imageUrl}
            specialization={item.specialization}
            experience={item.experience}
            rating={item.rating}
            email={item.email}
            phone={item.phone}
            location={item.location}
            firm={item.firm}
            education={item.education}
            practicingAreas={item.practicingAreas}
          />
        )}
        estimatedItemSize={3}
      />
    </ScrollView>
  );
};

export default HomePage;
