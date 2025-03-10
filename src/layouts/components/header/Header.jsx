import "./Header.scss";
export default function Header() {
  return (
    <div>
      {/* Header */}
      <header className="kanban-header">
        <div className="logo">
          <img
            src="src/assets/image/image.png"
            alt="LIFETEK"
            className="logo-img"
          />
          <span className="logo-text">LIFETEK</span>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm dự án..."
            className="search-input"
          />
        </div>
        <div className="user-profile">
          <span className="user-icon">🧑‍💻</span>
          <span className="user-name">Nguyễn Long Vũ</span>
        </div>
      </header>
    </div>
  );
}
