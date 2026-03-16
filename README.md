<div align="center">

# SECURE CHAIN LEDGER
### **Enterprise-Grade Permissioned Blockchain for Pharmaceutical Traceability**
**Immutability • Consortium Consensus • Provenance • Compliance**



[![Status](https://img.shields.io/badge/STATUS-ACTIVE-00c2ff?style=flat-square)](#)
[![Network](https://img.shields.io/badge/NETWORK-HYPERLEDGER_FABRIC-2F3134?style=flat-square&logo=hyperledger&logoColor=white)](#)
[![Compliance](https://img.shields.io/badge/COMPLIANCE-CDSCO_READY-white?style=flat-square)](#)

---

### TECHNICAL ARCHITECTURE STACK

| ARCHITECTURAL LAYER | CORE TECHNOLOGIES |
| :--- | :--- |
| **User Interface** | <img src="https://skillicons.dev/icons?i=react,ts,tailwind,redux,vite&theme=light" height="35" /> |
| **Application Logic** | <img src="https://skillicons.dev/icons?i=nodejs,express,ts,npm&theme=light" height="35" /> |
| **Distributed Ledger** | <img src="https://skillicons.dev/icons?i=hyperledger,docker,linux&theme=light" height="35" /> |
| **Systems & Storage** | <img src="https://skillicons.dev/icons?i=postgres,redis,rabbitmq,prometheus,grafana&theme=light" height="35" /> |

---

</div>



## EXECUTIVE OVERVIEW

**SecureChainLedger** is a sophisticated, permissioned blockchain ecosystem engineered to establish a decentralized "Single Source of Truth" within the pharmaceutical supply chain. By integrating an immutable audit trail with real-time operational visibility, the platform mitigates systemic risks associated with counterfeit penetration, inefficient recall protocols, and fragmented data silos.

Our architecture transforms critical supply chain friction into a **highly secure, tamper-proof, and privacy-preserving operational network**, ensuring the integrity of every pharmaceutical unit from point-of-origin to point-of-care.

---

### OPERATIONAL IMPACT

The current pharmaceutical landscape in the Indian subcontinent faces significant challenges regarding batch-level traceability and suspect-product infiltration. **SecureChainLedger** addresses these vulnerabilities by providing an unalterable chain-of-custody. This consortium-driven approach ensures that all participants—manufacturers, distributors, and healthcare providers—operate on a unified, high-fidelity data layer.


## Architecture Diagram


```mermaid
flowchart TD
    %% Custom Styles
    classDef default fill:#f8f9fa,stroke:#ced4da,stroke-width:1px,color:#212529;
    classDef actor fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px;
    classDef app fill:#e0f2fe,stroke:#38bdf8,stroke-width:2px;
    classDef db fill:#dcfce7,stroke:#4ade80,stroke-width:2px;
    classDef infra fill:#f3e8ff,stroke:#c084fc,stroke-width:2px;
    classDef blockchain fill:#fef08a,stroke:#eab308,stroke-width:4px,color:#713f12;

    %% External Actors
    A([" Users <br> (Manufacturer / Distributor / Hospital / Pharmacy)"]):::actor

    %% Group: Application
    subgraph Application ["Application Layer"]
        B[" Frontend UI<br/>React + TypeScript"]:::app
        C[" Backend API Layer<br/>Express + TypeScript"]:::app
    end

    %% Group: Traditional Storage
    subgraph Storage ["Traditional Storage & Data"]
        D[(" PostgreSQL<br/>Operational Read Models")]:::db
        E[(" Redis<br/>Cache / Fast Reads")]:::db
        G[(" Secure Document Storage<br/>Encrypted Object Store / IPFS")]:::db
    end

    %% Group: Async & Monitoring
    subgraph Infrastructure ["Async & Observability"]
        F{{" RabbitMQ / Kafka<br/>Async Events"}}:::infra
        J{{" Monitoring<br/>Prometheus + Grafana"}}:::infra
    end

    %% Group: Blockchain (Highlighted)
    subgraph DLT [" Blockchain Layer"]
        H[[" Hyperledger Fabric Network<br/>Batch • Transfer • Recall • Audit"]]:::blockchain
        I([" Consortium Participants<br/>Authorized Peers"]):::actor
    end

    %% Connections
    A --> B
    B --> C
    
    C --> D
    C --> E
    C --> G
    
    C --> F
    C --> J
    
    %% Highlighted Blockchain Connection
    C == "Executes Smart Contracts" ===> H
    H -. "Consensus & Ledger Sync" .-> I
```

## The Team

<div align="center">

| <a href="https://github.com/MARKASCHARAN"><img src="https://github.com/MARKASCHARAN.png" width="120px;" style="border-radius:50%;" alt="Marka Sai Charan"/><br /><b>Marka Sai Charan</b></a> | <a href="https://github.com/KanishkaSingh-2004"><img src="https://github.com/KanishkaSingh-2004.png" width="120px;" style="border-radius:50%;" alt="Singh Kanishka"/><br /><b>Singh Kanishka</b></a> | <a href="https://github.com/your-username"><img src="https://github.com/github.png" width="120px;" style="border-radius:50%;" alt="Dasari Karthikeya"/><br /><b>Dasari Karthikeya</b></a> | <a href="https://github.com/your-username"><img src="https://github.com/github.png" width="120px;" style="border-radius:50%;" alt="Nuthanakanti Sumanjali"/><br /><b>N. Sumanjali</b></a> |
| :---: | :---: | :---: | :---: |
| [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MARKASCHARAN) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/KanishkaSingh-2004) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username) |

---

</div>

## STRATEGIC USE CASE: END-TO-END TRACEABILITY

The following scenario illustrates a real-world application of the SecureChainLedger protocol within the Indian pharmaceutical corridor, demonstrating the transition from manufacturing genesis to endpoint verification and incident response.

### SCENARIO: HYDERABAD-MUMBAI-PUNE CORRIDOR

| STAKEHOLDER | ACTION & LEDGER IMPACT |
| :--- | :--- |
| **Manufacturer (Hyderabad)** | Initializes **Batch-01**; commits manufacturing metadata and QA certification to the DLT. |
| **Logistics Partner** | Initiates physical transit; Smart Contract locks batch status to "In Transit." |
| **Distributor (Mumbai)** | Executes cryptographic receipt; the ledger updates custody ownership from Manufacturer to Distributor. |
| **Provider (Pune)** | Receives allocated stock at Hospital/Pharmacy; verifies provenance via the SecureChainLedger API. |
| **Regulator (CDSCO)** | Monitors the entire movement lifecycle via a read-only authorized observer node. |

---

## TRANSACTIONAL SEQUENCE FLOW

This diagram illustrates the multi-party interaction and the sequential anchoring of data on the Distributed Ledger.

```mermaid
sequenceDiagram
    autonumber
    participant M as Manufacturer (Hyderabad)
    participant B as Blockchain (Fabric Ledger)
    participant D as Distributor (Mumbai)
    participant H as Hospital/Pharmacy (Pune)

    Note over M, B: Phase I: Genesis
    M->>B: Register Batch & Attach QA Hash
    B-->>M: Success: Block #ID-001 Confirmed

    Note over M, D: Phase II: Custody Transfer
    M->>D: Initiate Shipment (Transfer Intent)
    D->>B: Confirm Receipt (Digital Signature)
    B-->>D: Ownership Transferred

    Note over D, H: Phase III: Allocation
    D->>H: Distribution to Endpoint
    H->>B: Final Verification Scan
    B-->>H: Provenance Authenticated

    Note over B: Phase IV: Incident Response
    rect rgb(200, 0, 0, 0.1)
        B->>H: RECALL ALERT: Batch Flagged
        H->>B: Acknowledge & Quarantine Stock
    end
```

## Why This Project Matters in India

This project addresses a real national and industry-level need.

NITI Aayog’s blockchain strategy work documented a pharmaceutical supply chain pilot with Oracle, Apollo Hospitals, Strides, and GS1 aimed at reducing fake drugs and improving transparency. The Department of Pharmaceuticals also highlighted the importance of an IT-enabled logistics and supply-chain system for real-time medicine distribution to avoid stock-out situations

Fabric’s official documentation explicitly describes it as an **enterprise-grade permissioned distributed ledger**, and its architecture supports private data collections and permissioned membership services that are especially useful for regulated industries and competing businesses sharing a common network. 

##  The Trust Gap
| Feature | Traditional Siloed Systems | SecureChainLedger (Blockchain) |
| :--- | :--- | :--- |
| **Data Ownership** | Controlled by one entity | Shared by the Consortium |
| **Traceability** | Manual reconciliation (Emails/Paper) | Real-time immutable tracking |
| **Counterfeit Risk** | High (Easy to inject fake records) | Low (Cryptographically verified) |
| **Recalls** | Takes days/weeks to locate stock | Near-instant "Targeted Recall" |

## Problem Statement



As a result, the ecosystem faces:

- limited batch-level traceability  
- counterfeit and suspect-product risk  
- weak chain-of-custody proof  
- delayed recalls and investigations  
- fragmented compliance records  
- poor real-time stock visibility  
- dependence on siloed or manually reconciled systems  

Even a single mismatch in logistics data can delay critical medicine movement, weaken trust between supply-chain partners, and increase the risk of unsafe or unverified product flow.

---

## Proposed Solution

SecureChainLedger provides a **shared source of truth** for medicine batch movement across authorized organizations.

The platform records key supply-chain events such as:

- batch creation  
- QA approval references  
- distributor transfers  
- receipt confirmations  
- downstream allocations  
- pharmacy or hospital verification  
- recall notices  
- compliance and audit proofs  

Critical trust events are recorded on **Hyperledger Fabric**, while sensitive documents and operational metadata stay securely off-chain. This hybrid model matches Fabric’s enterprise design around permissioned membership, privacy, and confidential data sharing across regulated participants. :contentReference[oaicite:1]{index=1}



## CORE FUNCTIONAL CAPABILITIES

The SecureChainLedger platform is engineered with a modular feature set designed to enforce strict compliance and data integrity across the pharmaceutical lifecycle.

### FEATURE SPECIFICATIONS

| MODULE | FUNCTIONAL SCOPE |
| :--- | :--- |
| **Batch Genesis** | Immutable registration of product metadata, expiration chronologies, and secure document anchoring. |
| **Custody Protocol** | Cryptographic logging of every stakeholder transition to maintain an unbroken chain-of-custody. |
| **Verification Engine** | Real-time provenance authentication for authorized participants to validate batch legitimacy. |
| **Recall Orchestration** | Precision identification of downstream inventory holders with automated acknowledgement tracking. |
| **Audit Architecture** | Verifiable event logging for instantaneous regulatory reporting and forensic investigations. |
| **Inventory Intelligence** | High-fidelity visibility into stock movement with automated exception and anomaly detection. |
| **Identity & Access** | RBAC (Role-Based Access Control) integrated with permissioned membership services. |
| **Hybrid Throughput** | Optimized read-path architecture utilizing high-speed caches and secondary index models. |

---

## SYSTEM OPERATIONAL WORKFLOW

The following process flow outlines the lifecycle of a pharmaceutical asset within the SecureChainLedger ecosystem, from manufacturing genesis to endpoint verification.

### PHASE I: PROVENANCE ESTABLISHMENT
* **01 | BATCH REGISTRATION:** Manufacturer initializes the asset on the ledger. Metadata is hashed and anchored; heavy documentation is committed to off-chain encrypted storage.
* **02 | QA CERTIFICATION:** Quality Assurance protocols are finalized. A digital attestation is linked to the batch, clearing it for commercial distribution.

### PHASE II: LOGISTICS & CUSTODY
* **03 | CONTROLLED DISPATCH:** Smart contracts validate distributor credentials and batch status before authorizing the transfer of custody.
* **04 | RECEIPT VALIDATION:** Distributors execute a "Confirm Receipt" transaction. Any variance in quantity or condition is recorded as a permanent ledger exception.
* **05 | DOWNSTREAM ALLOCATION:** Assets are decentralized further into the network (Hospitals/Pharmacies), generating incremental custody events on the DLT.

### PHASE III: ENDPOINT & GOVERNANCE
* **06 | AUTHENTICATION:** Healthcare providers perform a final-mile scan. The system verifies the unbroken signature chain and batch expiry status.
* **07 | INCIDENT MANAGEMENT:** In the event of a quality alert, the system performs a reverse-trace to notify all current holders and logs all corrective actions in the audit trail.

---



