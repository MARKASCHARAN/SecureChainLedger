# Infrastructure — Docker, CI/CD & Monitoring

This folder contains all deployment, containerisation, CI/CD pipeline, and observability configuration for **SecureChainLedger**.

## Folder Structure

```
docker/
├── Dockerfile.client         # Frontend production image
├── Dockerfile.server         # Backend API production image
└── Dockerfile.ai             # AI service image

ci-cd/
├── .github/
│   └── workflows/
│       ├── ci.yml            # Lint, test, build on PRs
│       └── deploy.yml        # Deploy to staging / production
└── scripts/
    ├── build.sh
    └── deploy.sh

monitoring/
├── prometheus.yml            # Metrics scrape config
├── grafana/
│   └── dashboards/           # Pre-built Grafana dashboards
└── alertmanager.yml          # Alert routing rules
```

## Services

| Service | Port | Description |
|:---|:---|:---|
| `client` | 3000 | React frontend |
| `server` | 4000 | Express API |
| `ai` | 8000 | FastAPI AI service |
| `postgres` | 5432 | Operational database |
| `redis` | 6379 | Cache layer |
| `rabbitmq` | 5672 / 15672 | Message broker + UI |
| `prometheus` | 9090 | Metrics collector |
| `grafana` | 3001 | Observability dashboards |
| `fabric-peer` | 7051 | Hyperledger Fabric peer |
| `fabric-orderer` | 7050 | Fabric orderer |
