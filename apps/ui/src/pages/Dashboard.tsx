import { useEffect, useState, useMemo } from "react";
import { getAllProvisionClaims, ProvisionClaimView } from "../api";
import { ErrorMessage } from "../components/ErrorMessage";

// Hilfsfunktion (UI-only, keine Seiteneffekte)
function isReadyForPayout(claim: ProvisionClaimView): boolean {
  const now = new Date().getTime();
  const holdUntil = new Date(claim.holdUntil).getTime();
  return (
    claim.status === "BESTÄTIGT" &&
    claim.paymentStatus === "EINGEGANGEN" &&
    now >= holdUntil
  );
}

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

  // Kennzahlen berechnen
  const metrics = useMemo(() => {
    const totalAmount = claims.reduce((sum, c) => sum + c.amountCents, 0);
    const readyForPayout = claims.filter((c) => isReadyForPayout(c)).length;
    const blockedPayment = claims.filter(
      (c) => c.paymentStatus !== "EINGEGANGEN"
    ).length;
    
    const now = new Date().getTime();
    const blockedHoldPeriod = claims.filter((c) => {
      const holdUntil = new Date(c.holdUntil).getTime();
      return (
        c.status === "BESTÄTIGT" &&
        c.paymentStatus === "EINGEGANGEN" &&
        now < holdUntil
      );
    }).length;

    return {
      totalAmount,
      readyForPayout,
      blockedPayment,
      blockedHoldPeriod
    };
  }, [claims]);

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Lade Daten...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

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
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Anzahl Claims gesamt</div>
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
            {(metrics.totalAmount / 100).toFixed(2)} EUR
          </div>
        </div>

        <div style={{
          padding: "1rem",
          background: "#d4edda",
          borderRadius: "4px",
          border: "1px solid #c3e6cb"
        }}>
          <div style={{ fontSize: "0.9rem", color: "#155724" }}>Bereit zur Auszahlung</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#155724" }}>
            {metrics.readyForPayout}
          </div>
        </div>

        <div style={{
          padding: "1rem",
          background: "#fff3cd",
          borderRadius: "4px",
          border: "1px solid #ffeaa7"
        }}>
          <div style={{ fontSize: "0.9rem", color: "#856404" }}>Blockiert (Zahlung fehlt)</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#856404" }}>
            {metrics.blockedPayment}
          </div>
        </div>

        <div style={{
          padding: "1rem",
          background: "#fff3cd",
          borderRadius: "4px",
          border: "1px solid #ffeaa7"
        }}>
          <div style={{ fontSize: "0.9rem", color: "#856404" }}>Blockiert (Haltefrist)</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#856404" }}>
            {metrics.blockedHoldPeriod}
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
