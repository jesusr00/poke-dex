import { GoTop } from "@/components/go-top";
import { PokemonCard } from "@/components/pokemons/pokemon-card";
import { PokemonCardSkeleton } from "@/components/pokemons/pokemon-card-skeleton";
import { Screen } from "@/components/ui/screen";
import { usePokemonList } from "@/hooks/use-poke-api";
import { useEffect, useRef, useState } from "react";

import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
} from "react-native";
import uuid from "react-native-uuid";
export default function PokeList() {
  const { pokemonList, loading, loadingMore, hasMore, loadMore } =
    usePokemonList(100);
  const [showGoTop, setShowGoTop] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setRefreshing(false);
  };
  const flatListRef = useRef<FlatList | null>(null);

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

  const goToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <Screen>
      <FlatList
        ref={flatListRef}
        onScroll={handleScroll}
        data={pokemonList}
        keyExtractor={(item) => `${item.id.toString()}-card-${item.name}`}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        onEndReachedThreshold={2}
        onEndReached={handleEndReached}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          loadingMore || loading ? (
            <>
              {Array.from({ length: 25 }).map(() => (
                <PokemonCardSkeleton key={uuid.v4()} />
              ))}
            </>
          ) : null
        }
      />
      <GoTop visible={showGoTop} onPress={goToTop} />
    </Screen>
  );
}
