import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  currentPage: "dashboard" | "provisions";
  onNavigate: (page: "dashboard" | "provisions") => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 0 }}>
      <nav style={{ 
        background: "#f5f5f5", 
        padding: "1rem", 
        borderBottom: "1px solid #ddd",
        display: "flex",
        gap: "1rem"
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
      </nav>
      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}

