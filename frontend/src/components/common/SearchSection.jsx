export default function SearchSection({ handleSubmit, keyword, setKeyword }) {
  return (
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
  );
}
