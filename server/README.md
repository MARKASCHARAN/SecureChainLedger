# Server — Express + JavaScript

This folder contains the **SecureChainLedger** backend API server.

## Stack

- Node.js + Express (**JavaScript**)
- PostgreSQL (Operational Read Models)
- Redis (Cache / Fast Reads)
- RabbitMQ (Async Events)
- Hyperledger Fabric SDK (Blockchain Gateway)

## Getting Started

```bash
npm install
npm run dev
```

## Folder Structure

```
src/
├── config/       # Environment config, DB connections, Fabric gateway
├── controllers/  # Route handlers
├── middleware/   # Auth, RBAC, error handling
├── models/       # Database models / schemas
├── routes/       # Express route definitions
└── services/     # Business logic, Fabric chaincode invocations
```
