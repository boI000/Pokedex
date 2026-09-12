import { useEffect, useState, createContext, useContext } from "react";

const PokemonContext = createContext();

const PokemonProvider = ({ children }) => {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

        console.log(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPokemons();
  }, []);

  const value = { pokemons, isLoading, error };

  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
};

export const usePokemonContext = () => {
  return useContext(PokemonContext);
};

export default PokemonProvider;
