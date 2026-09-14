import styled from "styled-components";
import { Link } from "react-router-dom";

const PokemonCardStyled = styled.article`
  border: 2px solid black;
  border-radius: 8px;
  background-color: burlywood;
  transition-duration: 250ms;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 10px 10px 8px white;
  }
`;

const PokemonCard = ({ pokemon }) => {
  const { id, name, weight, height, base_experience, sprites, types } = pokemon;

  return (
    <Link to={`/pokedex/${id}`}>
      <PokemonCardStyled>
        <img src={sprites.front_default} alt={name} />
        <p>{name.toUpperCase()}</p>
        {types.map((typeInfo) => {
          return <p key={typeInfo.type.name}>{typeInfo.type.name}</p>;
        })}
        <p>Weight: {weight}</p>
        <p>Height: {height}</p>
        <p>XP: {base_experience}</p>
      </PokemonCardStyled>
    </Link>
  );
};

export default PokemonCard;
