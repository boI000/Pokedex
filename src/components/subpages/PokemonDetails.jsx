import { Link, useParams } from "react-router-dom";
import { usePokemonContext } from "../../hooks/usePokemonContext";
import styled from "styled-components";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useState } from "react";
import { useSnackbar } from "notistack";

const TypeBadge = styled.span`
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  padding: 5px 12px;
  color: #fff;
  background: ${({ $type }) =>
    ({
      bug: "#729f3f",
      dragon: "#5b4ecb",
      electric: "#c49a08",
      fairy: "#c85ca4",
      fighting: "#a7482d",
      fire: "#d95c2b",
      flying: "#6279b8",
      ghost: "#625a9c",
      grass: "#4f9141",
      ground: "#9b753b",
      ice: "#398da4",
      normal: "#737b80",
      poison: "#84469a",
      psychic: "#bd4169",
      rock: "#8b7b3f",
      steel: "#607987",
      water: "#3379b7",
    })[$type] || "#53636e"};
  font-size: 0.8rem;
  font-weight: 900;
`;

const TypesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`;

const StatsRow = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 7px 0;

  p {
    margin: 0;
    text-transform: capitalize;
  }

  strong {
    min-width: 36px;
    text-align: right;
  }
`;

const StatsWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: 300px;
  padding: 12px;
  border-radius: 6px;
  background: var(--surface-muted);
`;

const AbilitiesWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;

  p {
    margin: 0;
    padding: 8px 12px;
    border-radius: 5px;
    background: var(--surface-muted);
    font-weight: 800;
  }
`;

const BackLink = styled(Link)`
  display: block;
  padding: 10px;
  border: 2px solid var(--border-strong);
  color: #fff;
  background: var(--primary);
  border-radius: 8px;
  margin: 20px auto;
  width: fit-content;
  text-decoration: none;
  box-shadow: 0 4px 0 var(--primary-dark);
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 var(--primary-dark);
  }
`;

const PokemonDetails = () => {
  const { id } = useParams();
  const { currentUser, updateCurrentUser } = useAuthContext();
  const { pokemons, isLoading, error, addToArena } = usePokemonContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const foundPokemon = pokemons.find(
    (pokemon) => pokemon.id === parseInt(id, 10),
  );

  if (isLoading) return <p className="state-message">Ładowanie Pokemona...</p>;
  if (error) return <p className="state-message">Błąd: {error}</p>;
  if (!foundPokemon) return <p className="state-message">Nie znaleziono Pokemona.</p>;

  const {
    name,
    sprites,
    stats,
    types,
    weight,
    height,
    base_experience,
    abilities,
  } = foundPokemon;

  const isFavourite = currentUser
    ? currentUser.favourites.some(
        (favourite) =>
          favourite.source === foundPokemon.source &&
          favourite.pokemonId === foundPokemon.id,
      )
    : false;

  const toggleFavourite = async () => {
    let newFavourites;

    if (isFavourite) {
      newFavourites = currentUser.favourites.filter(
        (favourite) =>
          !(
            favourite.source === foundPokemon.source &&
            favourite.pokemonId === foundPokemon.id
          ),
      );
    } else {
      const newFavourite = {
        source: foundPokemon.source,
        pokemonId: foundPokemon.id,
      };
      newFavourites = [...currentUser.favourites, newFavourite];
    }

    const BASE_URL = "http://localhost:3000";
    setIsUpdating(true);

    try {
      const response = await fetch(`${BASE_URL}/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favourites: newFavourites }),
      });
      if (!response.ok) {
        throw new Error(`Response: ${response.status}`);
      }
      updateCurrentUser({ favourites: newFavourites });

      if (isFavourite) {
        enqueueSnackbar("Pokemon został usunięty z ulubionych", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar("Pokemon został dodany do ulubionych", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Wystąpił błąd. Spróbuj ponownie.", {
        variant: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="details-shell">
      <div className="details-top">
        <div className="details-artwork">
          <img src={sprites.other["official-artwork"].front_default} alt={name} />
        </div>
        <div className="details-info">
          <p className="page-subtitle">Pokemon #{foundPokemon.id}</p>
          <h1>{name}</h1>
          <TypesWrapper>
            {types.map((typeInfo) => (
              <TypeBadge $type={typeInfo.type.name} key={typeInfo.type.name}>
                {typeInfo.type.name.toUpperCase()}
              </TypeBadge>
            ))}
          </TypesWrapper>
          <div className="details-actions">
            {currentUser && (
              <button className="secondary-button" type="button" onClick={toggleFavourite} disabled={isUpdating}>
                {isFavourite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
              </button>
            )}
            {currentUser && (
              <button className="primary-button" type="button" onClick={() => addToArena(foundPokemon)}>
                Dodaj na arenę
              </button>
            )}
          </div>
          <dl className="basic-info">
            <div><dt>Wzrost</dt><dd>{height * 10} cm</dd></div>
            <div><dt>Waga</dt><dd>{weight / 10} kg</dd></div>
            <div><dt>Doświadczenie</dt><dd>{base_experience} XP</dd></div>
          </dl>
        </div>
      </div>
      <div className="details-lower">
        <section className="details-section">
          <h2>Statystyki</h2>
          <StatsWrapper>
            {stats.map((statInfo) => (
              <StatsRow key={statInfo.stat.name}>
                <p>{statInfo.stat.name}</p>
                <strong>{statInfo.base_stat}</strong>
              </StatsRow>
            ))}
          </StatsWrapper>
        </section>
        <section className="details-section">
          <h2>Umiejętności</h2>
          <AbilitiesWrapper>
            {abilities.map((abilityInfo) => (
              <p key={abilityInfo.ability.name}>{abilityInfo.ability.name}</p>
            ))}
          </AbilitiesWrapper>
        </section>
      </div>
      <BackLink to={"/"}>Wróć do Pokedexu</BackLink>
    </div>
  );
};

export default PokemonDetails;
