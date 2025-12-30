#!/usr/bin/env bash
set -euo pipefail

# Default environment
ENV="${ENV:-staging}"

# Compose file paths
COMPOSE_BASE="ops/compose/base/docker-compose.yml"
COMPOSE_ENV="ops/compose/${ENV}/docker-compose.override.yml"

echo "⚠️  WARNING: This resets the environment to a clean state"
echo "ENV: ${ENV}"
echo ""
echo "This will:"
echo "  - Stop all containers"
echo "  - Remove all volumes"
echo "  - Remove orphaned containers"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

echo "=== Resetting Environment (ENV=${ENV}) ==="
echo "Using compose files:"
echo "  - ${COMPOSE_BASE}"
echo "  - ${COMPOSE_ENV}"

docker compose \
  -f "${COMPOSE_BASE}" \
  -f "${COMPOSE_ENV}" \
  down --volumes --remove-orphans

echo "✓ Environment reset complete"

