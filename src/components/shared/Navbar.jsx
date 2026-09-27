import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import styled from "styled-components";
import { useAuthContext } from "../../hooks/useAuthContext";
import pokemonLogo from "../../assets/pokemon_logo.png";

const Header = styled.header`
  border-bottom: 4px solid var(--primary-dark);
  background: var(--primary);
  box-shadow: 0 4px 0 rgba(23, 32, 51, 0.18);
`;

const NavBarWrapper = styled.nav`
  display: flex;
  width: min(1180px, calc(100% - 32px));
  min-height: 76px;
  align-items: center;
  gap: 20px;
  margin: 0 auto;

  @media (max-width: 900px) {
    width: calc(100% - 20px);
    min-height: 66px;
    gap: 8px;
  }
`;

const StyledImg = styled.img`
  display: block;
  width: 128px;
  height: auto;
`;

const DesktopLinks = styled.ul`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;

  a {
    display: block;
    border: 2px solid transparent;
    border-radius: 5px;
    padding: 8px 10px;
    color: #fff;
    font-size: 0.92rem;
    font-weight: 800;
    text-decoration: none;
  }

  a:hover,
  a.active {
    border-color: #172033;
    color: #172033;
    background: var(--accent);
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;

  .user-name {
    margin: 0;
    color: #fff;
    font-weight: 800;
  }

  @media (max-width: 900px) {
    .user-name {
      display: none;
    }
  }
`;

const MenuToggle = styled(IconButton)`
  && {
    display: none;
    color: #fff;
  }

  @media (max-width: 900px) {
    && {
      display: inline-flex;
    }
  }
`;

const ThemeToggle = styled(IconButton)`
  && {
    width: 38px;
    height: 38px;
    border: 2px solid #172033;
    border-radius: 6px;
    color: #172033;
    background: var(--accent);
  }
`;

const DesktopLogout = styled(Button)`
  @media (max-width: 900px) {
    && {
      display: none;
    }
  }
`;

const MobileMenuItem = styled(MenuItem)`
  && {
    color: var(--text);
    font-weight: 700;
  }

  &&.active,
  &&:hover {
    color: #172033;
    background: #f4c430;
  }
`;

const publicLinks = [{ path: "/", label: "Pokedex", end: true }];

const protectedLinks = [
  { path: "/edit", label: "Edycja" },
  { path: "/favourites", label: "Ulubione" },
  { path: "/arena", label: "Arena" },
  { path: "/ranking", label: "Ranking" },
];

const Navbar = ({ theme, toggleTheme }) => {
  const { currentUser, logout, isAuthLoading } = useAuthContext();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const links = currentUser
    ? [...publicLinks, ...protectedLinks]
    : publicLinks;

  const closeMenu = () => setMenuAnchor(null);

  return (
    <Header>
      <NavBarWrapper>
        <Link to="/" aria-label="Przejdź do Pokedexu">
          <StyledImg src={pokemonLogo} alt="Pokemon" />
        </Link>

        <DesktopLinks>
          {links.map(({ path, label, end }) => (
            <li key={path}>
              <NavLink to={path} end={end}>
                {label}
              </NavLink>
            </li>
          ))}
          {!currentUser && !isAuthLoading && (
            <>
              <li><NavLink to="/register">Rejestracja</NavLink></li>
              <li><NavLink to="/login">Logowanie</NavLink></li>
            </>
          )}
        </DesktopLinks>

        <Actions>
          {currentUser && <p className="user-name">{currentUser.name}</p>}
          {currentUser && (
            <DesktopLogout
              size="small"
              variant="contained"
              onClick={logout}
              sx={{
                minWidth: 0,
                border: "2px solid #172033",
                color: "#172033",
                backgroundColor: "var(--accent)",
                fontWeight: 800,
                textTransform: "none",
                "&:hover": { backgroundColor: "var(--accent)" },
              }}
            >
              Wyloguj
            </DesktopLogout>
          )}

          <MenuToggle
            aria-label="Otwórz menu"
            aria-controls={menuAnchor ? "mobile-navigation" : undefined}
            aria-expanded={menuAnchor ? "true" : undefined}
            onClick={(event) => setMenuAnchor(event.currentTarget)}
          >
            <MenuIcon />
          </MenuToggle>

          <Tooltip title={theme === "light" ? "Włącz tryb ciemny" : "Włącz tryb jasny"}>
            <ThemeToggle aria-label="Przełącz motyw" onClick={toggleTheme}>
              {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </ThemeToggle>
          </Tooltip>
        </Actions>

        <Menu
          id="mobile-navigation"
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
          MenuListProps={{ "aria-label": "Nawigacja mobilna" }}
        >
          {links.map(({ path, label }) => (
            <MobileMenuItem component={NavLink} to={path} onClick={closeMenu} key={path}>
              {label}
            </MobileMenuItem>
          ))}
          {!currentUser && !isAuthLoading && (
            <MobileMenuItem component={NavLink} to="/register" onClick={closeMenu}>
              Rejestracja
            </MobileMenuItem>
          )}
          {!currentUser && !isAuthLoading && (
            <MobileMenuItem component={NavLink} to="/login" onClick={closeMenu}>
              Logowanie
            </MobileMenuItem>
          )}
          {currentUser && (
            <MobileMenuItem
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Wyloguj
            </MobileMenuItem>
          )}
        </Menu>
      </NavBarWrapper>
    </Header>
  );
};

export default Navbar;
