#!/usr/bin/env bash

set -euo pipefail

PKG_PATH="${1:-package.json}"

tmp="$(mktemp)"

jq --tab '
  .dependencies as $deps
  | (.dependenciesMeta // {}) as $meta
  | ($deps | to_entries | map(select(.value | contains("workspace")))) as $ws
  | .dependenciesMeta = (
      $meta + 
      ($ws | reduce .[] as $d ({}; . + {($d.key): {injected: true}}))
    )
' "$PKG_PATH" > "$tmp"

mv "$tmp" "$PKG_PATH"
