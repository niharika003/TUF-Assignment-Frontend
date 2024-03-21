import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AllRoutes from "./routes";

function App() {
  return (
    <>
      <BrowserRouter>
        <AllRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
