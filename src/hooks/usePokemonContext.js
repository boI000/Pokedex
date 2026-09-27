import { useContext } from "react";
import PokemonContext from "../context/PokemonContext";

export const usePokemonContext = () => {
  return useContext(PokemonContext);
};
