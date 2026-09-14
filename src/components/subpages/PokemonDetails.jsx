import { useParams } from "react-router-dom";
import { usePokemonContext } from "../../context/PokemonProvider";
import PokemonCard from "./PokemonCard";

const PokemonDetails = () => {
  const { id } = useParams();
  const { pokemons, isLoading, error } = usePokemonContext();

  const foundPokemon = pokemons.find((pokemon) => pokemon.id === parseInt(id));

  if (isLoading) return <p>Wczytywanie Pokemona...</p>;
  if (error) return <p>{error}</p>;
  if (!foundPokemon) return <p>Nie znaleziono Pokemona</p>;

  return <PokemonCard pokemon={foundPokemon} />;
};

export default PokemonDetails;
