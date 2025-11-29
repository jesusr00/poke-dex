import { PokemonSprites } from "@/components/pokemons/pokemin-sprites";
import { PokemonStatBar } from "@/components/pokemons/pokemon-stat-bar";
import { RemoteImage } from "@/components/pokemons/remote-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";
import { Text } from "@/components/ui/text";
import { usePokeApi } from "@/hooks/use-poke-api";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, View } from "react-native";

const typeColors: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const MAX_STAT = 255;

export default function PokemonDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { pokemon, loading } = usePokeApi(id.toString());

  const [description, setDescription] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchSpecies() {
      try {
        const speciesUrl = pokemon?.species?.url;
        if (!speciesUrl) return;
        const res = await fetch(speciesUrl);
        if (!res.ok) return;
        const data: any = await res.json();
        const entry = (data.flavor_text_entries || []).find(
          (e: any) => e.language?.name === "en"
        );
        if (mounted && entry?.flavor_text) {
          // clean newlines and weird chars
          const clean = String(entry.flavor_text)
            .replaceAll("\n", " ")
            .replaceAll("\f", " ");
          setDescription(clean);
        }
      } catch (err) {
        console.warn(err);
      }
    }

    fetchSpecies();
    return () => {
      mounted = false;
    };
  }, [pokemon]);

  if (loading) {
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4">Loading Pokémon...</Text>
      </Screen>
    );
  }

  if (!pokemon) {
    return (
      <Screen className="justify-center items-center">
        <Text>Pokemon not found</Text>
      </Screen>
    );
  }

  const primaryType = pokemon.types?.[0]?.type?.name ?? "normal";
  const bg = typeColors[primaryType] ?? "#111827";
  const screenWidth = Dimensions.get("window").width;

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: `${pokemon.name[0].toUpperCase()}${pokemon.name.slice(1)} #${pokemon.id}`,
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Card
          className="rounded-xl "
          style={{ backgroundColor: `${bg}32`, padding: 16 }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold capitalize">
                {pokemon.name}
              </Text>
              <Text className="text-sm opacity-80">ID: {pokemon.id}</Text>
              <View className="flex-row  flex-wrap mt-2 gap-1">
                {pokemon.types.map((t) => {
                  const typeName = t?.type?.name ?? String(t?.slot ?? "type");
                  return (
                    <Badge
                      key={typeName}
                      style={{
                        backgroundColor: typeColors[typeName] ?? "#374151",
                      }}
                    >
                      <Text className="capitalize text-center">{typeName}</Text>
                    </Badge>
                  );
                })}
              </View>
            </View>

            <RemoteImage
              uri={pokemon.sprites.other["official-artwork"].front_default}
              style={{
                width: Math.min(220, screenWidth * 0.45),
                height: Math.min(220, screenWidth * 0.45),
              }}
              resizeMode="contain"
            />
          </View>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent>
            {pokemon.stats.map((s) => (
              <PokemonStatBar stat={s} key={s.stat.name} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row justify-between mb-2">
              <Text>Height</Text>
              <Text>{(pokemon.height / 10).toFixed(2)} m</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text>Weight</Text>
              <Text>{(pokemon.weight / 10).toFixed(2)} kg</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text>Base Exp</Text>
              <Text>{pokemon.base_experience}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text>Moves</Text>
              <Text>{pokemon.moves?.length ?? 0}</Text>
            </View>
            {description ? (
              <View className="mt-3">
                <Text className="text-sm text-slate-200">{description}</Text>
              </View>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Abilities</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row flex-wrap gap-2">
            {pokemon.abilities.map((a) => (
              <Badge key={a.ability.name} variant={"secondary"}>
                <Text className="capitalize">
                  {a.ability.name}
                  {a.is_hidden ? " (hidden)" : ""}
                </Text>
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moves</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="w-full flex-row flex-wrap gap-2">
              {pokemon.moves.map((a) => (
                <Badge key={a.move.name} variant={"secondary"}>
                  <Text className="capitalize text-center">{a.move.name}</Text>
                </Badge>
              ))}
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sprites</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="pt-2"
            >
              <PokemonSprites sprites={pokemon.sprites} />
            </ScrollView>
          </CardContent>
        </Card>

        <Button onPress={() => router.back()}>
          <Text className="font-semibold">Go Back</Text>
        </Button>
      </ScrollView>
    </Screen>
  );
}
