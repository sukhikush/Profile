# resume
static site for resume

## How Do the Services Communicate with Each Other?
#### Note
- This can be scaled by deployment in K8s, refer to below diagram
```mermaid
    graph LR
        MDS[Multiple Data Sources<br/>APIs, Databases, etc.]
        S3FD[S3 Bucket<br>Raw File Storage]

        subgraph TDI[Data Ingestion]
            KC(Kafka Connect<br>S3 Source Connector)
            AK(Kafka Message Broker)
        end
        subgraph TRTP[Real-Time Processing]
            AF{Apache Flink<br>Stream & Batch Processing}
        end
        subgraph TDS[Data Storage]
            R(Redis Cache)
            MD(MongoDB)
            PS(PostgreSQL)
        end

        subgraph Monitoring & Alerting
            ELK(ELK Stack<br>Elasticsearch, Logstash, Kibana)
        end

        S3FD -->|Stream Files| KC
        MDS -->|Push Data| AK
        KC --> AK
        AK --> AF
        AF --> |Caching frequent acess data|R
        R <-->|Unstructured Data| MD
        R <-->|Structured Data| PS
        AF -.->|Logs & Metrics| ELK
        AK -.->|Logs & Metrics| ELK
        R -.->|Logs & Metrics| ELK
        MD -.->|Logs & Metrics| ELK
        PS -.->|Logs & Metrics| ELK
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
