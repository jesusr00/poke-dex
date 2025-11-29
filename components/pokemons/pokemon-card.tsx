import { Link } from "expo-router";
import { FC } from "react";
import { Image, Pressable, View } from "react-native";
import { PokemonCard as IPokemonCard } from "../../hooks/use-poke-api";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

type Props = {
  pokemon: IPokemonCard;
};

export const PokemonCard: FC<Props> = ({ pokemon }) => {
  return (
    <Link href={`/details/${pokemon.id}`} asChild>
      <Pressable className="active:opacity-70 transition-opacity">
        <Card className="my-2">
          <CardHeader className="flex-row gap-5">
            <Image source={{ uri: pokemon.image }} className="size-16" />
            <View className="flex-1 gap-1">
              <CardTitle className="capitalize text-lg">
                {pokemon.name}
              </CardTitle>
              <CardDescription>ID: {pokemon.id}</CardDescription>
            </View>
          </CardHeader>
        </Card>
      </Pressable>
    </Link>
  );
};
