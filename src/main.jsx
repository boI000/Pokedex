import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./components/subpages/Landing.jsx";
import Pokedex from "./components/subpages/Pokedex.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

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
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
