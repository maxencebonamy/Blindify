#!/bin/bash
set -e

ENV_FILE="deploy/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found"
  exit 1
fi

echo "🎯 Deploying..."

# Ensure docker is logged in to GHCR
docker login ghcr.io || true

docker compose \
  --env-file "$ENV_FILE" \
  -p "blindify" \
  -f deploy/docker-compose.yml \
  --pull always
  up -d

echo "✅ Deployed successfully"
