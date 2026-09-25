import { useState } from "react";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import { enqueueSnackbar } from "notistack";

const Arena = () => {
  const {
    pokemons,
    arenaPokemons,
    removeFromArena,
    clearArena,
    saveWinner,
    saveLoser,
  } = usePokemonContext();
  const [battleResult, setBattleResult] = useState(null);
  const [isSavingBattle, setIsSavingBattle] = useState(false);
  const arenaSlots = [0, 1];

  const handleFight = async () => {
    if (arenaPokemons.length !== 2 || isSavingBattle) {
      return;
    }
    const [firstPokemon, secondPokemon] = arenaPokemons;

    const currentFirstPokemon = pokemons.find((pokemon) => {
      return firstPokemon.id === pokemon.id;
    });

    const currentSecondPokemon = pokemons.find((pokemon) => {
      return secondPokemon.id === pokemon.id;
    });

    if (!currentFirstPokemon || !currentSecondPokemon) {
      return;
    }

    const firstPokemonPower =
      currentFirstPokemon.base_experience * currentFirstPokemon.weight;
    const secondPokemonPower =
      currentSecondPokemon.base_experience * currentSecondPokemon.weight;

    if (firstPokemonPower === secondPokemonPower) {
      setBattleResult({ type: "draw" });
      return;
    }

    let winnerId;
    let loserId;
    if (firstPokemonPower > secondPokemonPower) {
      winnerId = firstPokemon.id;
      loserId = secondPokemon.id;
    } else {
      winnerId = secondPokemon.id;
      loserId = firstPokemon.id;
    }

    setBattleResult(null);
    setIsSavingBattle(true);

    try {
      await saveWinner(winnerId);
      await saveLoser(loserId);
      setBattleResult({ type: "winner", winnerId });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Error has occured while saving fight results", {
        variant: "error",
      });
    } finally {
      setIsSavingBattle(false);
    }
  };

  const winnerPokemon =
    battleResult?.type === "winner"
      ? arenaPokemons.find((pokemon) => pokemon.id === battleResult.winnerId)
      : null;

  const loserPokemon =
    battleResult?.type === "winner" &&
    arenaPokemons.find((pokemon) => pokemon.id !== battleResult.winnerId);

  return (
    <>
      {arenaSlots.map((slotIndex) => {
        const pokemon = arenaPokemons[slotIndex];

        if (pokemon) {
          return (
            <div
              key={slotIndex}
              style={{ opacity: loserPokemon?.id === pokemon.id ? 0.4 : 1 }}
            >
              <p>{pokemon.name}</p>
              <button
                type="button"
                onClick={() => {
                  removeFromArena(pokemon.id);
                  setBattleResult(null);
                }}
                disabled={isSavingBattle}
              >
                Remove from arena
              </button>
            </div>
          );
        }

        return <div key={slotIndex}>Empty Slot</div>;
      })}
      <button
        type="button"
        disabled={arenaPokemons.length !== 2 || isSavingBattle}
        onClick={handleFight}
      >
        FIGHT!
      </button>
      <button
        type="button"
        onClick={() => {
          clearArena();
          setBattleResult(null);
        }}
        disabled={arenaPokemons.length < 1 || isSavingBattle}
      >
        Clear Arena
      </button>
      {battleResult?.type === "draw" && <p>DRAW!</p>}
      {winnerPokemon && <p>Winner: {winnerPokemon.name}</p>}
    </>
  );
};

export default Arena;
