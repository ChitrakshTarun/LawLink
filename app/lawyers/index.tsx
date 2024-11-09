import { View } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import lawyers from "@/data/lawyers.json";
import LawyerCard from "@/components/LawyerCard";

const LawyerPage = () => {
  return (
    <View className="flex flex-1 m-4">
      <FlashList
        className="flex flex-1"
        ItemSeparatorComponent={() => <View className="px-2" />}
        data={lawyers}
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
        estimatedItemSize={10}
      />
    </View>
  );
};

export default LawyerPage;
