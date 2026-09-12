import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./components/subpages/Landing.jsx";
import Pokedex from "./components/subpages/Pokedex.jsx";
import PokemonDetails from "./components/subpages/PokemonDetails.jsx";
import AddPokemon from "./components/subpages/AddPokemon.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Arena from "./components/subpages/Arena.jsx";
import Favourites from "./components/subpages/Favourites.jsx";
import Register from "./components/subpages/Register.jsx";
import Ranking from "./components/subpages/Ranking.jsx";
import Login from "./components/subpages/Login.jsx";
import PokemonProvider from "./context/PokemonProvider.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      {
        path: "pokedex",
        element: <Pokedex />,
      },
      {
        path: "pokedex/:id",
        element: <PokemonDetails />,
      },
      {
        path: "add-pokemon",
        element: <AddPokemon />,
      },
      {
        path: "arena",
        element: <Arena />,
      },
      {
        path: "favourites",
        element: <Favourites />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "ranking",
        element: <Ranking />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PokemonProvider>
      <RouterProvider router={router} />
    </PokemonProvider>
  </StrictMode>,
);
