# 🚀 Go-Live-Checkliste – Geldhelden Vertriebsplattform

**Status:** FINAL – VERBINDLICH  
**Ziel:** Kontrollierter Go-Live ohne System- oder Vertrauensrisiko  
**Gültig für:** Technik, Admin, Provision, Management  

---

## 1. Grundsatz vor dem Go-Live

☑ Das System ist **fachlich vollständig**  
☑ Keine offenen Architektur-Entscheidungen  
☑ Keine experimentellen Features aktiv  

> **Go-Live bedeutet: Testen unter realen Bedingungen –  
> nicht: Fertig sein für alle Ewigkeit.**

---

## 2. Technische Mindestvoraussetzungen

### Server & Infrastruktur
☑ Server erreichbar  
☑ HTTPS aktiv  
☑ Firewall aktiv  
☑ Backups auf Infrastruktur-Ebene eingerichtet  

### Environment
☑ `NODE_ENV=production`  
☑ `OPENAI_API_KEY` gesetzt  
☑ Mail-Credentials gesetzt  
☑ Keine Secrets im Code oder Repo  

---

## 3. Rollen & Zugriffsprüfung

### Vertriebler
☑ Kann:
- Leads sehen
- Notizen erfassen
- Dateien anhängen
- E-Mails senden
- KI befragen

☑ Kann **nicht**:
- Provisionen freigeben
- Auszahlungen auslösen
- Systemregeln ändern

---

### Provisionsverantwortlicher
☑ Sieht alle Provisionsansprüche  
☑ Kann Provisionen:
- prüfen
- freigeben
- Auszahlung auslösen  

☑ Kann **keine**:
- Daten löschen
- Beträge manuell ändern

---

### Admin
☑ Systemzugang vorhanden  
☑ Kann:
- Nutzer verwalten
- Feature-Flags steuern  

☑ Hat **keine** operative Provisionsmacht  

---

## 4. Provisionsprozess – Live-Check

☑ ProvisionClaim entsteht korrekt  
☑ Statusübergänge funktionieren  
☑ Freigabe nur durch berechtigte Rolle  
☑ Auszahlungsauslösung nur:
- nach Freigabe
- nach Haltefrist  
☑ Audit-Trail vollständig sichtbar  

---

## 5. Kommunikation & Wissensbasis

☑ Notizen speicherbar  
☑ E-Mails werden:
- versendet
- als Kommunikation gespeichert  
☑ Dateien:
- sind gebunden an Kommunikation
- sind nicht editier- oder löschbar  

☑ Suchfunktion findet:
- Notizen
- E-Mails
- Dateien

---

## 6. KI-Funktionalität (Read-Only)

☑ KI beantwortet Fragen  
☑ KI fasst Inhalte zusammen  
☑ KI:
- schreibt nichts
- entscheidet nichts
- verändert nichts  

☑ Hinweis im UI sichtbar:
„KI-Unterstützung – keine Entscheidungsgrundlage“

---

## 7. UX & Stabilität

☑ Keine leeren, verwirrenden Screens  
☑ Pagination funktioniert  
☑ Lade-Zustände sichtbar  
☑ Fehler werden verständlich angezeigt  
☑ Keine doppelten Aktionen möglich  

---

## 8. Buchhaltung & Organisation

☑ Buchhaltungsprozess dokumentiert  
☑ Auszahlung erfolgt **außerhalb** des Systems  
☑ System dient als:
- Anspruchs-
- Freigabe-
- Audit-Quelle  

---

## 9. Worst-Case-Szenarien (gedanklich geprüft)

☑ KI fällt aus → Vertrieb arbeitet weiter  
☑ Mail-Versand fällt aus → keine Daten gehen verloren  
☑ System offline → Buchhaltung handlungsfähig  
☑ Fehlerhafte Auszahlung → Korrektur extern möglich  

---

## 10. Go-Live-Entscheidung

☐ Alle Punkte geprüft  
☐ Keine Blocker offen  
☐ Go-Live freigegeben  

**Verantwortlich:** _______________________  
**Datum:** _______________________  

---

> **Ergebnis:**  
> Das System ist bereit für den operativen Einsatz  
> unter realen Bedingungen – kontrolliert, nachvollziehbar
> und ohne versteckte Risiken.

**Status: FINAL.**

