import { Text } from "@/components/ui/text";
import { Stat } from "@/hooks/use-poke-api";
import { FC, useEffect, useState } from "react";
import { View } from "react-native";
import { Progress } from "../ui/progress";

const MAX_STAT = 255;

type Props = {
  stat: Stat;
};

export const PokemonStatBar: FC<Props> = ({ stat }) => {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      setValue(stat.base_stat);
    }, 300);
  }, [stat]);

  return (
    <View className="mb-2">
      <View className="flex-row justify-between">
        <Text className="capitalize">{stat.stat.name}</Text>
        <Text>{stat.base_stat}</Text>
      </View>
      <Progress max={MAX_STAT} value={value} />
    </View>
  );
};
