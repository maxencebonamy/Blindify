#!/bin/bash
set -e

ENV_FILE="deploy/.env"

read -p "⚙️ Select environment (prod/test): " ENV
if [[ "$ENV" != "prod" && "$ENV" != "test" ]]; then
  echo "❌ Invalid environment"
  exit 1
fi

read -p "🏷️ Tag: " TAG
if [[ -z "$TAG" ]]; then
  echo "❌ Empty tag"
  exit 1
fi

if [[ "$ENV" == "prod" ]]; then
  sed -i -E "s|^FRONTEND_TAG=.*|FRONTEND_TAG=$TAG|" "$ENV_FILE"
  sed -i -E "s|^BACKEND_TAG=.*|BACKEND_TAG=$TAG|" "$ENV_FILE"
else
  sed -i -E "s|^FRONTEND_TEST_TAG=.*|FRONTEND_TEST_TAG=$TAG|" "$ENV_FILE"
  sed -i -E "s|^BACKEND_TEST_TAG=.*|BACKEND_TEST_TAG=$TAG|" "$ENV_FILE"
fi

echo "✅ Version updated: $ENV -> $TAG"

.deploy/deploy.sh
