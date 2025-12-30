#!/usr/bin/env bash
set -euo pipefail

# Default environment
ENV="${ENV:-staging}"

# Compose file paths
COMPOSE_BASE="ops/compose/base/docker-compose.yml"
COMPOSE_ENV="ops/compose/${ENV}/docker-compose.override.yml"

echo "=== Docker Versions ==="
docker --version
docker compose version

echo ""
echo "=== Resolved Compose Configuration (ENV=${ENV}) ==="
echo "Using compose files:"
echo "  - ${COMPOSE_BASE}"
echo "  - ${COMPOSE_ENV}"
echo ""

docker compose \
  -f "${COMPOSE_BASE}" \
  -f "${COMPOSE_ENV}" \
  config

