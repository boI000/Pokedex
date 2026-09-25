import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Pokedex from "./components/subpages/Pokedex.jsx";
import PokemonDetails from "./components/subpages/PokemonDetails.jsx";
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
import { SnackbarProvider } from "notistack";
import AuthProvider from "./context/AuthProvider.jsx";
import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";
import Edit from "./components/subpages/Edit.jsx";
import AddPokemon from "./components/subpages/AddPokemon.jsx";
import EditPokemon from "./components/subpages/EditPokemon.jsx";
import GuestRoute from "./components/shared/GuestRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Pokedex /> },
      {
        path: "pokemon/:id",
        element: <PokemonDetails />,
      },
      {
        element: <GuestRoute />,
        children: [
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "login",
            element: <Login />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "ranking",
            element: <Ranking />,
          },
          {
            path: "edit",
            element: <Edit />,
          },
          {
            path: "edit/create",
            element: <AddPokemon />,
          },
          {
            path: "edit/:id",
            element: <EditPokemon />,
          },
          {
            path: "arena",
            element: <Arena />,
          },
          {
            path: "favourites",
            element: <Favourites />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SnackbarProvider>
      <AuthProvider>
        <PokemonProvider>
          <RouterProvider router={router} />
        </PokemonProvider>
      </AuthProvider>
    </SnackbarProvider>
  </StrictMode>,
);
