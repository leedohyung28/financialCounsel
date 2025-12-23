import React, { useState } from "react";
import "../styles/AddressHomePage.css";

export default function AddressHomePage({ onSearchClick, onMapClick }) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchClick) {
      onSearchClick(keyword);
    }
  };

  return (
    <div className="home-root">
      <div className="home-inner">
        {/* 상단 큰 검색 영역 */}
        <section className="home-search-section">
          <form className="home-search-form" onSubmit={handleSubmit}>
            <button type="submit" className="home-search-icon">
              🔍
            </button>
            <input
              className="home-search-input"
              placeholder="예) 도음6로 42, 국립중앙박물관, 상암동 1595, 초성검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {/* 우측 드롭다운은 디자인만 */}
            <div className="home-search-select">▾</div>
            <button type="submit" className="home-search-btn">
              검색
            </button>
          </form>

          {/* 검색 옵션 행 */}
          <div className="home-options-row">
            <label className="home-option">
              <input type="checkbox" />
              <span>시물주소 검색</span>
            </label>
            <label className="home-option">
              <input type="checkbox" />
              <span>폐지된 주소정보 포함</span>
            </label>
            <label className="home-option">
              <input type="checkbox" />
              <span>좌표 검색</span>
            </label>
            <label className="home-option right">
              <input type="checkbox" defaultChecked />
              <span>자동완성 사용 안함</span>
            </label>
          </div>
        </section>

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
