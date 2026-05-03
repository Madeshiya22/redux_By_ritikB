import { Search, LogOut, NotebookPen } from "lucide-react";

const NotesNavbar = ({
  onCreate,
  onLogout,
  searchTerm,
  isSearchOpen,
  onToggleSearch,
  onSearchChange,
  searchInputRef,
}) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="nav-logo">
          <NotebookPen size={26} />
        </div>
        <div>
          <h2 className="nav-title">NOtes.pro</h2>
        </div>
      </div>

      <div className="nav-actions">
        <div className={`notes-search-shell ${isSearchOpen ? "is-open" : ""}`}>
          <input
            ref={searchInputRef}
            className="notes-search-inline"
            type="search"
            placeholder="Search notes"
            value={searchTerm}
            onChange={onSearchChange}
            aria-label="Search notes"
          />

          <button
            className="notes-search-toggle"
            onClick={onToggleSearch}
            type="button"
            aria-label={isSearchOpen ? "Close search" : "Open search"}
          >
            <Search size={17} />
          </button>
        </div>

        <button className="btn-create-note" onClick={onCreate} type="button">
          + Create Note
        </button>

        <button className="btn-logout" onClick={onLogout} type="button">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NotesNavbar;
