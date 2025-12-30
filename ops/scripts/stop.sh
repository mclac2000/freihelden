#!/usr/bin/env bash
set -euo pipefail

# Default environment
ENV="${ENV:-staging}"

# Compose file paths
COMPOSE_BASE="ops/compose/base/docker-compose.yml"
COMPOSE_ENV="ops/compose/${ENV}/docker-compose.override.yml"

echo "=== Stopping Services (ENV=${ENV}) ==="
echo "Using compose files:"
echo "  - ${COMPOSE_BASE}"
echo "  - ${COMPOSE_ENV}"

docker compose \
  -f "${COMPOSE_BASE}" \
  -f "${COMPOSE_ENV}" \
  down

echo "✓ Services stopped (idempotent)"

