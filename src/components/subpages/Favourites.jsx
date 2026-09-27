import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import PokemonCard from "./PokemonCard";

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 850px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
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

  if (isLoading) return <p className="state-message">Ładowanie Pokemonów...</p>;
  if (error) return <p className="state-message">Błąd: {error}</p>;
  if (favouritePokemons.length === 0)
    return (
      <p className="state-message">
        Nie masz jeszcze ulubionych Pokemonów.{" "}
        <Link to="/">Dodaj pierwszego!</Link>
      </p>
    );

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Ulubione</h1>
          <p className="page-subtitle">Twoja drużyna Pokemonów</p>
        </div>
      </div>
      <PokemonGrid>
        {favouritePokemons.map((pokemon) => (
          <PokemonCard pokemon={pokemon} showBattleRecord key={pokemon.id} />
        ))}
      </PokemonGrid>
    </>
  );
};

export default Favourites;
