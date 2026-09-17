import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";
import styled from "styled-components";
import pokemonLogo from "../../assets/pokemon_logo.png";

const StyledImg = styled.img`
  width: 100px;
  height: 50px;
`;

const NavBarWrapper = styled.nav`
  display: flex;
  justify-content: space-around;
`;

const StyledList = styled.ul`
  display: flex;
  list-style-type: none;
  gap: 10px;
  margin: 20px 0px 20px;
`;

const navLinks = [
  {
    path: "/",
    label: "Landing",
    end: true,
  },
  { path: "/pokedex", label: "Pokedex" },
  { path: "/add-pokemon", label: "Add Pokemon" },
  { path: "/favourites", label: "Favourites" },
  { path: "/arena", label: "Arena" },
  { path: "/ranking", label: "Ranking" },
];

const Navbar = () => {
  const { currentUser, logout, isAuthLoading } = useAuthContext();

  return (
    <header>
      <NavBarWrapper>
        <StyledImg src={pokemonLogo} alt="pokemon logo" />
        <StyledList>
          {navLinks.map(({ path, label, end }) => {
            return (
              <li key={path}>
                <NavLink to={path} end={end}>
                  {label}
                </NavLink>
              </li>
            );
          })}
          {!currentUser && !isAuthLoading && (
            <>
              <li>
                <NavLink to={"/register"}>Register</NavLink>
              </li>
              <li>
                <NavLink to={"/login"}>Log in</NavLink>
              </li>
            </>
          )}
        </StyledList>
        <div>
          {currentUser && (
            <>
              <p>{currentUser.name}</p>
              <button onClick={logout} type="button">
                Log out
              </button>
            </>
          )}
        </div>
      </NavBarWrapper>
    </header>
  );
};

export default Navbar;
