import "./App.css";
import AddressSearchPage from "./components/AddressSearchPage";
import AddressHomePage from "./components/AddressHomePage";
import React from "react";

function App() {
  const [phase, setPhase] = React.useState("home");
  const [keyword, setKeyword] = React.useState("");

  return phase === "home" ? (
    <AddressHomePage
      onSearchClick={(kw) => {
        setKeyword(kw);
        setPhase("search");
      }}
      onMapClick={() => {
        // 지도 모드로 전환 시 처리
        setPhase("search");
      }}
    />
  ) : (
    <AddressSearchPage initialKeyword={keyword} />
  );
}

export default App;
