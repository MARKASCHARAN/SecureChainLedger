# Contracts — Hyperledger Fabric Chaincode

This folder contains the **SecureChainLedger** smart contracts (chaincode) and network configuration.

## Stack

- Hyperledger Fabric 2.x
- Go / TypeScript Chaincode
- Docker + Docker Compose
- Fabric network config (crypto-config, channel artifacts)

## Folder Structure

```
chaincode/
├── src/          # Chaincode source (batch, transfer, recall, audit)
│   ├── batch.ts          # Batch genesis & QA certification logic
│   ├── transfer.ts       # Custody transfer protocol
│   ├── recall.ts         # Recall orchestration
│   └── audit.ts          # Audit trail & compliance logging
network/
│   ├── configtx.yaml     # Channel & orderer configuration
│   ├── crypto-config.yaml# Organization & peer MSP config
│   └── docker-compose.yml# Local Fabric network
scripts/
│   ├── network-up.sh     # Bring up local Fabric network
│   ├── network-down.sh   # Tear down local Fabric network
│   └── deploy-cc.sh      # Deploy / upgrade chaincode
```

## Key Chaincode Functions

| Function | Description |
|:---|:---|
| `CreateBatch` | Register a new pharmaceutical batch on the ledger |
| `ApproveBatch` | QA sign-off — clears batch for distribution |
| `TransferCustody` | Transfer ownership between supply-chain participants |
| `ConfirmReceipt` | Distributor/hospital confirms physical receipt |
| `InitiateRecall` | Flag a batch and alert all downstream holders |
| `AcknowledgeRecall` | Holder confirms quarantine of flagged stock |
| `GetBatchHistory` | Full provenance trail for a given batch |
| `QueryBatchesByOwner` | Rich query — all batches owned by an org |
