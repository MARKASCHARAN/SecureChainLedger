// src/modules/ledger/ledger.controller.js
import { prisma } from '../../lib/prisma.js';
import { sendSuccess } from '../../lib/response.js';

export async function getLedgerTransactionsHandler(req, res, next) {
  try {
    const transactions = await prisma.ledgerTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        batch: {
          select: {
            id: true,
            batchNumber: true,
            status: true,
            product: { select: { genericName: true, brandName: true } },
          },
        },
      },
    });

    const pendingOutboxCount = await prisma.outboxEvent.count({
      where: { processedAt: null, failedAt: null },
    });

    const processedOutboxCount = await prisma.outboxEvent.count({
      where: { processedAt: { not: null } },
    });

    return sendSuccess(res, {
      transactions,
      outbox: {
        pending: pendingOutboxCount,
        processed: processedOutboxCount,
        channel: process.env.FABRIC_CHANNEL_NAME || 'pharma-channel',
        chaincode: process.env.FABRIC_CHAINCODE_NAME || 'securechain-cc',
        peerEndpoint: process.env.FABRIC_PEER_ENDPOINT || 'grpc://localhost:7051',
      },
    });
  } catch (err) {
    next(err);
  }
}
