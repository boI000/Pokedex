import { useState } from "react";
import { Outlet } from "react-router-dom";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import Navbar from "./components/shared/Navbar";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  };

  const muiTheme = createTheme({
    palette: {
      mode: theme,
      primary: { main: "#d82935" },
      secondary: { main: "#f4c430" },
    },
    shape: { borderRadius: 6 },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <div className="app-shell" data-theme={theme}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
