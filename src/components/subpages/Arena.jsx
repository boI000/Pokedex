import { useState } from "react";
import { usePokemonContext } from "../../context/PokemonProvider";

const Arena = () => {
  const { arenaPokemons, removeFromArena, clearArena } = usePokemonContext();
  const [battleResult, setBattleResult] = useState(null);
  const arenaSlots = [0, 1];

  const handleFight = () => {
    if (arenaPokemons.length !== 2) {
      return;
    }
    const [firstPokemon, secondPokemon] = arenaPokemons;
    const firstPokemonPower =
      firstPokemon.base_experience * firstPokemon.weight;
    const secondPokemonPower =
      secondPokemon.base_experience * secondPokemon.weight;

    if (firstPokemonPower === secondPokemonPower) {
      setBattleResult({ type: "draw" });
      return;
    }
    if (firstPokemonPower > secondPokemonPower) {
      setBattleResult({ type: "winner", winnerId: firstPokemon.id });
    } else {
      setBattleResult({ type: "winner", winnerId: secondPokemon.id });
    }
  };

  const winnerPokemon =
    battleResult?.type === "winner"
      ? arenaPokemons.find((pokemon) => pokemon.id === battleResult.winnerId)
      : null;

  const looserPokemon =
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
              style={{ opacity: looserPokemon?.id === pokemon.id ? 0.4 : 1 }}
            >
              <p>{pokemon.name}</p>
              <button
                type="button"
                onClick={() => {
                  removeFromArena(pokemon.id);
                  setBattleResult(null);
                }}
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
        disabled={arenaPokemons.length !== 2}
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
        disabled={arenaPokemons.length < 1}
      >
        Clear Arena
      </button>
      {battleResult?.type === "draw" && <p>DRAW!</p>}
      {winnerPokemon && <p>Winner: {winnerPokemon.name}</p>}
    </>
  );
};

export default Arena;
