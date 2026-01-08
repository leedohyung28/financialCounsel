import React, { useState } from "react";
import "../styles/AddressHomePage.css";
import SearchSection from "./common/SearchSection";
import Header from "./common/Header";

export default function AddressHomePage({ onSearchClick, onMapClick }) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchClick) {
      onSearchClick(keyword);
    }
  };

  return (
    <div className="root">
      <Header />
      <div className="home-inner">
        {/* 상단 큰 검색 영역 */}
        <SearchSection
          handleSubmit={handleSubmit}
          keyword={keyword}
          setKeyword={setKeyword}
        />

        {/* 우측 “지도로 찾을래요” 버튼 */}
        <aside className="home-map-panel">
          <button
            className="home-map-button"
            type="button"
            onClick={onMapClick}
          >
            <div className="home-map-icon">📍</div>
            <div className="home-map-text">
              지도로
              <br />
              찾을래요.
            </div>
          </button>
        </aside>
      </div>
    </div>
  );
}
