#!/bin/bash
set -e

ENV=$1

if [ -z "$ENV" ]; then
  echo "Usage: ./deploy.sh [prod|test]"
  exit 1
fi

ENV_FILE="deploy/.env.$ENV"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found"
  exit 1
fi

echo "Deploying environment: $ENV"
echo "Using env file: $ENV_FILE"

echo "Deploying Traefik..."
docker-compose -f deploy/docker-compose.traefik.yml -p $PROJECT_NAME up -d

# Ensure docker is logged in to GHCR
docker login ghcr.io || true

# Compose project name derived from env
PROJECT_NAME=$(grep PROJECT_NAME "$ENV_FILE" | cut -d '=' -f2)

docker compose \
  --env-file "$ENV_FILE" \
  -p "$PROJECT_NAME" \
  -f deploy/docker-compose.yml \
  pull

docker compose \
  --env-file "$ENV_FILE" \
  -p "$PROJECT_NAME" \
  -f deploy/docker-compose.yml \
  up -d

echo "✅ Deployment complete for $ENV"
