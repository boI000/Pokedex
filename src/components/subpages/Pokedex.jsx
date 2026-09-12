import { usePokemonContext } from "../../context/PokemonProvider";

const Pokedex = () => {
  const { pokemons, isLoading, error } = usePokemonContext();

  return (
    <>
      {isLoading && <p>Wczytywanie danych...</p>}
      {error && <p>{error}</p>}
      <ul>
        {pokemons.map(({ id, name, height, weight, base_experience }) => {
          return (
            <li key={id}>
              <p>{name.toUpperCase()}</p>
              <p>Weight: {weight}</p>
              <p>Height: {height}</p>
              <p>XP: {base_experience}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Pokedex;
