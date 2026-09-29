#!/bin/sh
# Create the Zenith tables and load the sample games.
# Run from anywhere: sudo bash scripts/load-sample-data.sh
set -eu
cd "$(CDPATH= cd -- "$(dirname "$0")" && pwd)/.."
docker compose --profile setup run --rm setup
