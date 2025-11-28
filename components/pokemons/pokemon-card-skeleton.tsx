import { FC } from "react";
import { View } from "react-native";

export const PokemonCardSkeleton: FC = () => {
  return (
    <View className="flex flex-row p-4 bg-slate-600 rounded-lg my-2 gap-4 animate-pulse">
      <View className="size-16 bg-slate-500 rounded" />
      <View className="flex-1 gap-2 justify-center">
        <View className="h-6 bg-slate-500 rounded w-3/4" />
        <View className="h-4 bg-slate-500 rounded w-1/2" />
        <View className="h-4 bg-slate-500 rounded w-1/3" />
      </View>
    </View>
  );
};
