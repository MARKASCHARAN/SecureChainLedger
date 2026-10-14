#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${DIR}/../.."
NETWORK_DIR="${DIR}/../network"

cd "${ROOT_DIR}"
docker-compose -f server/docker-compose.yml up -d

cd "${NETWORK_DIR}"
mkdir -p channel-artifacts

if [ ! -d "crypto-config" ]; then
  docker run --rm -v "${NETWORK_DIR}:/opt/network" hyperledger/fabric-tools:2.5 cryptogen generate --config=/opt/network/crypto-config.yaml --output=/opt/network/crypto-config
fi

docker-compose -f docker-compose.yml up -d

echo ""
echo "=========================================================================="
echo " SecureChainLedger — Full Stack & Blockchain Network is Active"
echo "=========================================================================="
echo ""
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
