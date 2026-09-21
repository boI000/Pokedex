import { useEffect, useState, createContext, useContext } from "react";

const PokemonContext = createContext();

const PokemonProvider = ({ children }) => {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [arenaPokemons, setArenaPokemons] = useState([]);

  useEffect(() => {
    async function fetchPokemons() {
      const BASE_URL = "https://pokeapi.co/api/v2";
      setIsLoading(true);

      try {
        const response = await fetch(`${BASE_URL}/pokemon?limit=150`);

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        const pokemonsDetails = await Promise.all(
          result.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);

            if (!response.ok) {
              throw new Error(`Response status: ${response.status}`);
            }

            const data = await response.json();
            return data;
          }),
        );

        setPokemons(pokemonsDetails);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPokemons();
  }, []);

  const addToArena = (pokemon) => {
    setArenaPokemons((previousArena) => {
      const isAlreadyInArena = previousArena.some(
        (arenaPokemon) => arenaPokemon.id === pokemon.id,
      );

      if (previousArena.length === 2) return previousArena;
      if (isAlreadyInArena) return previousArena;
      return [...previousArena, pokemon];
    });
  };

  const removeFromArena = (pokemonId) => {
    setArenaPokemons((previousArena) => {
      return previousArena.filter(
        (arenaPokemon) => arenaPokemon.id !== pokemonId,
      );
    });
  };

  const clearArena = () => {
    setArenaPokemons([]);
  };

  const value = {
    pokemons,
    isLoading,
    error,
    arenaPokemons,
    addToArena,
    removeFromArena,
    clearArena,
  };

  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
};

export const usePokemonContext = () => {
  return useContext(PokemonContext);
};

export default PokemonProvider;
