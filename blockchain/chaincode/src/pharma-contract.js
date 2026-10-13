// blockchain/chaincode/src/pharma-contract.js
// Hyperledger Fabric Smart Contract for Pharmaceutical Supply Chain Tracking.
// Written in pure JavaScript using fabric-contract-api.

'use strict';

const { Contract } = require('fabric-contract-api');

class PharmaLedgerContract extends Contract {
  constructor() {
    super('PharmaLedgerContract');
  }

  /**
   * Helper to construct a ledger key for a batch.
   */
  _batchKey(batchNumber) {
    return `BATCH_${batchNumber}`;
  }

  /**
   * Helper to format tx timestamp to ISO string.
   */
  _getTimestamp(ctx) {
    try {
      const txTimestamp = ctx.stub.getTxTimestamp();
      if (txTimestamp && txTimestamp.seconds) {
        const millis = (txTimestamp.seconds.low || txTimestamp.seconds) * 1000;
        return new Date(millis).toISOString();
      }
    } catch {
      // fallback
    }
    return new Date().toISOString();
  }

  /**
   * InitLedger initializes the ledger with optional genesis information.
   */
  async InitLedger(ctx) {
    console.info('============= Initializing SecureChainLedger Contract =============');
    return JSON.stringify({ status: 'initialized', timestamp: this._getTimestamp(ctx) });
  }

  /**
   * BatchExists checks if a batch with given batchNumber exists in world state.
   */
  async BatchExists(ctx, batchNumber) {
    const key = this._batchKey(batchNumber);
    const batchBytes = await ctx.stub.getState(key);
    return batchBytes && batchBytes.length > 0;
  }

  /**
   * CreateBatch anchors a new manufactured batch on the ledger.
   */
  async CreateBatch(
    ctx,
    batchNumber,
    productId,
    manufacturerOrg,
    quantity,
    unitPrice,
    manufacturedAt,
    expiresAt,
    qaDocHash = ''
  ) {
    if (!batchNumber || !productId || !manufacturerOrg || !quantity) {
      throw new Error('CreateBatch: missing required parameters (batchNumber, productId, manufacturerOrg, quantity)');
    }

    const exists = await this.BatchExists(ctx, batchNumber);
    if (exists) {
      throw new Error(`CreateBatch: batch '${batchNumber}' already exists on the ledger.`);
    }

    const timestamp = this._getTimestamp(ctx);
    const parsedQty = parseInt(quantity, 10);
    const parsedPrice = parseFloat(unitPrice) || 0;

    if (isNaN(parsedQty) || parsedQty <= 0) {
      throw new Error(`CreateBatch: invalid quantity '${quantity}', must be a positive integer.`);
    }

    const batch = {
      docType: 'batch',
      batchNumber,
      productId,
      manufacturerOrg,
      currentOwnerOrg: manufacturerOrg,
      quantity: parsedQty,
      unitPrice: parsedPrice,
      manufacturedAt: manufacturedAt || timestamp,
      expiresAt: expiresAt || '',
      qaDocHash: qaDocHash || '',
      status: 'CREATED',
      transfers: [],
      recalls: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const key = this._batchKey(batchNumber);
    await ctx.stub.putState(key, Buffer.from(JSON.stringify(batch)));

    // Emit event
    ctx.stub.setEvent(
      'BATCH_CREATED',
      Buffer.from(JSON.stringify({ batchNumber, productId, manufacturerOrg, quantity: parsedQty }))
    );

    return JSON.stringify(batch);
  }

  /**
   * ApproveBatch records QA sign-off and certifies the batch for distribution.
   */
  async ApproveBatch(ctx, batchNumber, qaDocHash = '') {
    const batch = await this._getBatchObject(ctx, batchNumber);

    if (batch.status !== 'CREATED' && batch.status !== 'PENDING_QA') {
      throw new Error(`ApproveBatch: batch status '${batch.status}' cannot be approved.`);
    }

    const timestamp = this._getTimestamp(ctx);
    batch.status = 'APPROVED';
    if (qaDocHash) {
      batch.qaDocHash = qaDocHash;
    }
    batch.approvedAt = timestamp;
    batch.updatedAt = timestamp;

    const key = this._batchKey(batchNumber);
    await ctx.stub.putState(key, Buffer.from(JSON.stringify(batch)));

    ctx.stub.setEvent(
      'BATCH_APPROVED',
      Buffer.from(JSON.stringify({ batchNumber, qaDocHash: batch.qaDocHash, approvedAt: timestamp }))
    );

    return JSON.stringify(batch);
  }

  /**
   * TransferCustody initiates custody handover from current owner to a downstream receiver.
   */
  async TransferCustody(ctx, batchNumber, transferId, toOrg, quantity, notes = '') {
    if (!transferId || !toOrg || !quantity) {
      throw new Error('TransferCustody: missing transferId, toOrg, or quantity.');
    }

    const batch = await this._getBatchObject(ctx, batchNumber);

    if (batch.status !== 'APPROVED' && batch.status !== 'IN_TRANSIT' && batch.status !== 'DELIVERED') {
      throw new Error(`TransferCustody: batch in status '${batch.status}' is not eligible for custody transfer.`);
    }

    const xferQty = parseInt(quantity, 10);
    if (isNaN(xferQty) || xferQty <= 0) {
      throw new Error(`TransferCustody: invalid quantity '${quantity}'.`);
    }

    if (batch.currentOwnerOrg === toOrg) {
      throw new Error('TransferCustody: cannot transfer custody to the current owner.');
    }

    const timestamp = this._getTimestamp(ctx);
    const transferRecord = {
      transferId,
      fromOrg: batch.currentOwnerOrg,
      toOrg,
      quantity: xferQty,
      notes: notes || '',
      status: 'INITIATED',
      initiatedAt: timestamp,
    };

    batch.transfers = batch.transfers || [];
    batch.transfers.push(transferRecord);
    batch.status = 'IN_TRANSIT';
    batch.updatedAt = timestamp;

    const key = this._batchKey(batchNumber);
    await ctx.stub.putState(key, Buffer.from(JSON.stringify(batch)));

    ctx.stub.setEvent(
      'CUSTODY_TRANSFERRED',
      Buffer.from(JSON.stringify({ batchNumber, transferId, fromOrg: transferRecord.fromOrg, toOrg, quantity: xferQty }))
    );

    return JSON.stringify(batch);
  }

  /**
   * ConfirmReceipt records receipt and transitions current ownership to the receiver.
   */
  async ConfirmReceipt(ctx, batchNumber, transferId, notes = '') {
    const batch = await this._getBatchObject(ctx, batchNumber);

    const transfer = (batch.transfers || []).find((t) => t.transferId === transferId);
    if (!transfer) {
      throw new Error(`ConfirmReceipt: transferId '${transferId}' not found for batch '${batchNumber}'.`);
    }

    if (transfer.status !== 'INITIATED') {
      throw new Error(`ConfirmReceipt: transfer '${transferId}' is already in status '${transfer.status}'.`);
    }

    const timestamp = this._getTimestamp(ctx);
    transfer.status = 'CONFIRMED';
    transfer.confirmedAt = timestamp;
    if (notes) {
      transfer.confirmationNotes = notes;
    }

    batch.currentOwnerOrg = transfer.toOrg;
    batch.status = 'DELIVERED';
    batch.updatedAt = timestamp;

    const key = this._batchKey(batchNumber);
    await ctx.stub.putState(key, Buffer.from(JSON.stringify(batch)));

    ctx.stub.setEvent(
      'RECEIPT_CONFIRMED',
      Buffer.from(JSON.stringify({ batchNumber, transferId, newOwnerOrg: batch.currentOwnerOrg, confirmedAt: timestamp }))
    );

    return JSON.stringify(batch);
  }

  /**
   * InitiateRecall flags a batch as recalled across all nodes in the supply chain.
   */
  async InitiateRecall(ctx, batchNumber, reason, severity = 'CLASS_I', initiatedByOrg = '') {
    if (!reason) {
      throw new Error('InitiateRecall: reason is required.');
    }

    const batch = await this._getBatchObject(ctx, batchNumber);
    const timestamp = this._getTimestamp(ctx);

    const recallRecord = {
      reason,
      severity,
      initiatedByOrg: initiatedByOrg || batch.manufacturerOrg,
      recalledAt: timestamp,
      status: 'INITIATED',
      acknowledgements: [],
    };

    batch.recalls = batch.recalls || [];
    batch.recalls.push(recallRecord);
    batch.status = 'RECALLED';
    batch.updatedAt = timestamp;

    const key = this._batchKey(batchNumber);
    await ctx.stub.putState(key, Buffer.from(JSON.stringify(batch)));

    ctx.stub.setEvent(
      'RECALL_INITIATED',
      Buffer.from(JSON.stringify({ batchNumber, reason, severity, initiatedByOrg: recallRecord.initiatedByOrg }))
    );

    return JSON.stringify(batch);
  }

  /**
   * AcknowledgeRecall records a supply chain participant's quarantine action.
   */
  async AcknowledgeRecall(ctx, batchNumber, holderOrg, quarantinedQty = 0, notes = '') {
    if (!holderOrg) {
      throw new Error('AcknowledgeRecall: holderOrg is required.');
    }

    const batch = await this._getBatchObject(ctx, batchNumber);

    if (batch.status !== 'RECALLED') {
      throw new Error(`AcknowledgeRecall: batch '${batchNumber}' is not currently in RECALLED status.`);
    }

    const activeRecall = (batch.recalls || []).slice(-1)[0];
    if (!activeRecall) {
      throw new Error(`AcknowledgeRecall: no active recall record found for batch '${batchNumber}'.`);
    }

    const timestamp = this._getTimestamp(ctx);
    activeRecall.acknowledgements = activeRecall.acknowledgements || [];
    activeRecall.acknowledgements.push({
      holderOrg,
      quarantinedQty: parseInt(quarantinedQty, 10) || 0,
      notes: notes || '',
      acknowledgedAt: timestamp,
    });

    batch.updatedAt = timestamp;

    const key = this._batchKey(batchNumber);
    await ctx.stub.putState(key, Buffer.from(JSON.stringify(batch)));

    ctx.stub.setEvent(
      'RECALL_ACKNOWLEDGED',
      Buffer.from(JSON.stringify({ batchNumber, holderOrg, quarantinedQty, acknowledgedAt: timestamp }))
    );

    return JSON.stringify(batch);
  }

  /**
   * QueryBatch returns the full current state of a batch.
   */
  async QueryBatch(ctx, batchNumber) {
    const key = this._batchKey(batchNumber);
    const batchBytes = await ctx.stub.getState(key);

    if (!batchBytes || batchBytes.length === 0) {
      throw new Error(`QueryBatch: batch '${batchNumber}' does not exist.`);
    }

    return batchBytes.toString('utf8');
  }

  /**
   * GetBatchHistory retrieves the complete immutable transaction history for a batch.
   */
  async GetBatchHistory(ctx, batchNumber) {
    const key = this._batchKey(batchNumber);
    const iterator = await ctx.stub.getHistoryForKey(key);
    const history = [];

    let result = await iterator.next();
    while (!result.done) {
      const record = {
        txId: result.value.txId,
        timestamp: result.value.timestamp,
        isDelete: result.value.isDelete,
        value: null,
      };

      if (result.value.value && result.value.value.length > 0) {
        try {
          record.value = JSON.parse(result.value.value.toString('utf8'));
        } catch {
          record.value = result.value.value.toString('utf8');
        }
      }

      history.push(record);
      result = await iterator.next();
    }

    await iterator.close();
    return JSON.stringify(history);
  }

  /**
   * Internal helper to load and parse a batch from state.
   */
  async _getBatchObject(ctx, batchNumber) {
    const key = this._batchKey(batchNumber);
    const batchBytes = await ctx.stub.getState(key);

    if (!batchBytes || batchBytes.length === 0) {
      throw new Error(`Batch '${batchNumber}' does not exist on the ledger.`);
    }

    return JSON.parse(batchBytes.toString('utf8'));
  }
}

module.exports = PharmaLedgerContract;
