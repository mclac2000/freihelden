---
# Phase 3 – Fachlicher MVP-Flow (eingefroren)

## Zweck
Dieses Dokument beschreibt den fachlich verbindlichen MVP-Wertstrom der Vertriebsplattform.
Es enthält ausschließlich fachliche Zustände, Ereignisse und Invarianten.
Keine technischen Details. Keine Implementierung.

Dieses Dokument ist eingefroren.
Änderungen sind nur über explizite Revisionen erlaubt.

---

## Globale Leitregeln

1. Jede Zustandsänderung erfolgt durch genau ein Ereignis
2. Jedes Ereignis gehört fachlich genau einer Domäne
3. Ereignisse sind irreversibel (Korrekturen = neue Ereignisse)
4. Kein Ereignis verändert mehrere Domänen gleichzeitig
5. Die zeitliche Reihenfolge aller Ereignisse ist nachvollziehbar

---

## 0. Voraussetzung: Vertriebspartner aktiv

Domäne: Vertriebspartner

Zustände:
- angelegt
- aktiv
- gesperrt

Ereignis:
- SalesPartnerActivated

Invarianten:
- Nur aktive Vertriebspartner dürfen Leads erhalten
- Gesperrte Partner können nichts Neues erzeugen

---

## 1. Lead entsteht

Domäne: Lead

Startzustand:
- neu

Ereignis:
- LeadCreated

Invarianten:
- Ein Lead hat bei Entstehung keinen Vertriebspartner
- Ein Lead gehört noch keinem Kunden

---

## 2. Lead wird zugewiesen

Domäne: Lead

Zustandsübergang:
- neu → zugewiesen

Ereignis:
- LeadAssignedToSalesPartner

Invarianten:
- Genau ein aktiver Vertriebspartner
- Jede Zuweisung ist historisch nachvollziehbar

---

## 3. Lead wird qualifiziert → Kunde entsteht

Domänen:
- Lead
- Kunde

Zustandsübergang Lead:
- zugewiesen → qualifiziert

Ereignisse:
- LeadQualified
- CustomerCreatedFromLead

Invarianten:
- Ein Lead kann nur einmal qualifiziert werden
- Ein Kunde entsteht ausschließlich aus einem qualifizierten Lead
- Qualifikation ist irreversibel

---

## 4. Abschluss wird erfasst

Domäne: Abschluss

Startzustand:
- erfasst

Ereignis:
- DealRecorded

Invarianten:
- Ein Abschluss referenziert genau einen Kunden
- Ein Abschluss referenziert genau einen Vertriebspartner
- Ein Abschluss ist ein Fakt, kein Prozess

---

## 5. Provisionsanspruch entsteht

Domäne: Provision

Startzustand:
- berechnet

Ereignis:
- CommissionClaimCalculated

Invarianten:
- Provision basiert auf Abschluss, Partnerrolle und Regelversion
- Provision ist kein Geldfluss

---

## 6. Provisionsstatus (optional im MVP)

Domäne: Provision

Zustände:
- berechnet
- bestätigt
- storniert

Ereignisse:
- CommissionClaimConfirmed
- CommissionClaimCancelled

Invarianten:
- Statuswechsel sind nachvollziehbar
- Stornierung löscht nichts, sondern ersetzt fachlich

---

## Querschnitt: Vorgang-Domäne

Für jedes fachliche Ereignis existiert genau ein Vorgangseintrag mit:
- Ereignistyp
- Domäne
- Entitätsreferenz
- Auslöser
- Zeitstempel

Invarianten:
- Kein Ereignis ohne Vorgang
- Vorgang enthält keine Fachlogik

---

