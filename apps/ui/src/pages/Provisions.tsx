import { useEffect, useState } from "react";
import { getAllProvisionClaims, ProvisionClaimView } from "../api";

export function Provisions() {
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

  return (
    <div>
      <h1>Provision Claims</h1>
      
      {claims.length === 0 ? (
        <div>Keine Claims vorhanden.</div>
      ) : (
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse",
          border: "1px solid #ddd",
          fontSize: "0.9rem"
        }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Claim ID</th>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Source</th>
              <th style={{ padding: "0.5rem", textAlign: "right", border: "1px solid #ddd" }}>Amount</th>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Currency</th>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Payment</th>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Hold Until</th>
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.claimId}>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{claim.claimId}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{claim.source}</td>
                <td style={{ padding: "0.5rem", textAlign: "right", border: "1px solid #ddd" }}>
                  {(claim.amountCents / 100).toFixed(2)}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{claim.currency}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{claim.status}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{claim.paymentStatus}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  {new Date(claim.holdUntil).toLocaleDateString("de-DE")}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{claim.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

