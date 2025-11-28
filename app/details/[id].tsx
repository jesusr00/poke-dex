import { PokemonSprites } from "@/components/pokemons/pokemin-sprites";
import { RemoteImage } from "@/components/pokemons/remote-image";
import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { usePokeApi } from "@/hooks/use-poke-api";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

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
      <View className="flex-1 items-center justify-center bg-slate-900">
        <ActivityIndicator size="large" color="#3b82f6" />
        <ThemedText className="mt-4">Loading Pokémon...</ThemedText>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-900">
        <ThemedText>Pokemon not found</ThemedText>
      </View>
    );
  }

  const primaryType = pokemon.types?.[0]?.type?.name ?? "normal";
  const bg = typeColors[primaryType] ?? "#111827";
  const screenWidth = Dimensions.get("window").width;

  return (
    <Screen>
      <Stack.Screen options={{ title: `${pokemon.name} #${pokemon.id}` }} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View
          className="rounded-xl mb-4"
          style={{ backgroundColor: `${bg}32`, padding: 16 }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <ThemedText className="text-3xl font-bold text-white capitalize">
                {pokemon.name}
              </ThemedText>
              <ThemedText className="text-sm text-white/80">
                ID: {pokemon.id}
              </ThemedText>
              <View className="flex-row mt-2">
                {pokemon.types.map((t) => {
                  const typeName = t?.type?.name ?? String(t?.slot ?? "type");
                  return (
                    <View
                      key={typeName}
                      className="px-3 py-1 rounded-full mr-2 flex-row items-center justify-center"
                      style={{
                        backgroundColor: typeColors[typeName] ?? "#374151",
                      }}
                    >
                      <ThemedText className="text-white capitalize text-center">
                        {typeName}
                      </ThemedText>
                    </View>
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
        </View>

        <View className="bg-slate-800 rounded-lg p-4 mb-4">
          <ThemedText className="text-lg font-semibold mb-2">Stats</ThemedText>
          {pokemon.stats.map((s) => (
            <View key={s.stat.name} className="mb-2">
              <View className="flex-row justify-between">
                <ThemedText className="capitalize">{s.stat.name}</ThemedText>
                <ThemedText>{s.base_stat}</ThemedText>
              </View>
              <View
                style={styles.statTrack}
                className="mt-1 rounded-full bg-slate-700"
              >
                <View
                  style={{ width: `${(s.base_stat / MAX_STAT) * 100}%` }}
                  className="h-2 rounded-full bg-yellow-400"
                />
              </View>
            </View>
          ))}
        </View>

        <View className="bg-slate-800 rounded-lg p-4 mb-4">
          <ThemedText className="text-lg font-semibold mb-2">About</ThemedText>
          <View className="flex-row justify-between mb-2">
            <ThemedText>Height</ThemedText>
            <ThemedText>{(pokemon.height / 10).toFixed(1)} m</ThemedText>
          </View>
          <View className="flex-row justify-between mb-2">
            <ThemedText>Weight</ThemedText>
            <ThemedText>{(pokemon.weight / 10).toFixed(1)} kg</ThemedText>
          </View>
          <View className="flex-row justify-between mb-2">
            <ThemedText>Base Exp</ThemedText>
            <ThemedText>{pokemon.base_experience}</ThemedText>
          </View>
          <View className="flex-row justify-between">
            <ThemedText>Moves</ThemedText>
            <ThemedText>{pokemon.moves?.length ?? 0}</ThemedText>
          </View>
          {description ? (
            <View className="mt-3">
              <ThemedText className="text-sm text-slate-200">
                {description}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <View className="bg-slate-800 rounded-lg p-4 mb-4">
          <ThemedText className="text-lg font-semibold mb-2">
            Abilities
          </ThemedText>
          {pokemon.abilities.map((a) => (
            <ThemedText key={a.ability.name} className="capitalize mb-1">
              {a.ability.name}
              {a.is_hidden ? " (hidden)" : ""}
            </ThemedText>
          ))}
        </View>

        <View className="bg-slate-800 rounded-lg p-4 mb-6">
          <ThemedText className="text-lg font-semibold mb-2">
            Sprites
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pt-2"
          >
            <PokemonSprites sprites={pokemon.sprites} />
          </ScrollView>
        </View>

        <Pressable
          onPress={() => router.back()}
          className="items-center rounded-lg py-3 bg-slate-700"
        >
          <ThemedText className="font-semibold">Go Back</ThemedText>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statTrack: {
    height: 8,
    width: "100%",
    overflow: "hidden",
  },
});
