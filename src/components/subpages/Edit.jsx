import { Link } from "react-router-dom";
import { usePokemonContext } from "../../hooks/usePokemonContext";

const Edit = () => {
  const { pokemons, isLoading, error } = usePokemonContext();

  if (isLoading) return <p className="state-message">Ładowanie Pokemonów...</p>;
  if (error) return <p className="state-message">Błąd: {error}</p>;
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edycja Pokemonów</h1>
          <p className="page-subtitle">
            Zmień atrybuty lub stwórz własnego Pokemona
          </p>
        </div>
        <Link className="button-link" to="/edit/create">
          Stwórz Pokemona
        </Link>
      </div>
      <div className="panel">
        <ul className="edit-list">
          {pokemons.map((pokemon, index) => {
            return (
              <li className="edit-row" key={pokemon.id}>
                <strong>{index + 1}</strong>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                <span className="edit-name">{pokemon.name}</span>
                <Link className="button-link" to={`/edit/${pokemon.id}`}>
                  Edytuj
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Edit;
