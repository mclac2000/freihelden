import { useEffect, useState, useMemo } from "react";
import { getAllProvisionClaims, approveProvisionClaim, ProvisionClaimView } from "../api";
import { DEV_AUTH } from "../auth";
import { ProvisionAudit } from "../components/ProvisionAudit";

// Hilfsfunktionen (UI-only, keine Seiteneffekte)
function isReadyForPayout(claim: ProvisionClaimView): boolean {
  const now = new Date().getTime();
  const holdUntil = new Date(claim.holdUntil).getTime();
  return (
    claim.status === "BESTÄTIGT" &&
    claim.paymentStatus === "EINGEGANGEN" &&
    now >= holdUntil
  );
}

function getBlockReason(claim: ProvisionClaimView): string {
  const now = new Date().getTime();
  const holdUntil = new Date(claim.holdUntil).getTime();

  if (claim.paymentStatus !== "EINGEGANGEN") {
    return "Wartet auf Zahlungseingang";
  } else if (now < holdUntil) {
    const date = new Date(claim.holdUntil).toLocaleDateString("de-DE");
    return `In Haltefrist bis ${date}`;
  } else if (claim.status !== "BESTÄTIGT") {
    return "Noch nicht freigegeben";
  } else {
    return "Bereit zur Auszahlung";
  }
}

function getStatusColor(status: ProvisionClaimView["status"]): string {
  switch (status) {
    case "ENTSTANDEN":
      return "#6c757d";
    case "IN_PRÜFUNG":
      return "#ffc107";
    case "BESTÄTIGT":
      return "#28a745";
    case "ABGELEHNT":
      return "#dc3545";
    case "KORREKTUR_ERFORDERLICH":
      return "#fd7e14";
    case "AUSZAHLUNG_AUSGELÖST":
      return "#17a2b8";
    default:
      return "#6c757d";
  }
}

function getPaymentStatusColor(paymentStatus: ProvisionClaimView["paymentStatus"]): string {
  return paymentStatus === "EINGEGANGEN" ? "#28a745" : "#ffc107";
}

export function Provisions() {
  const [claims, setClaims] = useState<ProvisionClaimView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterSource, setFilterSource] = useState<string>("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("");
  const [filterReadyForPayout, setFilterReadyForPayout] = useState<boolean | null>(null);

  // Sortierung State
  const [sortBy, setSortBy] = useState<"amountCents" | "holdUntil">("holdUntil");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Audit-Ansicht State
  const [openAuditFor, setOpenAuditFor] = useState<string | null>(null);

  const loadClaims = () => {
    getAllProvisionClaims()
      .then(setClaims)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const handleApprove = async (claimId: string) => {
    if (!confirm("Provision wirklich bestätigen?")) {
      return;
    }

    try {
      await approveProvisionClaim(claimId);
      loadClaims();
    } catch (err: any) {
      alert(`Fehler: ${err.message}`);
    }
  };

  // Client-seitige Filterung und Sortierung
  const filteredAndSortedClaims = useMemo(() => {
    let filtered = [...claims];

    // Filter anwenden
    if (filterStatus) {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }
    if (filterSource) {
      filtered = filtered.filter((c) => c.source === filterSource);
    }
    if (filterPaymentStatus) {
      filtered = filtered.filter((c) => c.paymentStatus === filterPaymentStatus);
    }
    if (filterReadyForPayout !== null) {
      filtered = filtered.filter((c) => isReadyForPayout(c) === filterReadyForPayout);
    }

    // Sortierung anwenden
    filtered.sort((a, b) => {
      let aVal: number;
      let bVal: number;

      if (sortBy === "amountCents") {
        aVal = a.amountCents;
        bVal = b.amountCents;
      } else {
        aVal = new Date(a.holdUntil).getTime();
        bVal = new Date(b.holdUntil).getTime();
      }

      if (sortDirection === "asc") {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });

    return filtered;
  }, [claims, filterStatus, filterSource, filterPaymentStatus, filterReadyForPayout, sortBy, sortDirection]);

  if (loading) {
    return <div>Lade Daten...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Fehler: {error}</div>;
  }

  const uniqueStatuses = Array.from(new Set(claims.map((c) => c.status)));
  const uniqueSources = Array.from(new Set(claims.map((c) => c.source)));

  return (
    <div>
      <h1>Provision Claims</h1>

      {/* Filter */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "1rem",
        padding: "1rem",
        background: "#f9f9f9",
        borderRadius: "4px"
      }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
            Status:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="">Alle</option>
            {uniqueStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
            Source:
          </label>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="">Alle</option>
            {uniqueSources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
            Payment Status:
          </label>
          <select
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="">Alle</option>
            <option value="EINGEGANGEN">EINGEGANGEN</option>
            <option value="NICHT_EINGEGANGEN">NICHT_EINGEGANGEN</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
            Ready for Payout:
          </label>
          <select
            value={filterReadyForPayout === null ? "" : filterReadyForPayout ? "true" : "false"}
            onChange={(e) => {
              if (e.target.value === "") setFilterReadyForPayout(null);
              else setFilterReadyForPayout(e.target.value === "true");
            }}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="">Alle</option>
            <option value="true">Ja</option>
            <option value="false">Nein</option>
          </select>
        </div>
      </div>

      {/* Sortierung */}
      <div style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "1rem",
        alignItems: "center"
      }}>
        <label style={{ fontSize: "0.9rem" }}>Sortieren nach:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "amountCents" | "holdUntil")}
          style={{ padding: "0.5rem" }}
        >
          <option value="holdUntil">Hold Until</option>
          <option value="amountCents">Amount</option>
        </select>
        <button
          onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          {sortDirection === "asc" ? "↑ Aufsteigend" : "↓ Absteigend"}
        </button>
      </div>

      <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#666" }}>
        {filteredAndSortedClaims.length} von {claims.length} Claims
      </div>

      {filteredAndSortedClaims.length === 0 ? (
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
              <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Audit</th>
              {DEV_AUTH.role === "COMMISSION_CONTROLLER" && (
                <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Aktion</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedClaims.map((claim) => {
              const blockReason = getBlockReason(claim);
              return (
                <>
                  <tr key={claim.claimId}>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{claim.claimId}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{claim.source}</td>
                    <td style={{ padding: "0.5rem", textAlign: "right", border: "1px solid #ddd" }}>
                      {(claim.amountCents / 100).toFixed(2)}
                    </td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{claim.currency}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                      <div>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            background: getStatusColor(claim.status),
                            color: "white",
                            fontSize: "0.85rem",
                            fontWeight: "bold"
                          }}
                        >
                          {claim.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem" }}>
                        {blockReason}
                      </div>
                    </td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          background: getPaymentStatusColor(claim.paymentStatus),
                          color: "white",
                          fontSize: "0.85rem",
                          fontWeight: "bold"
                        }}
                      >
                        {claim.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                      {new Date(claim.holdUntil).toLocaleDateString("de-DE")}
                    </td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{claim.note || "-"}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                      <button
                        onClick={() => setOpenAuditFor(openAuditFor === claim.claimId ? null : claim.claimId)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          background: openAuditFor === claim.claimId ? "#6c757d" : "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem"
                        }}
                      >
                        {openAuditFor === claim.claimId ? "Audit ausblenden" : "Audit anzeigen"}
                      </button>
                    </td>
                    {DEV_AUTH.role === "COMMISSION_CONTROLLER" && (
                      <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                        {claim.status === "IN_PRÜFUNG" && claim.paymentStatus === "EINGEGANGEN" && (
                          <button
                            onClick={() => handleApprove(claim.claimId)}
                            style={{
                              padding: "0.5rem 1rem",
                              background: "#28a745",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.85rem"
                            }}
                          >
                            Provision bestätigen
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                  {openAuditFor === claim.claimId && (
                    <tr key={`${claim.claimId}-audit`}>
                      <td colSpan={DEV_AUTH.role === "COMMISSION_CONTROLLER" ? 10 : 9} style={{ padding: 0, border: "none" }}>
                        <ProvisionAudit claimId={claim.claimId} />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
