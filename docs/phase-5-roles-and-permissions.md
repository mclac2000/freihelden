---
# Phase 5 – Rollen & Command-Berechtigungen (MVP)

## Zweck
Dieses Dokument definiert die fachlichen Rollen des Systems
und legt fest, welche Commands aus Phase 4 von welchen Rollen
ausgeführt werden dürfen.

Kein Command darf ohne explizite Rollenfreigabe existieren.
Alles, was nicht erlaubt ist, ist verboten.

Keine technischen Details. Keine Implementierung.

---

## Rollenübersicht

### 1. Vertriebspartner
Operative Rolle für Beratung, Abschluss und Betreuung von Kunden.

### 2. Admin
Interne Rolle von Freihelden/Geldhelden zur Steuerung, Kontrolle und Freigabe.

### 3. System
Technische Rolle für automatisierte, regelbasierte Vorgänge.
Kein menschlicher Akteur.

---

## Command-Berechtigungen

### Vertriebspartner

Erlaubte Commands:
- CreateLead
- AssignLeadToSalesPartner (nur auf eigene Leads)
- QualifyLead
- RecordDeal
- CalculateCommissionClaim (nur für eigene Abschlüsse)

Nicht erlaubt:
- ActivateSalesPartner
- ConfirmCommissionClaim
- CancelCommissionClaim

---

### Admin

Erlaubte Commands:
- ActivateSalesPartner
- AssignLeadToSalesPartner (beliebig)
- ConfirmCommissionClaim
- CancelCommissionClaim

Nicht erlaubt:
- CreateLead
- QualifyLead
- RecordDeal
- CalculateCommissionClaim

---

### System

Erlaubte Commands:
- CalculateCommissionClaim

Bedingungen:
- Nur regelbasiert
- Kein manueller Trigger
- Immer mit Vorgangseintrag

Nicht erlaubt:
- Alle anderen Commands

---

## Globale Regeln

- Jeder Command benötigt einen expliziten Auslöser (Rolle)
- Commands ohne Rollenfreigabe sind unzulässig
- Rollen dürfen nicht dynamisch erweitert werden
- Änderungen an Rollen oder Berechtigungen erfordern eine explizite Revision

---

