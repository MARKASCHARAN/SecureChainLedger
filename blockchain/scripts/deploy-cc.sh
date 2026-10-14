#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CC_NAME="pharma-contract"
CC_VERSION="1.0"
CHANNEL_NAME="pharma-channel"

docker exec securechain-cli peer lifecycle chaincode package ${CC_NAME}.tar.gz \
  --path /opt/gopath/src/github.com/chaincode \
  --lang node \
  --label ${CC_NAME}_${CC_VERSION}

docker exec securechain-cli peer lifecycle chaincode install ${CC_NAME}.tar.gz

echo "Chaincode ${CC_NAME} packaged and installed successfully."
