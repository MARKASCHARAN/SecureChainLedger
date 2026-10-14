#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NETWORK_DIR="${DIR}/../network"

cd "${NETWORK_DIR}"

docker-compose -f docker-compose.yml down --volumes --remove-orphans

rm -rf channel-artifacts

echo "Fabric network containers and artifacts cleaned up."
