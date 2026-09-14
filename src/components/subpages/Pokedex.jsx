import styled from "styled-components";
import { usePokemonContext } from "../../context/PokemonProvider";
import PokemonCard from "./PokemonCard";
import { useState } from "react";

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin: 20px 0px 20px;
  gap: 20px;
`;

const PaginationButton = styled.button`
  width: 50px;
  height: 50px;
  padding: 10px;
  color: darkblue;
  background-color: burlywood;
  border-radius: 8px;
  transition-duration: 250ms;
  &:not(:disabled):hover {
    transform: translateX(
      ${({ $direction }) => ($direction === "prev" ? "-10px" : "10px")}
    );
    box-shadow: 10px 10px 8px white;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Pokedex = () => {
  const { pokemons, isLoading, error } = usePokemonContext();
  const [currentPage, setCurrentPage] = useState(1);

  const pokemonsPerPage = 15;

  const firstIndex = (currentPage - 1) * pokemonsPerPage;
  const lastIndex = currentPage * pokemonsPerPage;

  const paginatedPokemons = pokemons.slice(firstIndex, lastIndex);

  const maxPages = Math.ceil(pokemons.length / pokemonsPerPage);

  if (isLoading) return <p>Wczytywanie danych...</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <PokemonGrid>
        {paginatedPokemons.map((pokemon) => {
          return <PokemonCard pokemon={pokemon} key={pokemon.id} />;
        })}
      </PokemonGrid>
      <PaginationWrapper>
        <PaginationButton
          $direction="prev"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          prev
        </PaginationButton>
        <p>
          {currentPage} / {maxPages}
        </p>
        <PaginationButton
          $direction="next"
          disabled={currentPage >= maxPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          next
        </PaginationButton>
      </PaginationWrapper>
    </>
  );
};

export default Pokedex;
