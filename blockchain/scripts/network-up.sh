#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NETWORK_DIR="${DIR}/../network"

cd "${NETWORK_DIR}"

mkdir -p channel-artifacts

if command -v cryptogen >/dev/null 2>&1; then
  if [ ! -d "crypto-config" ]; then
    cryptogen generate --config=./crypto-config.yaml --output="crypto-config"
  fi
fi

if command -v configtxgen >/dev/null 2>&1; then
  export FABRIC_CFG_PATH="${NETWORK_DIR}"
  configtxgen -profile TwoOrgsOrdererGenesis -channelID system-channel -outputBlock ./channel-artifacts/genesis.block
  configtxgen -profile PharmaChannel -outputCreateChannelTx ./channel-artifacts/pharma-channel.tx -channelID pharma-channel
fi

docker-compose -f docker-compose.yml up -d

echo "Fabric network successfully initiated on pharma-channel."
