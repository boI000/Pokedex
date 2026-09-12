import { Outlet } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
/*  */
