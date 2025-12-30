# Freihelden.org

## Projektziel

Dieses Repository enthält die vollständige Infrastruktur und Anwendungslogik für Freihelden.org.

**No App, Ops only** - Dieses Repository fokussiert sich zunächst auf die Operations-Infrastruktur. Anwendungs-Code wird später hinzugefügt.

**GitHub ist Single Source of Truth** - Alle Konfigurationen, Skripte und Dokumentation werden in diesem Repository verwaltet.

## Architekturprinzipien

### Isolation
- Klare Trennung zwischen Domänenlogik, Anwendungslogik und Infrastruktur
- Pakete sind isoliert und haben definierte Schnittstellen
- Keine zirkulären Abhängigkeiten zwischen Paketen

### Rollback-First
- Alle Änderungen müssen rollback-fähig sein
- Infrastrukturänderungen werden zuerst in Staging getestet
- Automatisierte Rollback-Prozesse für alle Umgebungen

### Drei Umgebungen
- **Base**: Lokale Entwicklung und CI/CD
- **Staging**: Vorserien-Umgebung für Integrationstests
- **Production**: Live-Umgebung mit höchsten Verfügbarkeitsanforderungen

## Repository-Struktur

```
apps/
  api/                    # API-Anwendung

packages/
  domain/                 # Domänenlogik (Business Rules)
  application/            # Anwendungslogik (Use Cases)
  infra/                  # Infrastruktur-Komponenten
  integrations/           # Externe Integrationen
  contracts/              # API-Verträge und Schnittstellen

ops/
  compose/
    base/                 # Basis Docker Compose Konfiguration
    staging/              # Staging-spezifische Overrides
    prod/                 # Production-spezifische Overrides
  scripts/                # Deployment- und Wartungsskripte
  runbooks/               # Operative Dokumentation

docs/
  adr/                    # Architecture Decision Records
```

## Technologie-Stack

- **Monorepo**: Nx oder Turborepo für Paket-Management
- **Container**: Docker Compose für lokale Entwicklung
- **Registry**: GitHub Container Registry (GHCR) für Images
- **Deployment**: VM-basiert mit Docker Compose

## Erste Schritte

1. Repository klonen
2. Abhängigkeiten installieren: `npm install` (oder entsprechendes Paket-Management)
3. Lokale Umgebung starten: `docker-compose -f ops/compose/base/docker-compose.yml up`

## Weitere Dokumentation

- [Architecture Decision Records](docs/adr/)
- [Runbooks](ops/runbooks/)

