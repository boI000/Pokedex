import styled from "styled-components";
import { Link } from "react-router-dom";

const CardLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const PokemonCardStyled = styled.article`
  position: relative;
  min-height: 330px;
  overflow: hidden;
  border: 2px solid var(--border-strong);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: 0 4px 0 var(--border-strong);
  transition: transform 200ms ease, box-shadow 200ms ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 8px;
    background: var(--primary);
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 0 var(--primary-dark);
  }

  img {
    display: block;
    width: 152px;
    height: 152px;
    margin: 22px auto 4px;
    image-rendering: pixelated;
    object-fit: contain;
  }
`;

const CardContent = styled.div`
  padding: 0 18px 20px;

  h2 {
    margin: 0 0 10px;
    font-size: 1.2rem;
    text-align: center;
    text-transform: capitalize;
  }
`;

const Types = styled.div`
  display: flex;
  min-height: 28px;
  justify-content: center;
  gap: 6px;
  margin-bottom: 16px;

  span {
    display: inline-flex;
    min-height: 28px;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-strong);
    border-radius: 999px;
    padding: 3px 9px;
    background: var(--screen);
    font-size: 0.76rem;
    font-weight: 800;
    line-height: 1;
    text-align: center;
    text-transform: uppercase;
  }
`;

const Metrics = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin: 0;
  text-align: center;

  div {
    padding: 8px 4px;
    border-radius: 5px;
    background: var(--surface-muted);
  }

  dt {
    color: var(--text-muted);
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  dd {
    margin: 2px 0 0;
    font-weight: 900;
  }
`;

const BattleRecord = styled.div`
  position: absolute;
  z-index: 1;
  top: 16px;
  right: 0;
  display: grid;
  min-width: 46px;
  gap: 1px;
  border: 2px solid var(--border-strong);
  border-right: 0;
  border-radius: 5px 0 0 5px;
  padding: 7px 8px;
  color: #fff;
  background: #26323a;
  font-size: 0.72rem;
  font-weight: 900;
  line-height: 1.15;
  text-align: left;

  span {
    display: grid;
    grid-template-columns: 18px 1fr;
    align-items: baseline;
  }

  strong {
    text-align: right;
  }
`;

const PokemonCard = ({ pokemon, showBattleRecord = false }) => {
  const {
    id,
    name,
    weight,
    height,
    base_experience,
    sprites,
    types,
    wins,
    losses,
  } = pokemon;

  return (
    <CardLink to={`/pokemon/${id}`}>
      <PokemonCardStyled>
        {showBattleRecord && (
          <BattleRecord aria-label={`${wins} wygranych, ${losses} przegranych`}>
            <span><b>W:</b><strong>{wins}</strong></span>
            <span><b>L:</b><strong>{losses}</strong></span>
          </BattleRecord>
        )}
        <img src={sprites.front_default} alt={name} />
        <CardContent>
          <h2>{name}</h2>
          <Types>
            {types.map((typeInfo) => (
              <span key={typeInfo.type.name}>{typeInfo.type.name}</span>
            ))}
          </Types>
          <Metrics>
            <div>
              <dt>Waga</dt>
              <dd>{weight / 10} kg</dd>
            </div>
            <div>
              <dt>Wzrost</dt>
              <dd>{height * 10} cm</dd>
            </div>
            <div>
              <dt>XP</dt>
              <dd>{base_experience}</dd>
            </div>
          </Metrics>
        </CardContent>
      </PokemonCardStyled>
    </CardLink>
  );
};

export default PokemonCard;
