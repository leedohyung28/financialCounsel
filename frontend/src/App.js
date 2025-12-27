import "./App.css";
import AddressSearchPage from "./components/AddressSearchPage";
import AddressHomePage from "./components/AddressHomePage";
import FindAccountPage from "./components/FindAccountPage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/AddressSearchPage" element={<AddressSearchPage />} />
        <Route path="/AddressHomePage" element={<AddressHomePage />} />
        <Route path="/FindAccountPage" element={<FindAccountPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
