import { PokemonCard } from "@/components/pokemons/pokemon-card";
import { PokemonCardSkeleton } from "@/components/pokemons/pokemon-card-skeleton";
import { Screen } from "@/components/ui/screen";
import { usePokemonList } from "@/hooks/use-poke-api";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import uuid from "react-native-uuid";
export default function PokeList() {
  const { pokemonList, loading, loadingMore, hasMore, loadMore } =
    usePokemonList(100);
  const [showGoTop, setShowGoTop] = useState<boolean>(false);

  useEffect(() => {
    if (pokemonList && pokemonList.length > 0) {
      for (const poke of pokemonList.slice(0, 15)) {
        if (poke.image) {
          Image.prefetch(poke.image);
        }
      }
    }
  }, [pokemonList]);

  const handleEndReached = () => {
    if (!loadingMore && !loading && hasMore) {
      loadMore();
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.contentOffset.y > 40) {
      setShowGoTop(true);
    } else {
      setShowGoTop(false);
    }
  };

  return (
    <Screen>
      <FlatList
        onScroll={handleScroll}
        data={pokemonList}
        keyExtractor={(item) => `${item.id.toString()}-card-${item.name}`}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        onEndReachedThreshold={2}
        onEndReached={handleEndReached}
        ListFooterComponent={
          loading ? (
            <>
              {Array.from({ length: 25 }).map(() => (
                <PokemonCardSkeleton key={uuid.v4()} />
              ))}
            </>
          ) : null
        }
      />
    </Screen>
  );
}
