import styled from "styled-components";
import { useAuthContext } from "../../hooks/useAuthContext";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import PokemonCard from "./PokemonCard";
import { Link } from "react-router-dom";

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const Favourites = () => {
  const { currentUser } = useAuthContext();
  const { pokemons, isLoading, error } = usePokemonContext();

  const favouritePokemons = pokemons.filter((pokemon) =>
    currentUser.favourites.some(
      (favourite) =>
        favourite.source === pokemon.source &&
        favourite.pokemonId === pokemon.id,
    ),
  );

  if (isLoading) return <p>Loading pokemons...</p>;
  if (error) return <p>{error}</p>;
  if (favouritePokemons.length === 0)
    return (
      <p>
        You have no favourite pokemons. <Link to="/">Add them here!</Link>
      </p>
    );
  return (
    <PokemonGrid>
      {favouritePokemons.map((pokemon) => {
        return <PokemonCard pokemon={pokemon} key={pokemon.id} />;
      })}
    </PokemonGrid>
  );
};

export default Favourites;
