# ARCHITECTURE_REVIEW_AND_DECISION_CHECKLISTS.md

**Status:** FINAL – NORMATIV  
**Gültig für:** Menschen & Architektur-GPT  
**Referenzen:**
- ARCHITECTURAL_GUARDRAILS_AND_BOUNDARIES.md
- ARCHITECTURE_GPT_CONTRACT.md
- ARCHITECTURE_GPT_SYSTEM_PROMPT.md

---

## Zweck dieses Dokuments

Dieses Dokument stellt **verbindliche Checklisten** bereit,
mit denen Architektur-, Produkt- und Technikentscheidungen
bewertet werden **müssen**, bevor sie umgesetzt werden.

Es gibt nur drei gültige Ergebnisse:
- ✅ GO
- ❌ STOP
- ❓ KLÄRUNG ERFORDERLICH

---

## 1️⃣ Architektur-Änderungs-Checkliste (Pflicht)

Jede geplante Änderung muss alle Fragen mit **JA** beantworten,
sonst ist das Ergebnis **STOP**.

- Ist das Ziel der Änderung klar formuliert?
- Ist der Scope klar begrenzt?
- Gibt es eine dokumentierte Exit-Strategie?
- Ist der Schritt vollständig reversibel?
- Betrifft die Änderung nur **eine** Risikodimension?
- Bleiben bestehende Leitplanken unangetastet?
- Widerspricht die Änderung keinem eingefrorenen Dokument?

➡️ Wenn eine Frage **NEIN** ist → **STOP**

---

## 2️⃣ Feature-Checkliste (vor jeder neuen Funktion)

- Ist diese Funktion explizit Teil des Systems (kein CRM, keine Buchhaltung)?
- Ist klar, **wer** sie nutzt und **wer nicht**?
- Erzeugt sie neue Schreibrechte oder Zustände?
- Erzeugt sie neue Abhängigkeiten?
- Kann sie isoliert deaktiviert werden?
- Gibt es einen klaren Nicht-Zweck („Was sie nicht tut")?

➡️ Unklare Antworten → **KLÄRUNG ERFORDERLICH**

---

## 3️⃣ KI-Checkliste (nicht verhandelbar)

Wenn KI involviert ist:

- Unterstützt die KI nur – oder entscheidet sie?
- Kann ein Mensch jederzeit widersprechen?
- Ist die Funktion feature-flag-gesteuert?
- Kann die KI vollständig deaktiviert werden?
- Wird keine Provision, Zuordnung oder Freigabe automatisiert?
- Ist das Verhalten erklärbar?

➡️ Ein einziges **NEIN** → **STOP**

---

## 4️⃣ Rollen- & Berechtigungs-Checkliste

- Ist klar, ob die Rolle hart oder weich ist?
- Werden harte Rollen technisch erzwingbar behandelt?
- Greifen weiche Rollen **nicht** in Writes ein?
- Ist die Provisionsrolle strikt getrennt vom Vertrieb?
- Ist jede Entscheidung auditierbar?

➡️ Unklare Rollengrenzen → **STOP**

---

## 5️⃣ Vorgang- & Audit-Checkliste

- Wird jede relevante Änderung als Vorgang dokumentiert?
- Ist der Auslöser (Rolle + Akteur) eindeutig?
- Ist die Historie append-only?
- Gibt es keine stillen Korrekturen?
- Ist der Vorgang frei von Fachlogik?

➡️ Fehlende Auditierbarkeit → **STOP**

---

## 6️⃣ API- & Integrations-Checkliste

- Enthält die API ausschließlich Mapping?
- Liegt Fachlogik **nicht** in der API?
- Sind externe Systeme klar entkoppelt?
- Gibt es keinen Shared State?
- Kann die Integration jederzeit abgeschaltet werden?

➡️ API mit Logik → **STOP**

---

## 7️⃣ Produktivitäts- & Risiko-Checkliste

- Kann ein Ausfall isoliert werden?
- Gibt es keinen Single Point of Failure?
- Bleibt das System bei Ausfall read-only?
- Ist kein produktiver Datenverlust möglich?

➡️ Existenzrisiko → **STOP**

---

## 8️⃣ Entscheidungsregel (abschließend)

Wenn:
- alle relevanten Checklisten **JA** ergeben → **GO**
- eine Checkliste **NEIN** ergibt → **STOP**
- Antworten unklar sind → **KLÄRUNG ERFORDERLICH**

**Es gibt keine impliziten Freigaben.**

---

**Ende des Dokuments**

