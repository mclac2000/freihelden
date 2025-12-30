import { useEffect, useState } from "react";
import { getProvisionClaimAudit, Vorgang } from "../api";

interface ProvisionAuditProps {
  claimId: string;
}

export function ProvisionAudit({ claimId }: ProvisionAuditProps) {
  const [audit, setAudit] = useState<Vorgang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProvisionClaimAudit(claimId)
      .then(setAudit)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [claimId]);

  if (loading) {
    return <div style={{ padding: "1rem", fontSize: "0.9rem" }}>Lade Audit...</div>;
  }

  if (error) {
    return <div style={{ padding: "1rem", color: "red", fontSize: "0.9rem" }}>Fehler: {error}</div>;
  }

  if (audit.length === 0) {
    return <div style={{ padding: "1rem", fontSize: "0.9rem", color: "#666" }}>Keine Audit-Einträge vorhanden.</div>;
  }

  return (
    <div style={{
      padding: "1rem",
      background: "#f9f9f9",
      borderRadius: "4px",
      border: "1px solid #ddd",
      marginTop: "1rem"
    }}>
      <h3 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.1rem" }}>Audit-Trail</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {audit.map((vorgang, index) => (
          <div
            key={index}
            style={{
              padding: "0.75rem",
              background: "white",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "0.85rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <div style={{ fontWeight: "bold", color: "#333" }}>{vorgang.type}</div>
              <div style={{ color: "#666" }}>
                {new Date(vorgang.timestamp).toLocaleString("de-DE")}
              </div>
            </div>
            {vorgang.triggeredBy && (
              <div style={{ marginBottom: "0.25rem", color: "#666" }}>
                <span style={{ fontWeight: "bold" }}>Ausgelöst von:</span> {vorgang.triggeredBy.role} ({vorgang.triggeredBy.actorId})
              </div>
            )}
            <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#f5f5f5", borderRadius: "2px" }}>
              <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.25rem" }}>Payload:</div>
              <pre style={{ margin: 0, fontSize: "0.75rem", overflow: "auto" }}>
                {JSON.stringify(vorgang.payload, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

