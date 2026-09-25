import { Link } from "react-router-dom";
import { usePokemonContext } from "../../hooks/usePokemonContext";

const Edit = () => {
  const { pokemons, isLoading, error } = usePokemonContext();

  if (isLoading) return <p>Loading pokemons...</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <Link to="/edit/create">Create new Pokemon!</Link>
      <div>
        <ul>
          {pokemons.map((pokemon, index) => {
            return (
              <li key={pokemon.id}>
                {index + 1}
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                {pokemon.name.toUpperCase()}
                <Link to={`/edit/${pokemon.id}`}>Edit pokemon</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Edit;
