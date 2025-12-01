import { Pokemon, PokemonCard, PokemonListResponse } from "@/types/poke";
import axios from "axios";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

const API_BASE_URL = "https://pokeapi.co/api/v2";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const fetchPokemonListWithDetails = async (
  url: string
): Promise<PokemonCard[]> => {
  const listData: PokemonListResponse = await fetcher(url);

  const detailedPokemon = await Promise.all(
    listData.results.map(async (item) => {
      const pokemon: Pokemon = await fetcher(item.url);
      return {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.other["official-artwork"].front_default,
        types: pokemon.types.map((t) => t.type.name),
      };
    })
  );

  return detailedPokemon;
};

export function usePokeApi(pokemonNameOrId?: string | number) {
  const { data, error, isLoading } = useSWR<Pokemon>(
    pokemonNameOrId ? `${API_BASE_URL}/pokemon/${pokemonNameOrId}` : null,
    fetcher
  );

  return {
    pokemon: data ?? null,
    loading: isLoading,
    error: error ? "Pokemon not found" : null,
  };
}

export function usePokemonList(limit: number = 20, offset: number = 0) {
  const getKey = (
    pageIndex: number,
    previousPageData: PokemonCard[] | null
  ) => {
    if (previousPageData && previousPageData.length === 0) return null;

    const currentOffset = offset + pageIndex * limit;
    return `${API_BASE_URL}/pokemon?limit=${limit}&offset=${currentOffset}`;
  };

  const { data, error, size, setSize, isLoading, isValidating } =
    useSWRInfinite<PokemonCard[]>(getKey, fetchPokemonListWithDetails, {
      revalidateFirstPage: false,
    });

  const pokemonList = data ? data.flat() : [];
  const isLoadingMore = isValidating && size > 0;

  const hasMore = data && data[data.length - 1]?.length === limit;

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      setSize(size + 1);
    }
  };

  return {
    pokemonList,
    loading: isLoading,
    loadingMore: isLoadingMore,
    error: error ? "Failed to fetch pokemon list" : null,
    hasMore: hasMore ?? true,
    loadMore,
  };
}
