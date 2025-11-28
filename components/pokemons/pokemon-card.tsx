import { Link } from "expo-router";
import { FC } from "react";
import { Image, Pressable, View } from "react-native";
import { PokemonCard as IPokemonCard } from "../../hooks/use-poke-api";
import { ThemedText } from "../themed-text";

type Props = {
  pokemon: IPokemonCard;
};

export const PokemonCard: FC<Props> = ({ pokemon }) => {
  return (
    <Link href={`/details/${pokemon.id}`} asChild>
      <Pressable className="active:opacity-70 transition-opacity">
        <View className="flex flex-row p-4 bg-slate-600 rounded-lg my-2 gap-4">
          <Image source={{ uri: pokemon.image }} className="size-16" />
          <View className="gap-1">
            <ThemedText className="text-lg capitalize">
              {pokemon.name}
            </ThemedText>
            <ThemedText>ID: {pokemon.id}</ThemedText>
            <ThemedText>Type: {pokemon.types.join(", ")}</ThemedText>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};
