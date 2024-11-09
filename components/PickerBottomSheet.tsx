import React, { forwardRef, useCallback, useRef } from "react";
import { View, Text } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetBackdropProps, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";

interface PickerBottomSheetProps {
  onBackdropPress: () => void;
  renderBackdrop: (props: BottomSheetBackdropProps) => React.ReactElement;
  onSheetChanges: (index: number) => void;
}

const PickerBottomSheet = () => {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={() => ref.current?.close()}
        opacity={0.5}
      />
    ),
    []
  );

  const ref = useRef<BottomSheet>(null);
  return (
    <BottomSheet
      ref={ref}
      handleComponent={null}
      index={1}
      enableContentPanningGesture={false}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView className="flex flex-1 px-4 bg-white dark:bg-[#1f2937] rounded-t-2xl">
        <Picker />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default PickerBottomSheet;
