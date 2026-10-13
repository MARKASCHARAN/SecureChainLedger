// blockchain/chaincode/test/pharma-contract.test.js
// Unit tests for PharmaLedgerContract using mocked Fabric ChaincodeStub.

import { describe, it, expect, beforeEach } from 'vitest';
import PharmaLedgerContract from '../src/pharma-contract.js';

describe('PharmaLedgerContract', () => {
  let contract;
  let ctx;
  let worldState;
  let eventsEmitted;

  beforeEach(() => {
    contract = new PharmaLedgerContract();
    worldState = new Map();
    eventsEmitted = [];

    // Mock Fabric Context and ChaincodeStub
    ctx = {
      stub: {
        getState: async (key) => {
          return worldState.has(key) ? worldState.get(key) : Buffer.from('');
        },
        putState: async (key, val) => {
          worldState.set(key, Buffer.from(val));
        },
        setEvent: (eventName, payload) => {
          eventsEmitted.push({ eventName, payload: JSON.parse(payload.toString('utf8')) });
        },
        getTxTimestamp: () => ({
          seconds: { low: 1700000000 },
        }),
        getHistoryForKey: async (key) => {
          const val = worldState.get(key);
          const entries = val
            ? [
                {
                  txId: 'tx-001',
                  timestamp: { seconds: 1700000000 },
                  isDelete: false,
                  value: val,
                },
              ]
            : [];
          let index = 0;
          return {
            next: async () => {
              if (index < entries.length) {
                return { value: entries[index++], done: false };
              }
              return { done: true };
            },
            close: async () => {},
          };
        },
      },
    };
  });

  describe('InitLedger', () => {
    it('initializes the ledger', async () => {
      const result = await contract.InitLedger(ctx);
      const parsed = JSON.parse(result);
      expect(parsed.status).toBe('initialized');
    });
  });

  describe('CreateBatch', () => {
    it('creates a new batch and emits BATCH_CREATED event', async () => {
      const res = await contract.CreateBatch(
        ctx,
        'BATCH-001',
        'PROD-101',
        'AcmePharma',
        1000,
        15.5,
        '2026-10-01T00:00:00Z',
        '2028-10-01T00:00:00Z',
        'hash-abc-123'
      );

      const batch = JSON.parse(res);
      expect(batch.batchNumber).toBe('BATCH-001');
      expect(batch.manufacturerOrg).toBe('AcmePharma');
      expect(batch.currentOwnerOrg).toBe('AcmePharma');
      expect(batch.quantity).toBe(1000);
      expect(batch.status).toBe('CREATED');

      const exists = await contract.BatchExists(ctx, 'BATCH-001');
      expect(exists).toBe(true);

      expect(eventsEmitted).toHaveLength(1);
      expect(eventsEmitted[0].eventName).toBe('BATCH_CREATED');
      expect(eventsEmitted[0].payload.batchNumber).toBe('BATCH-001');
    });

    it('rejects duplicate batch creation', async () => {
      await contract.CreateBatch(ctx, 'BATCH-001', 'PROD-101', 'AcmePharma', 1000, 15.5);

      await expect(
        contract.CreateBatch(ctx, 'BATCH-001', 'PROD-101', 'AcmePharma', 500, 15.5)
      ).rejects.toThrow(/already exists/i);
    });

    it('rejects invalid quantity', async () => {
      await expect(
        contract.CreateBatch(ctx, 'BATCH-002', 'PROD-101', 'AcmePharma', -10, 15.5)
      ).rejects.toThrow(/invalid quantity/i);
    });
  });

  describe('ApproveBatch', () => {
    it('approves a created batch and records QA hash', async () => {
      await contract.CreateBatch(ctx, 'BATCH-001', 'PROD-101', 'AcmePharma', 1000, 15.5);

      const res = await contract.ApproveBatch(ctx, 'BATCH-001', 'qa-cert-hash-999');
      const batch = JSON.parse(res);

      expect(batch.status).toBe('APPROVED');
      expect(batch.qaDocHash).toBe('qa-cert-hash-999');
      expect(batch.approvedAt).toBeTruthy();

      const approvedEvent = eventsEmitted.find((e) => e.eventName === 'BATCH_APPROVED');
      expect(approvedEvent).toBeTruthy();
      expect(approvedEvent.payload.qaDocHash).toBe('qa-cert-hash-999');
    });

    it('rejects approving a non-existent batch', async () => {
      await expect(contract.ApproveBatch(ctx, 'NON-EXISTENT')).rejects.toThrow(/does not exist/i);
    });
  });

  describe('TransferCustody & ConfirmReceipt', () => {
    beforeEach(async () => {
      await contract.CreateBatch(ctx, 'BATCH-001', 'PROD-101', 'AcmePharma', 1000, 15.5);
      await contract.ApproveBatch(ctx, 'BATCH-001', 'qa-hash');
    });

    it('initiates custody transfer', async () => {
      const res = await contract.TransferCustody(
        ctx,
        'BATCH-001',
        'XFER-001',
        'MedDistributor',
        500,
        'Cold-chain dispatched'
      );
      const batch = JSON.parse(res);

      expect(batch.status).toBe('IN_TRANSIT');
      expect(batch.transfers).toHaveLength(1);
      expect(batch.transfers[0].fromOrg).toBe('AcmePharma');
      expect(batch.transfers[0].toOrg).toBe('MedDistributor');
      expect(batch.transfers[0].quantity).toBe(500);

      const event = eventsEmitted.find((e) => e.eventName === 'CUSTODY_TRANSFERRED');
      expect(event).toBeTruthy();
      expect(event.payload.transferId).toBe('XFER-001');
    });

    it('rejects transfer to own organization', async () => {
      await expect(
        contract.TransferCustody(ctx, 'BATCH-001', 'XFER-002', 'AcmePharma', 200)
      ).rejects.toThrow(/cannot transfer custody to the current owner/i);
    });

    it('confirms receipt and updates currentOwnerOrg', async () => {
      await contract.TransferCustody(ctx, 'BATCH-001', 'XFER-001', 'MedDistributor', 500);

      const res = await contract.ConfirmReceipt(ctx, 'BATCH-001', 'XFER-001', 'Inspected and verified');
      const batch = JSON.parse(res);

      expect(batch.status).toBe('DELIVERED');
      expect(batch.currentOwnerOrg).toBe('MedDistributor');
      expect(batch.transfers[0].status).toBe('CONFIRMED');

      const event = eventsEmitted.find((e) => e.eventName === 'RECEIPT_CONFIRMED');
      expect(event).toBeTruthy();
      expect(event.payload.newOwnerOrg).toBe('MedDistributor');
    });
  });

  describe('InitiateRecall & AcknowledgeRecall', () => {
    beforeEach(async () => {
      await contract.CreateBatch(ctx, 'BATCH-001', 'PROD-101', 'AcmePharma', 1000, 15.5);
      await contract.ApproveBatch(ctx, 'BATCH-001', 'qa-hash');
    });

    it('initiates recall and flags the batch as RECALLED', async () => {
      const res = await contract.InitiateRecall(
        ctx,
        'BATCH-001',
        'Impurity detected in stability testing',
        'CLASS_I',
        'CDSCO_Regulator'
      );
      const batch = JSON.parse(res);

      expect(batch.status).toBe('RECALLED');
      expect(batch.recalls).toHaveLength(1);
      expect(batch.recalls[0].reason).toMatch(/impurity/i);
      expect(batch.recalls[0].severity).toBe('CLASS_I');

      const event = eventsEmitted.find((e) => e.eventName === 'RECALL_INITIATED');
      expect(event).toBeTruthy();
    });

    it('holder acknowledges recall and records quarantined quantity', async () => {
      await contract.InitiateRecall(ctx, 'BATCH-001', 'Critical recall', 'CLASS_I', 'FDA');

      const res = await contract.AcknowledgeRecall(
        ctx,
        'BATCH-001',
        'CityHospital',
        150,
        'Moved 150 units to quarantine area'
      );
      const batch = JSON.parse(res);

      expect(batch.recalls[0].acknowledgements).toHaveLength(1);
      expect(batch.recalls[0].acknowledgements[0].holderOrg).toBe('CityHospital');
      expect(batch.recalls[0].acknowledgements[0].quarantinedQty).toBe(150);

      const event = eventsEmitted.find((e) => e.eventName === 'RECALL_ACKNOWLEDGED');
      expect(event).toBeTruthy();
    });
  });

  describe('QueryBatch & GetBatchHistory', () => {
    it('queries batch and retrieves history', async () => {
      await contract.CreateBatch(ctx, 'BATCH-001', 'PROD-101', 'AcmePharma', 1000, 15.5);

      const queried = await contract.QueryBatch(ctx, 'BATCH-001');
      const batch = JSON.parse(queried);
      expect(batch.batchNumber).toBe('BATCH-001');

      const historyStr = await contract.GetBatchHistory(ctx, 'BATCH-001');
      const history = JSON.parse(historyStr);
      expect(history).toHaveLength(1);
      expect(history[0].txId).toBe('tx-001');
      expect(history[0].value.batchNumber).toBe('BATCH-001');
    });
  });
});
