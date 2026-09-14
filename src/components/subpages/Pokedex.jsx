import styled from "styled-components";
import { usePokemonContext } from "../../context/PokemonProvider";
import PokemonCard from "./PokemonCard";

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const Pokedex = () => {
  const { pokemons, isLoading, error } = usePokemonContext();

  return (
    <>
      {isLoading && <p>Wczytywanie danych...</p>}
      {error && <p>{error}</p>}
      <PokemonGrid>
        {pokemons.map((pokemon) => {
          return <PokemonCard pokemon={pokemon} key={pokemon.id} />;
        })}
      </PokemonGrid>
    </>
  );
};

export default Pokedex;
