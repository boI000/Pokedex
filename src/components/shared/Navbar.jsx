import { NavLink } from "react-router-dom";

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
  { path: "/register", label: "Register" },
  { path: "/login", label: "Login" },
];

const Navbar = () => {
  return (
    <header>
      <nav>
        <ul>
          {navLinks.map(({ path, label, end }) => {
            return (
              <li key={path}>
                <NavLink to={path} end={end}>
                  {label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
