import { usePokemonContext } from "../../context/PokemonProvider";

const Arena = () => {
  const { arenaPokemons, removeFromArena, clearArena } = usePokemonContext();

  const arenaSlots = [0, 1];

  return (
    <>
      {arenaSlots.map((slotIndex) => {
        const pokemon = arenaPokemons[slotIndex];

        if (pokemon) {
          return (
            <div key={slotIndex}>
              <p>{pokemon.name}</p>
              <button type="button" onClick={() => removeFromArena(pokemon.id)}>
                Remove from arena
              </button>
            </div>
          );
        }

        return <div key={slotIndex}>Empty Slot</div>;
      })}
      <button type="button" disabled={arenaPokemons.length !== 2}>
        FIGHT!
      </button>
      <button
        type="button"
        onClick={clearArena}
        disabled={arenaPokemons.length < 1}
      >
        Clear Arena
      </button>
    </>
  );
};

export default Arena;
