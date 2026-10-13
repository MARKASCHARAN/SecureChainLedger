# AI — Intelligence & Analytics

This folder contains the **SecureChainLedger** AI/ML services for anomaly detection, predictive analytics, and supply-chain intelligence.

## Capabilities

| Module | Description |
|:---|:---|
| **Anomaly Detection** | Detect suspicious transfer patterns, counterfeit injection attempts, and outlier batch behaviour |
| **Predictive Analytics** | Forecast demand, stock shortages, and recall propagation paths |
| **Provenance Scoring** | Risk-score each batch based on custody chain integrity |
| **NLP Audit Insights** | Summarize audit trails and flag compliance gaps |

## Stack

- **Node.js + Express** (**JavaScript**) — AI service REST interface
- TensorFlow.js / ONNX Runtime (anomaly models)
- PostgreSQL + Redis (feature store)

## Folder Structure

```
src/
├── anomaly-detection/    # Isolation Forest, LSTM-based anomaly models
├── analytics/            # Dashboard metrics, KPIs, trend analysis
├── models/               # Trained model artifacts
└── services/             # FastAPI service layer, inference endpoints
```

## Getting Started

```bash
npm install
npm run dev
```
