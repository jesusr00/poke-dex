import { useEffect, useState } from "react";

interface Pokemon {
  id: number;
  name: string;
  sprites: Sprite;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
  }[];
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  species: {
    name: string;
    url: string;
  };
  base_experience: number;
  order: number;
}

export interface Sprite {
  back_default: string;
  back_female: string | null;
  back_shiny: string;
  back_shiny_female: string | null;
  front_default: string;
  front_female: string | null;
  front_shiny: string;
  front_shiny_female: string | null;
  other: {
    dream_world: {
      front_default: string;
      front_female: string | null;
    };
    home: {
      front_default: string;
      front_female: string | null;
      front_shiny: string;
      front_shiny_female: string | null;
    };
    "official-artwork": {
      front_default: string;
      front_shiny: string;
    };
    showdown: {
      back_default: string;
      back_female: string | null;
      back_shiny: string;
      back_shiny_female: string | null;
      front_default: string;
      front_female: string | null;
      front_shiny: string;
      front_shiny_female: string | null;
    };
  };
}

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonCard {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export function usePokeApi(pokemonNameOrId?: string | number) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemonNameOrId) return;

    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`
        );
        if (!response.ok) {
          throw new Error("Pokemon not found");
        }
        const data = await response.json();
        setPokemon(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonNameOrId]);

  return { pokemon, loading, error };
}

export function usePokemonList(limit: number = 20, offset: number = 0) {
  const [pokemonList, setPokemonList] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(false); // initial load
  const [loadingMore, setLoadingMore] = useState(false); // pagination load
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState<number>(offset);

  // fetch a page; if append=true, append to existing list, otherwise replace
  async function fetchPage(pageOffset: number, append = false) {
    // set appropriate loading flag
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${pageOffset}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch pokemon list");
      }
      const data: PokemonListResponse = await response.json();

      // Fetch detailed info for each pokemon
      const detailedPokemon = await Promise.all(
        data.results.map(async (item) => {
          const pokemonResponse = await fetch(item.url);
          const pokemon: Pokemon = await pokemonResponse.json();
          return {
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.other["official-artwork"].front_default,
            types: pokemon.types.map((t) => t.type.name),
          };
        })
      );

      setPokemonList((prev) =>
        append ? [...prev, ...detailedPokemon] : detailedPokemon
      );
      setHasMore(data.next !== null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }

  // initial load (or when limit changes)
  useEffect(() => {
    setCurrentOffset(offset);
    fetchPage(offset, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, offset]);

  const loadMore = async () => {
    if (loadingMore || loading || !hasMore) return;
    const next = currentOffset + limit;
    await fetchPage(next, true);
    setCurrentOffset(next);
  };

  return { pokemonList, loading, loadingMore, error, hasMore, loadMore };
}
