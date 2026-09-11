import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav>
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/pokedex"}>Pokedex</NavLink>
      </nav>
    </>
  );
};

export default Navbar;
