import { usePokemonContext } from "../../context/PokemonProvider";

const Pokedex = () => {
  const { pokemons, isLoading, error } = usePokemonContext();

  return (
    <>
      {isLoading && <p>Wczytywanie danych...</p>}
      {error && <p>{error}</p>}
      <ul>
        {pokemons.map(({ name, url }) => {
          return <li key={name}>{name}</li>;
        })}
      </ul>
    </>
  );
};

export default Pokedex;
