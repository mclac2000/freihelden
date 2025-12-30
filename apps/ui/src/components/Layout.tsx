import { ReactNode, useState, FormEvent } from "react";
import { search, SearchResult } from "../api";

interface LayoutProps {
  children: ReactNode;
  currentPage: "dashboard" | "provisions" | "lead";
  onNavigate: (page: "dashboard" | "provisions" | "lead", leadId?: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const results = await search(searchQuery.trim());
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (err: any) {
      alert(`Fehler bei der Suche: ${err.message}`);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.entityType === "LEAD") {
      onNavigate("lead", result.entityId);
    }
    setShowSearchResults(false);
    setSearchQuery("");
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 0 }}>
      <nav style={{ 
        background: "#f5f5f5", 
        padding: "1rem", 
        borderBottom: "1px solid #ddd",
        display: "flex",
        gap: "1rem",
        alignItems: "center"
      }}>
        <button
          onClick={() => onNavigate("dashboard")}
          style={{
            padding: "0.5rem 1rem",
            background: currentPage === "dashboard" ? "#007bff" : "transparent",
            color: currentPage === "dashboard" ? "white" : "#333",
            border: "1px solid #ccc",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          Dashboard
        </button>
        <button
          onClick={() => onNavigate("provisions")}
          style={{
            padding: "0.5rem 1rem",
            background: currentPage === "provisions" ? "#007bff" : "transparent",
            color: currentPage === "provisions" ? "white" : "#333",
            border: "1px solid #ccc",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          Provisions
        </button>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem", position: "relative" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Suche..."
              style={{
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                minWidth: "200px"
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Suchen
            </button>
            {showSearchResults && searchResults.length > 0 && (
              <div style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "0.5rem",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                maxWidth: "400px",
                maxHeight: "400px",
                overflowY: "auto",
                zIndex: 1000
              }}>
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleResultClick(result)}
                    style={{
                      padding: "0.75rem",
                      borderBottom: idx < searchResults.length - 1 ? "1px solid #eee" : "none",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                  >
                    <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.25rem" }}>
                      {result.sourceType} • {result.entityType} {result.entityId}
                    </div>
                    <div style={{ fontSize: "0.9rem" }}>{result.preview}</div>
                  </div>
                ))}
              </div>
            )}
            {showSearchResults && searchResults.length === 0 && (
              <div style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "0.5rem",
                padding: "0.75rem",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                zIndex: 1000,
                color: "#666",
                fontStyle: "italic"
              }}>
                Keine Suchergebnisse gefunden.
              </div>
            )}
          </form>
        </div>
      </nav>
      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}

