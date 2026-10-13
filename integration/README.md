# Integration — Tests & Scripts

This folder contains **integration tests**, **end-to-end fixtures**, and **helper scripts** that validate the full SecureChainLedger stack — from API layer through to the Hyperledger Fabric ledger.

## Folder Structure

```
tests/
│   ├── batch.test.ts       # Batch creation & QA approval flows
│   ├── transfer.test.ts    # Custody transfer & receipt confirmation
│   ├── recall.test.ts      # Recall initiation & acknowledgement
│   └── audit.test.ts       # Audit trail query & provenance checks
fixtures/
│   ├── orgs.json           # Test organization identities
│   ├── batches.json        # Sample batch seed data
│   └── wallets/            # Test wallet credentials
scripts/
│   ├── seed.ts             # Seed ledger with fixture data
│   └── run-e2e.sh          # End-to-end test runner
```

## Running Tests

```bash
# Run all integration tests
npm run test:integration

# Run a specific suite
npx ts-node scripts/seed.ts
npx jest tests/batch.test.ts
```
