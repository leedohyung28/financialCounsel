// AddressSearchPage.jsx
import React, { useState } from "react";
import "../styles/AddressSearchPage.css";
import { useTheme } from "../context/ThemeContext";
import SearchSection from "./common/SearchSection";

const mockData = Array.from({ length: 37 }).map((_, i) => ({
  id: i + 1,
  jibun: `서울특별시 영등포구 여의도동 ${i + 1}`,
  road: `서울특별시 영등포구 여의대로 ${i + 1}`,
  zip: `07${300 + i}`,
}));

const PAGE_SIZE = 5;

export default function AddressSearchPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const filtered = mockData.filter(
    (item) => item.jibun.includes(query) || item.road.includes(query)
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const { isDark, toggleTheme } = useTheme();

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className={`root ${isDark ? "theme-dark" : "theme-light"}`}>
      <header className="page-header">
        <SearchSection
          handleSubmit={handleSearch}
          keyword={keyword}
          setKeyword={setKeyword}
        />
      </header>

      <div className="theme-toggle">
        <span className="toggle-label">
          {isDark ? "다크 모드" : "라이트 모드"}
        </span>
        <label className="switch">
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
      </div>

      <main className="page-body">
        {/* 좌측 검색/그리드 영역 */}
        <section className="left-panel">
          <form onSubmit={handleSearch} className="sub-search-form">
            <input
              className="sub-search-input"
              placeholder="주소를 입력하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="sub-search-btn" type="submit">
              검색
            </button>
          </form>

          <div className="result-summary">
            검색 결과 <span className="result-count">{filtered.length}</span>건
          </div>

          <div className="grid-header">
            <span className="col-no">No</span>
            <span className="col-addr">주소</span>
            <span className="col-zip">우편번호</span>
            <span className="col-actions">액션</span>
          </div>

          <div className="grid-body">
            {pageData.map((item, idx) => (
              <div key={item.id} className="grid-row">
                <div className="cell-no">
                  {(page - 1) * PAGE_SIZE + idx + 1}
                </div>
                <div className="cell-addr">
                  <div className="addr-type">지번</div>
                  <div className="addr-text">{item.jibun}</div>
                  <div className="addr-type alt">도로명</div>
                  <div className="addr-text">{item.road}</div>
                </div>
                <div className="cell-zip">{item.zip}</div>
                <div className="cell-actions">
                  <button className="btn-outline">영문보기</button>
                  <button className="btn-outline">지도보기</button>
                </div>
              </div>
            ))}

            {pageData.length === 0 && (
              <div className="no-result">검색 결과가 없습니다.</div>
            )}
          </div>

          <div className="pagination">
            <button
              className="pg-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`pg-btn ${page === i + 1 ? "active" : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="pg-btn"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
            >
              ›
            </button>
          </div>
        </section>

        {/* 우측 지도 영역 */}
        <section className="right-panel">
          <div className="map-container">
            <div className="map-placeholder">지도 영역</div>
          </div>
          <button className="map-main-btn">지도로 찾을래요</button>
        </section>
      </main>
    </div>
  );
}
