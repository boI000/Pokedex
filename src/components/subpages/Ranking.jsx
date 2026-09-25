import { useState } from "react";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import { Link } from "react-router-dom";

const Ranking = () => {
  const { pokemons, isLoading, error } = usePokemonContext();
  const [sortBy, setSortBy] = useState("wins");

  const sortedPokemons = [...pokemons].sort((a, b) => b[sortBy] - a[sortBy]);

  if (isLoading) return <p>Loading pokemon ranking...</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="wins">Wins</option>
        <option value="base_experience">XP</option>
        <option value="weight">Weight</option>
        <option value="height">Height</option>
      </select>
      <ul>
        {sortedPokemons.map(
          ({ id, name, base_experience, weight, height, wins }) => {
            return (
              <li key={id}>
                <Link to={`/pokemon/${id}`}>
                  <p>{name}</p>
                </Link>
                {`XP: ${base_experience}, Weight: ${weight}, Height: ${height}, Wins: ${wins}`}
              </li>
            );
          },
        )}
      </ul>
    </>
  );
};

export default Ranking;
