import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  DATABASE_URL: z.string().url(),

  FABRIC_CHANNEL_NAME: z.string().default('pharma-channel'),
  FABRIC_CHAINCODE_NAME: z.string().default('securechain-cc'),
  FABRIC_MSP_ID: z.string().default('Org1MSP'),
  FABRIC_PEER_ENDPOINT: z.string().default('grpc://localhost:7051'),
  FABRIC_WALLET_PATH: z.string().default('./blockchain/network/wallets'),
  FABRIC_CONNECTION_PROFILE: z.string().default('./blockchain/network/connection-profile.json'),

  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().default('llama-3.3-70b-versatile'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
