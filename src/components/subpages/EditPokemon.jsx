import { useParams } from "react-router-dom";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import EditPokemonForm from "./EditPokemonForm";

const EditPokemon = () => {
  const { id } = useParams();
  const { pokemons, isLoading, error } = usePokemonContext();

  const foundPokemon = pokemons.find(
    (pokemon) => pokemon.id === parseInt(id, 10),
  );

  if (isLoading) return <p>Wczytywanie Pokemona...</p>;
  if (error) return <p>{error}</p>;
  if (!foundPokemon) return <p>Nie znaleziono Pokemona</p>;

  return <EditPokemonForm pokemon={foundPokemon} />;
};

export default EditPokemon;
