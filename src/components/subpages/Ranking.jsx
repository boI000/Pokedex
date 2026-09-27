import { useState } from "react";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import { Link } from "react-router-dom";

const Ranking = () => {
  const { pokemons, isLoading, error } = usePokemonContext();
  const [sortBy, setSortBy] = useState("wins");

  const sortedPokemons = [...pokemons].sort((a, b) => b[sortBy] - a[sortBy]);

  if (isLoading) return <p className="state-message">Ładowanie rankingu...</p>;
  if (error) return <p className="state-message">Błąd: {error}</p>;
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Ranking</h1>
          <p className="page-subtitle">Porównaj wyniki walk Pokemonów</p>
        </div>
        <div className="ranking-toolbar">
          <label htmlFor="sort-ranking">Sortuj:</label>
          <select
            className="control"
            id="sort-ranking"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="wins">Wygrane</option>
            <option value="base_experience">Doświadczenie</option>
            <option value="weight">Waga</option>
            <option value="height">Wzrost</option>
          </select>
        </div>
      </div>
      <ul className="ranking-list">
        {sortedPokemons.map(
          ({ id, name, base_experience, weight, height, wins }, index) => {
            return (
              <li className="ranking-row" key={id}>
                <span className="ranking-position">#{index + 1}</span>
                <Link to={`/pokemon/${id}`}>{name}</Link>
                <span>XP: {base_experience}</span>
                <span>Waga: {weight / 10} kg</span>
                <span>Wzrost: {height * 10} cm</span>
                <span>Wygrane: {wins}</span>
              </li>
            );
          },
        )}
      </ul>
    </>
  );
};

export default Ranking;
