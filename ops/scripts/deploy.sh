#!/usr/bin/env bash
set -euo pipefail

# Default environment
ENV="${ENV:-staging}"

# Compose file paths
COMPOSE_BASE="ops/compose/base/docker-compose.yml"
COMPOSE_ENV="ops/compose/${ENV}/docker-compose.override.yml"

echo "=== Deployment Configuration ==="
echo "ENV: ${ENV}"
echo "Compose files:"
echo "  - ${COMPOSE_BASE}"
echo "  - ${COMPOSE_ENV}"

echo ""
echo "=== Resolved Compose Configuration ==="
docker compose \
  -f "${COMPOSE_BASE}" \
  -f "${COMPOSE_ENV}" \
  config

echo ""
echo "⚠️  No services defined – nothing deployed"

