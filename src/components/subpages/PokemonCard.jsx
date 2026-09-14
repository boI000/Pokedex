import styled from "styled-components";

const PokemonCardStyled = styled.article`
  border: 2px solid black;
  border-radius: 8px;
  background-color: burlywood;
`;

const PokemonCard = ({ pokemon }) => {
  const { id, name, weight, height, base_experience, sprites, types } = pokemon;

  return (
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
  );
};

export default PokemonCard;
