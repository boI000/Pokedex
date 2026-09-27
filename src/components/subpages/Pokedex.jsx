import { useState } from "react";
import styled from "styled-components";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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

const Controls = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  border: 2px solid var(--border-strong);
  border-radius: 8px;
  background: var(--screen);
  box-shadow: var(--shadow);

  input,
  select {
    min-height: 46px;
    border: 2px solid var(--border-strong);
    border-radius: 5px;
    padding: 9px 12px;
    color: var(--text);
    background: var(--surface-raised);
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 28px 0 0;

  p {
    min-width: 72px;
    margin: 0;
    font-weight: 900;
    text-align: center;
  }
`;

const PaginationButton = styled(IconButton)`
  && {
    width: 50px;
    height: 50px;
    border: 2px solid var(--border-strong);
    border-radius: 6px;
    color: #172033;
    background: var(--accent);
    font-size: 1.25rem;
    font-weight: 900;
    cursor: pointer;
    transition:
      transform 200ms ease,
      box-shadow 200ms ease;
  }

  &&:not(:disabled):hover {
    transform: translateX(
      ${({ $direction }) => ($direction === "prev" ? "-6px" : "6px")}
    );
    box-shadow: 0 5px 0 var(--accent-dark);
    background: var(--accent);
  }
`;

const Pokedex = () => {
  const { pokemons, isLoading, error } = usePokemonContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const pokemonTypes = [
    "",
    "bug",
    "dragon",
    "electric",
    "fairy",
    "fighting",
    "fire",
    "flying",
    "ghost",
    "grass",
    "ground",
    "ice",
    "normal",
    "poison",
    "psychic",
    "rock",
    "steel",
    "water",
  ];

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "" ||
      pokemon.types.some((typeInfo) => typeInfo.type.name === selectedType);

    return matchesSearch && matchesType;
  });

  const pokemonsPerPage = 15;
  const firstIndex = (currentPage - 1) * pokemonsPerPage;
  const lastIndex = currentPage * pokemonsPerPage;
  const paginatedPokemons = filteredPokemons.slice(firstIndex, lastIndex);
  const maxPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);

  if (isLoading) return <p className="state-message">Ładowanie Pokemonów...</p>;
  if (error) return <p className="state-message">Błąd: {error}</p>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pokedex</h1>
          <p className="page-subtitle">Odkrywaj i wybierz swoje Pokemony</p>
        </div>
        <strong>{filteredPokemons.length} wyników</strong>
      </div>
      <Controls>
        <input
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setCurrentPage(1);
          }}
          placeholder="Wyszukaj Pokemona"
          aria-label="Wyszukaj Pokemona"
        />
        <select
          value={selectedType}
          onChange={(event) => {
            setSelectedType(event.target.value);
            setCurrentPage(1);
          }}
          aria-label="Filtruj według typu"
        >
          {pokemonTypes.map((type) => (
            <option key={type} value={type}>
              {type === "" ? "Wszystkie typy" : type}
            </option>
          ))}
        </select>
      </Controls>
      {filteredPokemons.length === 0 ? (
        <p className="state-message">Nie znaleziono Pokemonów.</p>
      ) : (
        <>
          <PokemonGrid>
            {paginatedPokemons.map((pokemon) => (
              <PokemonCard pokemon={pokemon} key={pokemon.id} />
            ))}
          </PokemonGrid>
          <PaginationWrapper>
            <Tooltip title="Poprzednia strona">
              <span>
                <PaginationButton
                  $direction="prev"
                  aria-label="Poprzednia strona"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((previousPage) => previousPage - 1)
                  }
                >
                  <ArrowBackIcon />
                </PaginationButton>
              </span>
            </Tooltip>
            <p>
              {currentPage} / {maxPages}
            </p>
            <Tooltip title="Następna strona">
              <span>
                <PaginationButton
                  $direction="next"
                  aria-label="Następna strona"
                  disabled={currentPage >= maxPages}
                  onClick={() =>
                    setCurrentPage((previousPage) => previousPage + 1)
                  }
                >
                  <ArrowForwardIcon />
                </PaginationButton>
              </span>
            </Tooltip>
          </PaginationWrapper>
        </>
      )}
    </>
  );
};

export default Pokedex;
