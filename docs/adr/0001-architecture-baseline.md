# ADR-0001: Architecture Baseline

## Status

Accepted

## Context

Wir starten ein neues Projekt und benötigen eine solide, vertrauenswürdige Basis für die Entwicklung und den Betrieb von Freihelden.org.

## Decision

Wir entscheiden uns für folgende Architektur-Grundlagen:

### Monorepo-Struktur

- **Vorteile**: 
  - Zentrale Verwaltung aller Abhängigkeiten
  - Einfache Refactorings über Paketgrenzen hinweg
  - Geteilte Typen und Contracts
  - Einheitliche CI/CD-Pipeline

### Schichtenarchitektur

- **Domain**: Reine Business-Logik, keine Abhängigkeiten zu anderen Schichten
- **Application**: Orchestriert Domain-Logik, nutzt Infra und Integrations
- **Infrastructure**: Technische Implementierungen (DB, Cache, etc.)
- **Integrations**: Externe Service-Integrationen
- **Contracts**: Geteilte Schnittstellen und Typen

### Deployment-Strategie

- **VM + Docker Compose**: 
  - Einfache Verwaltung und Wartung
  - Gute Kontrolle über Ressourcen
  - Einfache Rollbacks durch Image-Versionierung
- **GitHub Container Registry (GHCR)**:
  - Nahtlose Integration mit GitHub
  - Versionierte Images
  - Private Registry für sensible Images

### Umgebungen

- **Base**: Lokale Entwicklung und CI/CD-Tests
- **Staging**: Integrationstests und Vorserien-Validierung
- **Production**: Live-Umgebung

## Consequences

### Positive

- Klare Struktur erleichtert Onboarding
- Monorepo ermöglicht schnelle Entwicklung
- Docker Compose vereinfacht lokale Entwicklung
- GHCR bietet zentrale Image-Verwaltung

### Negative

- Monorepo kann bei sehr großem Wachstum komplex werden
- Docker Compose ist nicht für sehr große Skalierung optimiert (kann später auf Kubernetes migriert werden)

### Risiken

- Abhängigkeits-Management muss sorgfältig gehandhabt werden
- Klare Paketgrenzen müssen eingehalten werden

## Notes

Diese Baseline kann bei Bedarf erweitert werden. Weitere ADRs werden spezifischere Entscheidungen dokumentieren.

