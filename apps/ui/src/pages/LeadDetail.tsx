import { useEffect, useState } from "react";
import { getCommunicationForEntity, addCommunicationNote, CommunicationEvent, uploadFile, getFileAttachments, FileAttachment, askAI, sendEmail } from "../api";

interface LeadDetailProps {
  leadId?: string;
}

export function LeadDetail({ leadId = "test-lead-1" }: LeadDetailProps) {
  const [notes, setNotes] = useState<CommunicationEvent[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [attachmentsByEvent, setAttachmentsByEvent] = useState<Record<string, FileAttachment[]>>({});
  const [uploadingForEvent, setUploadingForEvent] = useState<string | null>(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  const loadNotes = () => {
    setLoading(true);
    getCommunicationForEntity("LEAD", leadId)
      .then(async (events) => {
        setNotes(events);
        // Load attachments for each event
        const attachmentsMap: Record<string, FileAttachment[]> = {};
        for (const event of events) {
          try {
            const atts = await getFileAttachments(event.id);
            attachmentsMap[event.id] = atts;
          } catch (err) {
            attachmentsMap[event.id] = [];
          }
        }
        setAttachmentsByEvent(attachmentsMap);
      })
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

  const handleFileUpload = async (eventId: string, file: File) => {
    setUploadingForEvent(eventId);
    try {
      await uploadFile(eventId, file);
      loadNotes(); // Reload to get updated attachments
    } catch (err: any) {
      alert(`Fehler beim Upload: ${err.message}`);
    } finally {
      setUploadingForEvent(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) {
      return;
    }

    setAiLoading(true);
    setAiAnswer(null);
    try {
      const answer = await askAI("LEAD", leadId, aiQuestion.trim());
      setAiAnswer(answer);
    } catch (err: any) {
      alert(`Fehler: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailTo.trim() || !emailSubject.trim() || !emailBody.trim()) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }

    setEmailSending(true);
    try {
      await sendEmail("LEAD", leadId, emailTo.trim(), emailSubject.trim(), emailBody.trim());
      setEmailTo("");
      setEmailSubject("");
      setEmailBody("");
      setShowEmailForm(false);
      loadNotes(); // Reload to show the new email communication
    } catch (err: any) {
      alert(`Fehler beim Senden: ${err.message}`);
    } finally {
      setEmailSending(false);
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

      <div style={{ marginBottom: "2rem" }}>
        <h2>KI-Unterstützung</h2>
        <div style={{ padding: "1rem", background: "#fff3cd", borderRadius: "4px", border: "1px solid #ffc107", marginBottom: "1rem" }}>
          <strong>Hinweis:</strong> KI-Unterstützung – keine Entscheidungsgrundlage
        </div>
        <textarea
          value={aiQuestion}
          onChange={(e) => setAiQuestion(e.target.value)}
          placeholder="Frage an KI stellen..."
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "0.5rem",
            fontSize: "0.9rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            marginBottom: "0.5rem"
          }}
        />
        <button
          onClick={handleAskAI}
          disabled={!aiQuestion.trim() || aiLoading}
          style={{
            padding: "0.5rem 1rem",
            background: aiLoading ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: aiLoading ? "not-allowed" : "pointer",
            fontSize: "0.9rem"
          }}
        >
          {aiLoading ? "KI fragt..." : "KI fragen"}
        </button>
        {aiAnswer && (
          <div style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#f9f9f9",
            borderRadius: "4px",
            border: "1px solid #ddd",
            whiteSpace: "pre-wrap"
          }}>
            <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}>KI-Antwort:</div>
            <div>{aiAnswer}</div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0 }}>Kommunikation</h2>
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            style={{
              padding: "0.5rem 1rem",
              background: showEmailForm ? "#6c757d" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            {showEmailForm ? "Abbrechen" : "E-Mail schreiben"}
          </button>
        </div>

        {showEmailForm && (
          <div style={{
            padding: "1rem",
            background: "#f9f9f9",
            borderRadius: "4px",
            border: "1px solid #ddd",
            marginBottom: "1rem"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>E-Mail senden</h3>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: "bold" }}>
                Empfänger:
              </label>
              <input
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="email@example.com"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "0.9rem"
                }}
              />
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: "bold" }}>
                Betreff:
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Betreff der E-Mail"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "0.9rem"
                }}
              />
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: "bold" }}>
                Nachricht:
              </label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="E-Mail-Text"
                style={{
                  width: "100%",
                  minHeight: "150px",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "0.9rem"
                }}
              />
            </div>
            <button
              onClick={handleSendEmail}
              disabled={!emailTo.trim() || !emailSubject.trim() || !emailBody.trim() || emailSending}
              style={{
                padding: "0.5rem 1rem",
                background: emailSending ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: emailSending ? "not-allowed" : "pointer",
                fontSize: "0.9rem"
              }}
            >
              {emailSending ? "Wird gesendet..." : "Senden"}
            </button>
          </div>
        )}
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
                  
                  {/* File attachments */}
                  <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #eee" }}>
                    <div style={{ marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "bold" }}>Anhänge:</div>
                    <input
                      type="file"
                      id={`file-${note.id}`}
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(note.id, file);
                        }
                      }}
                    />
                    <label
                      htmlFor={`file-${note.id}`}
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.5rem",
                        background: uploadingForEvent === note.id ? "#ccc" : "#28a745",
                        color: "white",
                        borderRadius: "4px",
                        cursor: uploadingForEvent === note.id ? "not-allowed" : "pointer",
                        fontSize: "0.85rem",
                        marginBottom: "0.5rem"
                      }}
                    >
                      {uploadingForEvent === note.id ? "Upload..." : "Datei anhängen"}
                    </label>
                    
                    {attachmentsByEvent[note.id] && attachmentsByEvent[note.id].length > 0 && (
                      <div style={{ marginTop: "0.5rem" }}>
                        {attachmentsByEvent[note.id].map((att) => (
                          <div
                            key={att.id}
                            style={{
                              padding: "0.5rem",
                              background: "#f0f0f0",
                              borderRadius: "4px",
                              marginTop: "0.25rem",
                              fontSize: "0.85rem"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>{att.filename}</span>
                              <span style={{ color: "#666" }}>
                                {formatFileSize(att.sizeBytes)} • {new Date(att.uploadedAt).toLocaleString("de-DE")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

