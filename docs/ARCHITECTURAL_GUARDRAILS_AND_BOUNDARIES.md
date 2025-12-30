# ARCHITECTURAL_GUARDRAILS_AND_BOUNDARIES.md

**Status:** FINAL – EINGEFROREN  
**Version:** 1.0  
**Änderungen:** nur über explizite Revision (ADR)  
**Gültig für:** Produkt, Technik, KI, Organisation  

---

## 1. Zweck dieses Dokuments

Dieses Dokument definiert die **nicht verhandelbaren Leitplanken**
der Geldhelden-Vertriebsplattform.

Es beschreibt:

- wie das System **gedacht ist**
- wie **Menschen darin arbeiten**
- wo **harte Grenzen** verlaufen

unabhängig von Technologie, Frameworks oder Implementierungsdetails.

> Dieses Dokument ist kein Feature-Backlog.  
> Es ist ein **architektonisches Versprechen**.

---

## 2. Was dieses Dokument ist – und was nicht

### ✅ Dieses Dokument ist:

- ein **internes Architektur-ADR auf sozialer Ebene**
- **verbindlich nach innen**
- Maßstab zur Bewertung von:
  - Code
  - Produktentscheidungen
  - KI-Einsatz
  - Organisationsprozessen

### ❌ Dieses Dokument ist nicht:

- Marketing-Text
- AGB
- rechtlicher Vertrag
- technische Spezifikation
- UI-Konzept

Wenn Code, Prozesse oder KI-Verhalten diesem Dokument widersprechen,
**ist nicht das Dokument falsch – sondern die Umsetzung.**

---

## 3. Rollen – Definition & Verbindlichkeit

### 3.1 Harte, systemische Rollen (RBAC, erzwingbar)

Diese Rollen sind **technisch und organisatorisch bindend**.

#### Vertriebler

- arbeitet mit Leads & Kunden
- führt Gespräche
- stößt Abschlüsse an
- erzeugt provisionsrelevante **Vorgänge**
- trifft **keine** finale Provisionsentscheidung

#### Admin

- verwaltet Plattform, Nutzer und Regeln
- steuert Feature-Flags & KI-Freigaben
- hat **keinen** direkten Einfluss auf einzelne Provisionen

#### Provisionsverantwortlicher

- prüft Provisionsansprüche
- bestätigt oder lehnt ab
- **löst Auszahlungen explizit aus**
- arbeitet strikt auf Basis von **Vorgängen**
- technisch neutral, organisatorisch:
  - intern oder
  - externer Dienstleister

---

### 3.2 Weiche Rollen (Perspektiven, Erfahrungsräume)

Diese Rollen sind **nicht erzwingbar**.

#### Teammitglied (2. Ebene / Downline)

- sieht aggregierte Performance
- erhält Coaching-Feedback
- keine Kontrolle über Leads oder Provisionen

#### Coach / Teamleiter

- analysiert Qualität & Entwicklung
- greift **nicht** operativ ein
- keine direkten Write-Rechte

#### Kunde

- ist **kein Systemnutzer**
- existiert nur als fachliche Entität
- interagiert indirekt über:
  - Gespräche
  - E-Mails
  - Termine

---

## 4. KI-Unterstützung – Governance & Haltung

### 4.1 Grundprinzip

> **KI ist Co-Pilot, niemals Entscheider.**

Die KI:
- empfiehlt
- analysiert
- fasst zusammen
- schlägt vor

Die KI:
- entscheidet **nicht**
- bucht **nichts**
- weist **nichts zu**
- bestätigt **keine Provision**

---

### 4.2 Steuerung der KI

KI-Funktionen sind:

- systemweit steuerbar (Admin / Compliance)
- mandantenfähig
- feature-flag-basiert

Zusätzlich:
- Vertriebler kann KI **situativ deaktivieren**
- kein Nutzungszwang

---

## 5. Gesprächsaufzeichnung & Zustimmung

### Prinzip: Double-Consent

Gesprächsaufzeichnung erfordert:

1. aktive Zustimmung des Kunden
2. aktive Initiierung durch den Vertriebler

Beides wird:
- explizit eingeholt
- als **Vorgang** dokumentiert
- auditierbar gespeichert

---

## 6. Provisionierung – Kontrolle & Vertrauen

### Grundprinzip

> **Provision ist kein Automatismus, sondern ein geprüfter Anspruch.**

Provision entsteht durch:
- Abschluss
- Regelwerk
- Rolle
- dokumentierte Vorgänge

### Leitplanken

- keine automatische Auszahlung
- keine stillen Korrekturen
- jede Entscheidung erzeugt einen neuen Vorgang
- Auszahlung erfolgt extern, aber **Auslösung ist dokumentiert**

---

## 7. Vorgang-Domäne – das Gedächtnis des Systems

Die Vorgang-Domäne ist:

- auditierbares Gedächtnis
- domänenübergreifend
- append-only

Ein Vorgang enthält:
- Ereignistyp
- betroffene Entität
- **Auslöser (Rolle + Akteur)**
- Zeit
- optionale Referenzen

Er enthält **keine**:
- Fachlogik
- Gesprächsinhalte
- Berechnungen

---

## 8. Datenfluss WordPress → Plattform

- WordPress bleibt **führendes System**
- Übergabe nur faktenbasiert
- kein Rückschreiben ohne explizite Schnittstelle
- kein Shared State

---

## 9. Erlebnis-Perspektiven

- Vertriebler: „unterstützt, nicht überwacht"
- Team / Coach: „Entwicklung ohne Mikromanagement"
- Admin: „Rahmen statt Einzelfall"
- Provision: „prüfen, nicht verhandeln"
- Kunde: „verstanden, nicht analysiert"

---

## 10. Änderungsregeln

Dieses Dokument ist **eingefroren**.

Änderungen nur über:
- explizite Revision
- klare Begründung
- Versionssprung

**Stille Anpassungen sind verboten.**

---

**Status: FINAL**
