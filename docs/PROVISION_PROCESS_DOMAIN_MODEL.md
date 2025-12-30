# PROVISION_PROCESS_DOMAIN_MODEL.md

**Status:** FINAL – FACHLICH EINGEFROREN  
**Gültig für:** Produkt, Technik, Organisation  
**Abhängigkeit:** ARCHITECTURAL_GUARDRAILS_AND_BOUNDARIES.md

---

## 1. Zweck dieses Dokuments

Dieses Dokument beschreibt den **fachlichen Provisionsprozess**
der Geldhelden-Vertriebsplattform.

Es definiert:
- Provisionsarten
- Provisionsschemata
- Zustände
- Rollen
- Zahlungsrealität
- Haltefristen
- Vorgänge

ohne technische oder finanzielle Implementierungsdetails.

---

## 2. Grundprinzip

> **Provision ist ein geprüfter, zeitverzögerter Anspruch – kein Automatismus.**

Ein Provisionsanspruch:
- kann entstehen, bevor Geld eingegangen ist
- wird niemals automatisch ausgezahlt
- unterliegt einer Haltefrist
- ist jederzeit auditierbar

---

## 3. Provisionsquellen

### 3.1 Shop-Produkte (WooCommerce)

- Quelle: WordPress / WooCommerce
- Beispiele:
  - Produktverkäufe
  - Bezahlte Beratungscalls (z. B. 60 Minuten)
- Zahlungsstatus:
  - gilt als **EINGEGANGEN**, sobald WooCommerce Zahlung bestätigt
- Provisionsfreigabe:
  - automatisch nach Zahlung
  - Auszahlung erst nach Haltefrist

---

### 3.2 Investments

- Quelle: Externe Investmentanbieter
- Investment wird manuell erfasst:
  - Kunde
  - Investmenttyp
  - Betrag
- Zahlungsstatus initial:
  - **NICHT_EINGEGANGEN**
- Freigabe:
  - erst nach expliziter Bestätigung des Zahlungseingangs bei Geldhelden

---

## 4. Provisionsschemata

Provisionen werden **nicht fest im Code definiert**.

Sie folgen konfigurierbaren **Provisionsschemata**, z. B.:

### 4.1 Single-Level-Provision
- z. B. fester Prozentsatz für eigenen Abschluss

### 4.2 Multi-Level-Provision
- mehrere Ebenen
- Beispielkonfiguration:
  - Level 0: 10 %
  - Level 1: 5 %
  - Level 2: 1 %
- Anzahl Ebenen und Sätze sind variabel

### 4.3 Umsatzbeteiligung
- z. B. 50 % Anteil an Erlösen eines Beratungscalls
- Basis ist der aktuelle Produktpreis

Alle Sätze, Kosten und Ebenen:
- sind konfigurierbar
- versioniert
- zeitlich gültig

---

## 5. Leadkosten & Kostenverrechnung

- Leads verursachen Kosten
- Kosten werden:
  - nicht separat bezahlt
  - sondern mit Provisionsansprüchen verrechnet
- Höhe der Leadkosten ist variabel

---

## 6. Zustände eines Provisionsanspruchs

Ein Provisionsanspruch kennt folgende Zustände:

1. ENTSTANDEN  
2. IN_PRÜFUNG  
3. BESTÄTIGT  
4. ABGELEHNT  
5. KORREKTUR_ERFORDERLICH  
6. AUSZAHLUNG_AUSGELÖST  

---

## 7. Haltefrist

- Jeder Provisionsanspruch unterliegt einer Haltefrist (z. B. 30 Tage)
- Während der Haltefrist:
  - Anspruch ist sichtbar
  - Auszahlung ist gesperrt

---

## 8. Vorgänge (auditierbar)

Jede relevante Aktion erzeugt einen Vorgang, z. B.:

- PROVISION_CLAIM_CREATED
- PROVISION_REVIEW_STARTED
- PROVISION_APPROVED
- PROVISION_REJECTED
- PROVISION_CORRECTION_REQUESTED
- COMMISSION_PAYOUT_TRIGGERED

Alle Vorgänge:
- sind append-only
- enthalten Auslöser (Rolle + Akteur)
- sind unveränderlich

---

## 9. Explizite Nicht-Ziele

Dieses Modell definiert nicht:
- konkrete Prozentsätze
- Berechnungsformeln
- Auszahlungstechnik
- Steuerlogik
- Buchhaltung

---

## 10. Änderungsregeln

Dieses Dokument ist **fachlich eingefroren**.

Änderungen nur über:
- explizite Revision
- Begründung
- Versionssprung

---

**Ende des Dokuments**

