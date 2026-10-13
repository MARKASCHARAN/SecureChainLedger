// src/modules/ai/ai.controller.js
import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../lib/errors.js';
import { sendSuccess } from '../../lib/response.js';
import { evaluateBatchAi } from './ai.service.js';

export async function getBatchAiAnalysisHandler(req, res, next) {
  try {
    const { batchNumber } = req.params;

    const batch = await prisma.batch.findUnique({
      where: { batchNumber },
      include: {
        manufacturer: { select: { id: true, name: true, status: true, country: true } },
        transfers: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            senderId: true,
            receiverId: true,
            quantity: true,
            status: true,
            createdAt: true,
            receivedAt: true,
          },
        },
      },
    });

    if (!batch) {
      throw new NotFoundError(`Batch '${batchNumber}' not found.`);
    }

    const logs = await prisma.verificationLog.findMany({
      where: { batchId: batch.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        ipAddress: true,
        createdAt: true,
        result: true,
      },
    });

    const aiReport = await evaluateBatchAi(batch, batch.transfers, logs);
    return sendSuccess(res, aiReport);
  } catch (err) {
    next(err);
  }
}
