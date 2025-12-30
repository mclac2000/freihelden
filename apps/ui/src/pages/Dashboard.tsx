import { useEffect, useState } from "react";
import { getAllProvisionClaims, ProvisionClaimView } from "../api";

export function Dashboard() {
  const [claims, setClaims] = useState<ProvisionClaimView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllProvisionClaims()
      .then(setClaims)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Lade Daten...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Fehler: {error}</div>;
  }

  const totalAmount = claims.reduce((sum, c) => sum + c.amountCents, 0);
  const statusCounts = claims.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <h1>Dashboard</h1>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div style={{ 
          padding: "1rem", 
          background: "#f9f9f9", 
          borderRadius: "4px",
          border: "1px solid #ddd"
        }}>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Anzahl Claims</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{claims.length}</div>
        </div>
        
        <div style={{ 
          padding: "1rem", 
          background: "#f9f9f9", 
          borderRadius: "4px",
          border: "1px solid #ddd"
        }}>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Gesamtsumme</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {(totalAmount / 100).toFixed(2)} EUR
          </div>
        </div>
      </div>

      <div>
        <h2>Status-Übersicht</h2>
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse",
          border: "1px solid #ddd"
        }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: "0.5rem", textAlign: "right", border: "1px solid #ddd" }}>Anzahl</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(statusCounts).map(([status, count]) => (
              <tr key={status}>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{status}</td>
                <td style={{ padding: "0.5rem", textAlign: "right", border: "1px solid #ddd" }}>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

