#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

case "$1" in
  test)
    echo "Running Smart Contract (Chaincode) Vitest Suite..."
    cd "${DIR}/blockchain/chaincode"
    npm test
    ;;
  status)
    echo "Checking SecureChainLedger Infrastructure Status..."
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
    ;;
  stop)
    echo "Stopping SecureChainLedger containers..."
    docker-compose -f "${DIR}/blockchain/network/docker-compose.yml" down
    docker-compose -f "${DIR}/server/docker-compose.yml" down
    echo "All containers stopped."
    ;;
  logs)
    docker logs -f --tail 50 peer0.org1.securechain.com
    ;;
  *)
    "${DIR}/blockchain/scripts/network-up.sh"
    echo "Dashboard URL: http://localhost:3000"
    echo "Backend API:   http://localhost:4000/health"
    ;;
esac
