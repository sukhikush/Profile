# resume
static site for resume

## How Does the Service Comuicate with each other
#### Note
- This can be scaled by deployment in K8s, refer to below diagram
```mermaid
    graph LR
        MDS[Multiple Data Sources]
        S3FD[S3 Bucket File Dump]

        subgraph TDI[Data Ingestion]
            KC(Kafka Connect S3 Source Connector)
            AK(Kafka)
        end
        subgraph TRTP[Real-Time Processing]
            AF{Apache Flink}
        end
        subgraph TDS[Data Storage]
            R(Redis Cache)
            MD(MongoDB)
            PS(PostgreSQL)
        end

        subgraph Monitoring & Alerting
            ELK(Elasticsearch, Logstash, Kibana)
        end

        S3FD -->|Stream File| KC
        MDS -->|Data| AK
        KC --> AK
        AK --> AF
        AF --> R
        R <--> MD
        R <--> PS
        AF -.->|Monitoring logs| ELK
        AK -.->|Monitoring logs| ELK
        R -.->|Monitoring logs| ELK
        MD -.->|Monitoring logs| ELK
        PS -.->|Monitoring logs| ELK
```
## How Does Kubernetes Deployment for above service look like?
#### Note
- We can have multiple Regions for High Availibity
- Also we can have **multiple replicas of Pods in diffrent Worker Node**, managed by K8s
- Below digram we have **only 1 node for easy of understanding**
```mermaid
    graph TB
        subgraph "Data Sources"
            DS1[Source 1]
            DS2[Source 2]
            DS3[Source 3]
        end
        
        LB[Load Balancer]

        subgraph R1[Region 1]
            subgraph KC1[K8s Cluster]
                ING1[Ingress Controller]
                subgraph KCN11[Node 1]
                    K1[Kafka - Data Ingest]
                    F1[Flink - Real Time Process]
                    RR11[Redis Cache Replica]
                    RMDB11[MongoDB Replica]
                    RPG11[PostgreSQL Replica]
                    ELK1[ELK Stack]
                end
            end
        end

        subgraph "Storage Layer Primary"
            R[Redis Cache]
            MDB1[MongoDB]
            PG1[PostgreSQL]
        end

        DS1 & DS2 & DS3 -->|Data| LB
        LB --> ING1
        ING1 --> K1
        RR11 -.-> R
        RMDB11 -.-> MDB1
        RPG11 -.-> PG1
        K1 --> F1
        F1 --> RR11
        RR11 --> RMDB11
        RR11 --> RPG11
        K1 -.-> ELK1
        F1 -.-> ELK1
        RR11 -.-> ELK1
        RMDB11 -.-> ELK1
        RPG11 -.-> ELK1
```
