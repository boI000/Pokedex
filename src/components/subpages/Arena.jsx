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
      enqueueSnackbar("Nie udało się zapisać wyniku walki", {
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
      <div className="page-header">
        <div>
          <h1 className="page-title">Arena</h1>
          <p className="page-subtitle">Wybierz dwa Pokemony i walcz</p>
        </div>
      </div>
      <div className="arena-grid">
        {arenaSlots.map((slotIndex) => {
          const pokemon = arenaPokemons[slotIndex];

          if (pokemon) {
            return (
              <div
                className="arena-slot"
                key={slotIndex}
                style={{ opacity: loserPokemon?.id === pokemon.id ? 0.4 : 1 }}
              >
                <div>
                  <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                  <h2>{pokemon.name}</h2>
                  <button
                    className="danger-button"
                    type="button"
                    onClick={() => {
                      removeFromArena(pokemon.id);
                      setBattleResult(null);
                    }}
                    disabled={isSavingBattle}
                  >
                    Usuń z areny
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div className="arena-slot arena-empty" key={slotIndex}>
              Wolne miejsce
            </div>
          );
        })}
      </div>
      <div className="arena-actions">
        <button
          className="primary-button"
          type="button"
          disabled={arenaPokemons.length !== 2 || isSavingBattle}
          onClick={handleFight}
        >
          {isSavingBattle ? "Zapisywanie..." : "WALCZ!"}
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            clearArena();
            setBattleResult(null);
          }}
          disabled={arenaPokemons.length < 1 || isSavingBattle}
        >
          Wyczyść arenę
        </button>
      </div>
      {battleResult?.type === "draw" && <p className="battle-result">REMIS!</p>}
      {winnerPokemon && (
        <p className="battle-result">Zwycięzca: {winnerPokemon.name}</p>
      )}
    </>
  );
};

export default Arena;
