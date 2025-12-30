# 📋 BUCHHALTUNGS- & AUSZAHLUNGSPROZESS  
**(Organisatorische Referenz – systemagnostisch)**

**Status:** FINAL – EINGEFROREN  
**Gültig für:** Buchhaltung, Provision, Admin, Management  
**Bezug:** ARCHITECTURAL_GUARDRAILS_AND_BOUNDARIES.md, PROV-0 bis PROV-6  

---

## 1. Zweck dieses Dokuments

Dieses Dokument beschreibt **wie Provisionen organisatorisch ausgezahlt werden**,  
nachdem sie im System **fachlich korrekt vorbereitet** wurden.

Es definiert:

- Verantwortlichkeiten  
- Übergabepunkte  
- Kontrollmechanismen  
- Prüfpflichten  
- Fehlerfälle  

> Dieses Dokument ist **kein technisches Konzept**  
> und **keine Buchhaltungssoftware-Spezifikation**.

---

## 2. Grundprinzip (nicht verhandelbar)

> **Das System entscheidet über Anspruch –  
> die Buchhaltung entscheidet über Geld.**

Das System:
- berechnet  
- prüft  
- dokumentiert  
- löst Auszahlung **nur fachlich aus**

Die Buchhaltung:
- prüft rechtlich & steuerlich  
- zahlt aus  
- verbucht  
- archiviert  

---

## 3. Rollen & Verantwortlichkeiten

### 🧑‍💼 Provisionsverantwortlicher
- prüft Provisionsansprüche  
- bestätigt Provisionen (PROV-5)  
- löst Auszahlung aus (PROV-6)  
- **zahlt nicht aus**

### 🧾 Buchhaltung
- erhält Auszahlungsfreigaben  
- prüft:
  - Vertrag  
  - Steuerstatus  
  - Rechnung / Gutschrift  
- führt Auszahlung durch  
- dokumentiert Zahlung extern  

### 🛡️ Admin
- stellt Systemverfügbarkeit sicher  
- hat **keinen Einfluss** auf Auszahlungen  

---

## 4. Auslöser für die Buchhaltung

Ein Vorgang vom Typ:

> **COMMISSION_PAYOUT_TRIGGERED**

ist der **einzige offizielle Auslöser**.

Er enthält:
- Claim-ID  
- Vertriebler  
- Betrag  
- Währung  
- Zeitpunkt  
- Auslöser (Rolle & Person)  

➡️ **Ohne diesen Vorgang darf keine Auszahlung erfolgen.**

---

## 5. Übergabeprozess (Schritt für Schritt)

### Schritt 1 – Fachliche Freigabe (System)
- Claim ist:
  - BESTÄTIGT  
  - Zahlung eingegangen  
  - Haltefrist abgelaufen  
- Provisionsverantwortlicher klickt:  
  **„Auszahlung auslösen"**

➡️ System erzeugt:
- Status: `AUSZAHLUNG_AUSGELÖST`  
- Vorgang: `COMMISSION_PAYOUT_TRIGGERED`

---

### Schritt 2 – Übergabe an Buchhaltung
Die Buchhaltung erhält:
- Zugriff auf Read-only-System **oder**
- periodische Liste (Export / Report)

Mit:
- Claim-ID  
- Name Vertriebler  
- Betrag  
- Quelle (Shop / Service / Investment)  
- Datum der Auslösung  

---

### Schritt 3 – Buchhalterische Prüfung
Die Buchhaltung prüft **außerhalb des Systems**:

- liegt eine gültige Abrechnung vor?  
- Steuerstatus korrekt?  
- Zahlungsdaten aktuell?  
- interne Compliance erfüllt?  

➡️ Das System **mischt sich nicht ein**.

---

### Schritt 4 – Auszahlung
- Auszahlung erfolgt über:
  - Bank  
  - Zahlungsdienstleister  
  - Sammelüberweisung  
- Zeitpunkt liegt **im Ermessen der Buchhaltung**

---

### Schritt 5 – Dokumentation
Die Buchhaltung dokumentiert:
- Zahlungsdatum  
- Zahlungsweg  
- Referenznummer  

➡️ Optional später:
- manuelle Notiz im System  
- oder externer Vermerk  

---

## 6. Fehler- & Sonderfälle

### ❌ Auszahlung nicht möglich
Beispiele:
- fehlende Steuerdaten  
- gesperrter Vertriebler  
- formale Fehler  

➡️ Vorgehen:
- **keine Auszahlung**
- Buchhaltung informiert Provisionsverantwortlichen
- neuer Vorgang (außerhalb oder später im System)

---

### ❌ Falsche Auszahlung
➡️ **Kein Rückbau im System**
- Korrekturen erfolgen:
  - buchhalterisch  
  - über Verrechnung  
- System bleibt **historisch korrekt**

---

## 7. Prüf- & Auditfähigkeit

Das System liefert jederzeit:
- vollständige Claim-Historie  
- alle Statuswechsel  
- alle Auslöser (wer, wann, warum)

Die Buchhaltung liefert:
- Zahlungsnachweise  
- Buchungsbelege  

➡️ **Gemeinsam revisionsfähig**, aber **getrennte Verantwortung**.

---

## 8. Was dieses System bewusst NICHT tut

- ❌ keine Buchungen  
- ❌ keine Steuerberechnung  
- ❌ keine Rechnungserstellung  
- ❌ keine Zahlungsausführung  
- ❌ keine Korrekturbuchungen  

---

## 9. Worst-Case-Szenarien (beherrscht)

- System offline → Buchhaltung arbeitet weiter  
- Auszahlung verzögert → Anspruch bleibt gültig  
- Streitfall → Audit-Trail vorhanden  

➡️ **Kein Single Point of Failure.**

---

## 10. Abschluss

Dieses Dokument stellt sicher, dass:

- Provisionen fair, nachvollziehbar und korrekt ausgezahlt werden  
- Technik und Buchhaltung sauber getrennt bleiben  
- niemand „mal eben" Geld bewegt  

> **Vertrauen entsteht durch Trennung von Macht.**

**Status: FINAL.**

