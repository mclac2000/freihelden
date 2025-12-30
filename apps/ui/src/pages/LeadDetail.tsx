import { useEffect, useState } from "react";
import { getCommunicationForEntity, addCommunicationNote, CommunicationEvent } from "../api";

interface LeadDetailProps {
  leadId?: string;
}

export function LeadDetail({ leadId = "test-lead-1" }: LeadDetailProps) {
  const [notes, setNotes] = useState<CommunicationEvent[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadNotes = () => {
    setLoading(true);
    getCommunicationForEntity("LEAD", leadId)
      .then(setNotes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotes();
  }, [leadId]);

  const handleSaveNote = async () => {
    if (!newNote.trim()) {
      return;
    }

    setSaving(true);
    try {
      await addCommunicationNote("LEAD", leadId, newNote.trim());
      setNewNote("");
      loadNotes();
    } catch (err: any) {
      alert(`Fehler: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Lade Notizen...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Fehler: {error}</div>;
  }

  return (
    <div>
      <h1>Lead: {leadId}</h1>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Notiz hinzufügen</h2>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Notiz eingeben..."
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "0.5rem",
            fontSize: "0.9rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            marginBottom: "0.5rem"
          }}
        />
        <button
          onClick={handleSaveNote}
          disabled={!newNote.trim() || saving}
          style={{
            padding: "0.5rem 1rem",
            background: saving ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: saving ? "not-allowed" : "pointer",
            fontSize: "0.9rem"
          }}
        >
          {saving ? "Speichern..." : "Speichern"}
        </button>
      </div>

      <div>
        <h2>Notizen</h2>
        {notes.length === 0 ? (
          <div style={{ color: "#666", fontStyle: "italic" }}>Keine Notizen vorhanden.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {notes
              .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
              .map((note) => (
                <div
                  key={note.id}
                  style={{
                    padding: "1rem",
                    background: "#f9f9f9",
                    borderRadius: "4px",
                    border: "1px solid #ddd"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>
                      {note.createdBy.role} ({note.createdBy.actorId})
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>
                      {new Date(note.createdAt).toLocaleString("de-DE")}
                    </div>
                  </div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{note.content}</div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

