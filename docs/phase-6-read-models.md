---
# Phase 6 – Read-Modelle (MVP)

## Zweck
Dieses Dokument definiert die fachlichen Read-Modelle (Sichten)
des MVP-Systems.

Read-Modelle sind rein lesend.
Sie enthalten keine Schreiblogik, keine Commands
und keine eigene fachliche Wahrheit.

Alle Informationen stammen ausschließlich aus:
- Zuständen der Domänen
- fachlichen Ereignissen (Phase 3)
- abgeleiteten Statuswerten

---

## Rolle: Vertriebspartner

### Read-Modell: Eigene Lead-Pipeline

Zweck:
Übersicht aller dem Vertriebspartner zugewiesenen Leads.

Enthält:
- Lead-Identifier
- aktueller Lead-Status
- Zuweisungszeitpunkt
- Quelle des Leads

Enthält NICHT:
- andere Vertriebspartner
- Kommunikationsinhalte
- historische Zustandswechsel

---

### Read-Modell: Eigene Kundenübersicht

Zweck:
Übersicht aller eigenen Kunden.

Enthält:
- Kunde-Identifier
- aktueller Kundenstatus
- Anzahl zugehöriger Abschlüsse

Enthält NICHT:
- fremde Kunden
- Vertragsdetails
- Provisionsregeln

---

### Read-Modell: Eigene Abschlüsse

Zweck:
Übersicht aller erfassten Abschlüsse.

Enthält:
- Abschluss-Identifier
- Kunde
- Abschlussdatum
- Abschlussstatus

Enthält NICHT:
- Zahlungsstatus
- Storno-Begründungen
- Provisionsberechnung

---

### Read-Modell: Eigene Provisionsansprüche

Zweck:
Transparenz über eigene Provisionsansprüche.

Enthält:
- Provisionsanspruch-Identifier
- zugehöriger Abschluss
- aktueller Provisionsstatus
- Berechnungszeitpunkt

Enthält NICHT:
- Auszahlungsinformationen
- Steuerinformationen
- interne Regelparameter

---

## Rolle: Admin

### Read-Modell: Vertriebspartner-Übersicht

Zweck:
Steuerung und Kontrolle der aktiven Vertriebspartner.

Enthält:
- Vertriebspartner-Identifier
- Status (aktiv / gesperrt)
- Anzahl zugewiesener Leads
- Anzahl Abschlüsse

Enthält NICHT:
- persönliche Notizen
- Kommunikationsinhalte

---

### Read-Modell: Lead-Verteilung

Zweck:
Transparenz über Lead-Zuweisungen.

Enthält:
- Lead-Identifier
- Status
- zugewiesener Vertriebspartner
- Zeitpunkt der Zuweisung

Enthält NICHT:
- Lead-Historie im Detail
- Kommunikationsdaten

---

### Read-Modell: Provisionskontrolle

Zweck:
Überblick über alle Provisionsansprüche.

Enthält:
- Provisionsanspruch-Identifier
- Vertriebspartner
- Abschluss
- aktueller Status

Enthält NICHT:
- Auszahlungsdaten
- Buchhaltungsinformationen

---

## Rolle: System

### Read-Modell: Regelbasierte Auswertungen

Zweck:
Unterstützung automatisierter, regelbasierter Entscheidungen.

Enthält:
- aggregierte Statusinformationen
- referenzierte Regelversionen

Enthält NICHT:
- personenbezogene Detaildaten
- UI-orientierte Darstellungen

---

## Globale Regeln für Read-Modelle

- Read-Modelle sind immer ableitbar
- Keine Seiteneffekte
- Keine Commands
- Keine impliziten Statusänderungen
- Jede Sicht ist einer Rolle zugeordnet

---

