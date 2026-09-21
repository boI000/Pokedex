import { Link, useParams } from "react-router-dom";
import { usePokemonContext } from "../../context/PokemonProvider";
import styled from "styled-components";
import { useAuthContext } from "../../context/AuthProvider";
import { useState } from "react";
import { useSnackbar } from "notistack";

// todo: $types list, styles
const TypeBadge = styled.span`
  color: ${({ $type }) => ($type === "grass" ? "green" : "white")};
`;

const TypesWrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
`;

const StatsRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const StatsWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: 300px;
`;

const AbilitiesWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const BackLink = styled(Link)`
  display: block;
  padding: 10px;
  border: 2px solid black;
  background-color: bisque;
  border-radius: 8px;
  margin: 20px auto;
  width: fit-content;
  text-decoration: none;
`;

const PokemonDetails = () => {
  const { currentUser, updateCurrentUser } = useAuthContext();
  const { id } = useParams();
  const { pokemons, isLoading, error } = usePokemonContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const foundPokemon = pokemons.find(
    (pokemon) => pokemon.id === parseInt(id, 10),
  );

  if (isLoading) return <p>Wczytywanie Pokemona...</p>;
  if (error) return <p>{error}</p>;
  if (!foundPokemon) return <p>Nie znaleziono Pokemona</p>;

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
          favourite.source === "api" && favourite.pokemonId === foundPokemon.id,
      )
    : false;

  const toggleFavourite = async () => {
    let newFavourites;

    if (isFavourite) {
      newFavourites = currentUser.favourites.filter(
        (favourite) =>
          !(
            favourite.source === "api" &&
            favourite.pokemonId === foundPokemon.id
          ),
      );
    } else {
      const newFavourite = {
        source: "api",
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
        enqueueSnackbar("Pokemon has been deleted from favourites", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar("Pokemon has been added to favourites!", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("An error has occurred. Try again!", {
        variant: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {currentUser && (
        <button type="button" onClick={toggleFavourite} disabled={isUpdating}>
          {isFavourite ? "Remove from favourites" : "Add to favourites"}
        </button>
      )}
      <img src={sprites.other["official-artwork"].front_default} alt={name} />
      <h1>{name.toUpperCase()}</h1>
      <h2>TYPES</h2>
      <TypesWrapper>
        {types.map((typeInfo) => {
          return (
            <TypeBadge $type={typeInfo.type.name} key={typeInfo.type.name}>
              {typeInfo.type.name.toUpperCase()}
            </TypeBadge>
          );
        })}
      </TypesWrapper>
      <h2>BASIC INFO</h2>
      <dl>
        <dt>Height</dt>
        <dd>{height * 10} cm </dd>

        <dt>Weight</dt>
        <dd>{weight / 10} kg</dd>

        <dt>Base experience</dt>
        <dd>{base_experience} xp</dd>
      </dl>
      <h2>STATS</h2>
      <StatsWrapper>
        {stats.map((statInfo) => {
          return (
            <StatsRow key={statInfo.stat.name}>
              <p>{statInfo.stat.name}</p>
              <p>{statInfo.base_stat}</p>
            </StatsRow>
          );
        })}
      </StatsWrapper>
      <h2>ABILITIES</h2>
      <AbilitiesWrapper>
        {abilities.map((abilityInfo) => {
          return (
            <p key={abilityInfo.ability.name}>{abilityInfo.ability.name}</p>
          );
        })}
      </AbilitiesWrapper>
      <BackLink to={"/pokedex"}>Return to POKEDEX</BackLink>
    </>
  );
};

export default PokemonDetails;
