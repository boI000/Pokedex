import { useEffect, useState } from "react";
import PokemonContext from "./PokemonContext";

const POKE_API_URL = "https://pokeapi.co/api/v2";
const DB_URL = "http://localhost:3000";

const PokemonProvider = ({ children }) => {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [arenaPokemons, setArenaPokemons] = useState([]);

  useEffect(() => {
    async function fetchPokemons() {
      setIsLoading(true);

      try {
        const response = await fetch(`${POKE_API_URL}/pokemon?limit=150`);

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

        const overridesResponse = await fetch(`${DB_URL}/pokemonOverrides`);

        if (!overridesResponse.ok) {
          throw new Error(`Response: ${overridesResponse.status}`);
        }

        const overrides = await overridesResponse.json();

        const pokemonsWithOverride = pokemonsDetails.map((pokemon) => {
          const pokemonOverride = overrides.find(
            (override) => override.pokemonId === pokemon.id,
          );

          if (!pokemonOverride) {
            return { ...pokemon, wins: 0, losses: 0, overrideId: null };
          }

          const overrideId = pokemonOverride.id;
          const overrideData = { ...pokemonOverride };

          delete overrideData.id;
          delete overrideData.pokemonId;

          return {
            ...pokemon,
            wins: 0,
            losses: 0,
            ...overrideData,
            overrideId,
          };
        });

        const pokemonsWithOverrideFinal = pokemonsWithOverride.map(
          (pokemon) => {
            return { ...pokemon, source: "api" };
          },
        );

        const customResponse = await fetch(`${DB_URL}/customPokemons`);

        if (!customResponse.ok) {
          throw new Error(`Response: ${customResponse.status}`);
        }

        const customPokemons = await customResponse.json();

        const customPokemonsFinal = customPokemons.map((pokemon) => {
          return { ...pokemon, source: "custom" };
        });

        const finalPokemons = [
          ...pokemonsWithOverrideFinal,
          ...customPokemonsFinal,
        ];

        setPokemons(finalPokemons);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPokemons();
  }, []);

  const editPokemon = async (pokemonId, updates) => {
    const foundPokemon = pokemons.find((pokemon) => pokemonId === pokemon.id);

    if (!foundPokemon) {
      throw new Error("Pokemon not found");
    }

    const payload = { pokemonId: foundPokemon.id, ...updates };

    if (foundPokemon.source === "custom") {
      try {
        const upload = await fetch(
          `${DB_URL}/customPokemons/${foundPokemon.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          },
        );
        if (!upload.ok) {
          throw new Error(`Response: ${upload.status}`);
        }

        setPokemons((previousPokemons) =>
          previousPokemons.map((pokemon) => {
            return pokemon.id !== foundPokemon.id
              ? pokemon
              : { ...pokemon, ...updates };
          }),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
      return;
    }

    if (foundPokemon.overrideId === null) {
      try {
        const upload = await fetch(`${DB_URL}/pokemonOverrides`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!upload.ok) {
          throw new Error(`Response: ${upload.status}`);
        }
        const uploadResult = await upload.json();

        setPokemons((previousPokemons) =>
          previousPokemons.map((pokemon) => {
            return pokemon.id !== foundPokemon.id
              ? pokemon
              : { ...pokemon, ...updates, overrideId: uploadResult.id };
          }),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      try {
        const upload = await fetch(
          `${DB_URL}/pokemonOverrides/${foundPokemon.overrideId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          },
        );
        if (!upload.ok) {
          throw new Error(`Response: ${upload.status}`);
        }
        setPokemons((previousPokemons) =>
          previousPokemons.map((pokemon) => {
            return pokemon.id !== foundPokemon.id
              ? pokemon
              : { ...pokemon, ...updates };
          }),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  };

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

  const saveWinner = async (winnerId) => {
    const winner = pokemons.find((pokemon) => {
      return winnerId === pokemon.id;
    });

    if (!winner) {
      throw new Error(`Winner with ${winnerId} not found`);
    }

    const newWins = winner.wins + 1;
    const newXP = winner.base_experience + 10;

    const firstWin = {
      pokemonId: winner.id,
      wins: newWins,
      base_experience: newXP,
    };

    if (winner.source === "custom") {
      try {
        const upload = await fetch(`${DB_URL}/customPokemons/${winner.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wins: newWins, base_experience: newXP }),
        });
        if (!upload.ok) {
          throw new Error(`Response: ${upload.status}`);
        }
        setPokemons((previousPokemons) =>
          previousPokemons.map((pokemon) => {
            return pokemon.id !== winner.id
              ? pokemon
              : { ...pokemon, wins: newWins, base_experience: newXP };
          }),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
      return;
    }

    if (winner.overrideId === null) {
      try {
        const upload = await fetch(`${DB_URL}/pokemonOverrides`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(firstWin),
        });
        if (!upload.ok) {
          throw new Error(`Response: ${upload.status}`);
        }
        const uploadResult = await upload.json();

        setPokemons((previousPokemons) =>
          previousPokemons.map((pokemon) => {
            return pokemon.id !== winnerId
              ? pokemon
              : {
                  ...pokemon,
                  wins: newWins,
                  base_experience: newXP,
                  overrideId: uploadResult.id,
                };
          }),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      try {
        const reupload = await fetch(
          `${DB_URL}/pokemonOverrides/${winner.overrideId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wins: newWins, base_experience: newXP }),
          },
        );
        if (!reupload.ok) {
          throw new Error(`Response: ${reupload.status}`);
        }

        setPokemons((previousPokemons) =>
          previousPokemons.map((pokemon) => {
            return pokemon.id !== winnerId
              ? pokemon
              : { ...pokemon, wins: newWins, base_experience: newXP };
          }),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  };

  const saveLoser = async (loserId) => {
    const loser = pokemons.find((pokemon) => {
      return loserId === pokemon.id;
    });

    if (!loser) {
      throw new Error(`Loser with ${loserId} not found`);
    }

    const newLosses = loser.losses + 1;
    const firstLoss = {
      pokemonId: loser.id,
      losses: newLosses,
    };

    if (loser.source === "custom") {
      try {
        const upload = await fetch(`${DB_URL}/customPokemons/${loser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ losses: newLosses }),
        });
        if (!upload.ok) {
          throw new Error(`Response: ${upload.status}`);
        }
        setPokemons((previousPokemons) =>
          previousPokemons.map((pokemon) => {
            return pokemon.id !== loser.id
              ? pokemon
              : { ...pokemon, losses: newLosses };
          }),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
      return;
    }

    if (loser.overrideId === null) {
      try {
        const upload = await fetch(`${DB_URL}/pokemonOverrides`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(firstLoss),
        });
        if (!upload.ok) {
          throw new Error(`Response: ${upload.status}`);
        }
        const uploadResult = await upload.json();

        setPokemons((previousPokemons) =>
          previousPokemons.map((pokemon) => {
            return pokemon.id !== loserId
              ? pokemon
              : { ...pokemon, losses: newLosses, overrideId: uploadResult.id };
          }),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      try {
        const reupload = await fetch(
          `${DB_URL}/pokemonOverrides/${loser.overrideId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ losses: newLosses }),
          },
        );
        if (!reupload.ok) {
          throw new Error(`Response: ${reupload.status}`);
        }
        setPokemons((previousPokemons) =>
          previousPokemons.map((pokemon) => {
            return pokemon.id !== loserId
              ? pokemon
              : { ...pokemon, losses: newLosses };
          }),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  };

  const createPokemon = async (data, imageId) => {
    const isImageUsed = pokemons.some(
      (pokemon) => pokemon.source === "custom" && pokemon.imageId === imageId,
    );

    if (isImageUsed) {
      throw new Error(`Image ${imageId} is already used`);
    }

    const newPokemon = {
      id: imageId,
      imageId,
      source: "custom",
      name: data.name,
      weight: data.weight,
      height: data.height,
      base_experience: data.base_experience,
      wins: 0,
      losses: 0,
      sprites: {
        front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${imageId}.png`,
        other: {
          "official-artwork": {
            front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${imageId}.png`,
          },
        },
      },
      types: [],
      stats: [],
      abilities: [],
    };

    try {
      const upload = await fetch(`${DB_URL}/customPokemons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPokemon),
      });
      if (!upload.ok) {
        throw new Error(`Response: ${upload.status}`);
      }
      const uploadResult = await upload.json();

      setPokemons((previousPokemons) => [
        ...previousPokemons,
        { ...uploadResult, source: "custom" },
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const value = {
    pokemons,
    isLoading,
    error,
    arenaPokemons,
    addToArena,
    removeFromArena,
    clearArena,
    saveWinner,
    saveLoser,
    editPokemon,
    createPokemon,
  };

  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
};

export default PokemonProvider;
