---
# Phase 4 – Fachliche Commands (Write-Intents)

## Zweck
Dieses Dokument beschreibt alle fachlich erlaubten Schreib-Absichten (Commands)
des MVP-Systems, abgeleitet aus dem eingefrorenen MVP-Flow (Phase 3).

Ein Command ist eine explizite fachliche Intention.
Jeder Command:
- gehört genau einer Domäne
- prüft fachliche Vorbedingungen
- erzeugt genau ein fachliches Ereignis

Keine technischen Details. Keine Implementierung.

---

## Vertriebspartner-Domäne

### Command: ActivateSalesPartner
Zweck:
Aktiviert einen angelegten Vertriebspartner für operative Arbeit.

Vorbedingungen:
- Vertriebspartner existiert
- Vertriebspartner ist nicht gesperrt

Erzeugtes Ereignis:
- SalesPartnerActivated

---

## Lead-Domäne

### Command: CreateLead
Zweck:
Erzeugt einen neuen, unzugewiesenen Lead.

Vorbedingungen:
- Lead-Identifier ist fachlich eindeutig

Erzeugtes Ereignis:
- LeadCreated

---

### Command: AssignLeadToSalesPartner
Zweck:
Weist einen bestehenden Lead einem aktiven Vertriebspartner zu.

Vorbedingungen:
- Lead existiert
- Lead ist nicht qualifiziert
- Vertriebspartner ist aktiv

Erzeugtes Ereignis:
- LeadAssignedToSalesPartner

---

### Command: QualifyLead
Zweck:
Qualifiziert einen zugewiesenen Lead und stößt die Kundenerstellung an.

Vorbedingungen:
- Lead existiert
- Lead ist zugewiesen
- Lead ist noch nicht qualifiziert

Erzeugte Ereignisse:
- LeadQualified
- CustomerCreatedFromLead

---

## Kunden-Domäne

(Hinweis: Kunden werden im MVP ausschließlich durch Lead-Qualifikation erzeugt.
Es existiert kein eigenständiger Create-Command.)

---

## Abschluss-Domäne

### Command: RecordDeal
Zweck:
Erfasst einen wirtschaftlichen Abschluss für einen Kunden.

Vorbedingungen:
- Kunde existiert
- Vertriebspartner existiert
- Vertriebspartner ist verantwortlich für den Kunden

Erzeugtes Ereignis:
- DealRecorded

---

## Provisions-Domäne

### Command: CalculateCommissionClaim
Zweck:
Berechnet einen Provisionsanspruch für einen Abschluss.

Vorbedingungen:
- Abschluss existiert
- Abschluss ist nicht storniert
- Provisionsregelversion ist bekannt

Erzeugtes Ereignis:
- CommissionClaimCalculated

---

### Command: ConfirmCommissionClaim
Zweck:
Bestätigt einen berechneten Provisionsanspruch.

Vorbedingungen:
- Provisionsanspruch existiert
- Provisionsanspruch ist im Status "berechnet"

Erzeugtes Ereignis:
- CommissionClaimConfirmed

---

### Command: CancelCommissionClaim
Zweck:
Storniert einen bestehenden Provisionsanspruch.

Vorbedingungen:
- Provisionsanspruch existiert
- Provisionsanspruch ist nicht bereits storniert

Erzeugtes Ereignis:
- CommissionClaimCancelled

---

## Globale Invarianten

- Kein Command verändert mehrere Domänen gleichzeitig
- Kein Command ohne expliziten Auslöser (Partner/Admin/System)
- Jeder Command erzeugt mindestens ein fachliches Ereignis
- Jeder Event erzeugt einen Vorgangseintrag

---

