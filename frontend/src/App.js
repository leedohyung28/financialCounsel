import "./App.css";
import AddressSearchPage from "./components/AddressSearchPage";
import AddressHomePage from "./components/AddressHomePage";
import React from "react";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [phase, setPhase] = React.useState("home");
  const [keyword, setKeyword] = React.useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/AddressSearchPage" element={<AddressSearchPage />} />
        <Route path="/AddressHomePage" element={<AddressHomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
