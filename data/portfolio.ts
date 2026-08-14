export type VisualKind =
  | "conclave"
  | "tracepilot"
  | "fraud"
  | "civiclens"
  | "ipo";

export type ProjectSlug =
  | "conclave"
  | "tracepilot"
  | "real-time-fraud-detection"
  | "civiclens"
  | "indian-ipo-analytics";

export interface ProjectMetric {
  readonly value: string;
  readonly label: string;
  readonly detail?: string;
}

export interface ProjectDecision {
  readonly title: string;
  readonly choice: string;
  readonly rationale: string;
  readonly tradeoff?: string;
}

export interface HomepageProjectEvidence {
  readonly label: string;
  readonly statement: string;
}

export interface ProjectArtifact {
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  readonly sourceUrl: string;
}

export interface ArchitectureStep {
  readonly id: string;
  readonly label: string;
  readonly detail?: string;
  readonly kind: "source" | "process" | "decision" | "output";
}

export interface Project {
  readonly slug: ProjectSlug;
  readonly index: string;
  readonly title: string;
  readonly subtitle: string;
  readonly summary: string;
  readonly repository: string;
  readonly demoUrl?: string;
  readonly artifact?: ProjectArtifact;
  readonly ownershipNote?: string;
  readonly status: string;
  readonly role: string;
  readonly problem: string;
  readonly constraints: readonly string[];
  readonly decisions: readonly ProjectDecision[];
  readonly validation: readonly string[];
  readonly limitations: readonly string[];
  readonly domain: string;
  readonly stack: readonly string[];
  readonly metrics: readonly ProjectMetric[];
  readonly overview: readonly string[];
  readonly highlights: readonly string[];
  readonly architecture: readonly ArchitectureStep[];
  readonly visualKind: VisualKind;
  readonly seoDescription: string;
}

export interface Experience {
  readonly id: string;
  readonly company: string;
  readonly role: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly period: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly stack: readonly string[];
  readonly note?: string;
}

export interface CapabilityGroup {
  readonly id: string;
  readonly label: string;
  readonly technologies: readonly string[];
}

export type CapabilityDomain =
  | "systems"
  | "data"
  | "intelligence"
  | "product";

export interface CapabilityRelationship {
  readonly technology: string;
  readonly from: CapabilityDomain;
  readonly to: CapabilityDomain;
  readonly rationale: string;
}

export interface Portfolio {
  readonly identity: {
    readonly fullName: string;
    readonly displayName: string;
    readonly initials: string;
    readonly location: string;
    readonly timezone: string;
    readonly email: string;
    readonly descriptor: string;
    readonly headline: string;
    readonly introduction: string;
  };
  readonly links: {
    readonly email: string;
    readonly github: string;
    readonly linkedin: string;
    readonly website: string;
  };
  readonly navigation: readonly {
    readonly label: string;
    readonly href: string;
  }[];
  readonly education: {
    readonly institution: string;
    readonly degree: string;
    readonly field: string;
    readonly startDate: string;
    readonly endDate: string;
    readonly period: string;
    readonly cgpa: string;
    readonly location: string;
  };
  readonly experiences: readonly Experience[];
  readonly capabilities: {
    readonly groups: readonly CapabilityGroup[];
    readonly relationships: readonly CapabilityRelationship[];
  };
  readonly projects: readonly Project[];
  readonly metadata: {
    readonly siteUrl: string;
    readonly title: string;
    readonly titleTemplate: string;
    readonly description: string;
    readonly locale: string;
  };
  readonly about: string;
  readonly contact: {
    readonly heading: string;
    readonly copy: string;
  };
}

export const portfolio = {
  identity: {
    fullName: "Aayush Kumar Tiwari",
    displayName: "Aayush Tiwari",
    initials: "AT",
    location: "Mumbai, India",
    timezone: "Asia/Kolkata",
    email: "aayushkumar345@gmail.com",
    descriptor: "Backend Systems / Data Infrastructure / Applied AI",
    headline: "I build backend and data systems that keep AI behavior inspectable.",
    introduction:
      "Based in Mumbai, I build backend platforms, streaming pipelines, and applied AI systems with explicit operational boundaries.",
  },
  links: {
    email: "mailto:aayushkumar345@gmail.com",
    github: "https://github.com/aayushtiwari845",
    linkedin: "https://www.linkedin.com/in/aayushktiwari/",
    website: "https://aayushktiwari.tech",
  },
  navigation: [
    { label: "Experience", href: "/#experience" },
    { label: "Work", href: "/#work" },
    { label: "Capabilities", href: "/#capabilities" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
    { label: "Résumé", href: "/resume" },
  ],
  education: {
    institution: "K.J. Somaiya School of Engineering",
    degree: "B.Tech",
    field: "Artificial Intelligence & Data Science",
    startDate: "2023-08",
    endDate: "2027-07",
    period: "Aug 2023 — Jul 2027",
    cgpa: "9.71",
    location: "Mumbai, India",
  },
  experiences: [
    {
      id: "barclays-technology-developer",
      company: "Barclays",
      role: "Technology Developer Intern",
      startDate: "2026-06",
      endDate: "2026-08",
      period: "June 2026 — August 2026",
      summary:
        "Helped move a sanctions-screening platform from proof of concept toward a scalable, configuration-driven system spanning engineering design, processing workflows, and operational tooling.",
      highlights: [
        "Participated in system-design proposals with engineering and project stakeholders, translating operational requirements into architecture and workflow.",
        "Built and iteratively evolved a Python, FastAPI, React, and TypeScript platform capable of processing files with 80M+ records across DEV, UAT, and pre-production environments.",
        "Implemented configurable ingestion, validation, normalisation, clustering, candidate generation, rules, and decision-merging stages.",
        "Built run monitoring, warnings, timelines, and paginated outputs for the operational dashboard.",
        "Added run-scoped isolation, bearer authentication, RBAC, audit logging, and Pytest-based testing.",
      ],
      stack: ["Python", "FastAPI", "React", "TypeScript", "Pytest"],
      note:
        "Public copy is limited to résumé-level scope and does not imply Barclays endorsement.",
    },
    {
      id: "makeflow-backend-developer",
      company: "Makeflow India",
      role: "Backend Developer Intern",
      startDate: "2025-09",
      endDate: "2025-11",
      period: "September 2025 — November 2025",
      summary:
        "Refactored a Node.js backend for an AI counselling product, separating inference from session state and simplifying a four-stage conversational workflow.",
      highlights: [
        "Reduced inter-service coupling by approximately 40% and code redundancy by approximately 30%.",
        "Implemented keyword-triggered crisis routing with a routing decision under 100 ms.",
        "Built a profile-aware returning-user workflow that removed redundant onboarding for approximately 60% of repeat sessions.",
      ],
      stack: ["Node.js", "JavaScript", "REST APIs"],
      note:
        "Scope: backend routing and product workflow engineering, not clinical decision-making.",
    },
    {
      id: "segmentriq-data-analytics",
      company: "Segmentriq Analytics",
      role: "Data Analytics Intern",
      startDate: "2024-12",
      endDate: "2025-01",
      period: "December 2024 — January 2025",
      summary:
        "Built SQL-based ETL and analytics workflows that consolidated operational data into a normalized warehouse and decision-ready Power BI reporting.",
      highlights: [
        "Integrated 5+ source systems into a normalized, fact-and-dimension data warehouse.",
        "Delivered 3+ Power BI dashboards with 15+ custom DAX measures for revenue, churn, and funnel analysis.",
        "Reduced ad-hoc reporting turnaround by approximately 35% and improved refresh time by approximately 25% through query and model optimization.",
      ],
      stack: ["SQL", "ETL", "Data Warehousing", "Power BI", "DAX"],
      note: undefined,
    },
  ],
  capabilities: {
    groups: [
      {
        id: "languages",
        label: "Languages",
        technologies: ["Python", "Java", "C++", "SQL", "TypeScript", "JavaScript"],
      },
      {
        id: "backend-systems",
        label: "Backend & Systems",
        technologies: ["FastAPI", "Spring Boot", "Node.js", "REST APIs", "Pytest"],
      },
      {
        id: "data-streaming",
        label: "Data & Streaming",
        technologies: [
          "Apache Spark",
          "PySpark",
          "Kafka",
          "Pandas",
          "NumPy",
          "Data Warehousing",
          "ETL",
        ],
      },
      {
        id: "ai-ml",
        label: "AI / ML",
        technologies: [
          "PyTorch",
          "TensorFlow",
          "LangChain",
          "Spark MLlib",
          "MLflow",
          "LLM systems",
        ],
      },
      {
        id: "databases-infrastructure",
        label: "Databases / Infrastructure",
        technologies: [
          "PostgreSQL",
          "MySQL",
          "Redis",
          "Docker",
          "Kubernetes",
          "Linux",
        ],
      },
      {
        id: "frontend-product",
        label: "Frontend / Product",
        technologies: ["React", "TypeScript"],
      },
      {
        id: "core-cs",
        label: "Core CS",
        technologies: [
          "Data Structures & Algorithms",
          "OOP",
          "DBMS",
          "Operating Systems",
          "Computer Networks",
          "Distributed Systems",
          "Software Design",
        ],
      },
    ],
    relationships: [
      {
        technology: "Kafka",
        from: "systems",
        to: "data",
        rationale: "Carries durable event streams between services and data processing.",
      },
      {
        technology: "FastAPI",
        from: "systems",
        to: "product",
        rationale: "Exposes backend workflows through typed, product-facing APIs.",
      },
      {
        technology: "PyTorch",
        from: "data",
        to: "intelligence",
        rationale: "Turns prepared data into trainable and evaluable model behavior.",
      },
      {
        technology: "PostgreSQL",
        from: "systems",
        to: "data",
        rationale: "Provides transactional storage for data-intensive services.",
      },
    ],
  },
  projects: [
    {
      slug: "conclave",
      index: "01",
      title: "CONCLAVE",
      subtitle: "Multi-Agent LLM Decision System",
      summary:
        "A research-oriented Indian mutual-fund ranking system that combines public data, role-specialised agents, deterministic consensus behavior, and evaluation tooling.",
      repository: "https://github.com/aayushtiwari845/Consensus-AI",
      artifact: {
        src: "/project-artifacts/conclave-dashboard.png",
        alt: "CONCLAVE Streamlit dashboard showing the mutual-fund decision system interface.",
        caption:
          "The repository's Streamlit interface exposes fund evidence, agent sessions, comparisons, and investor-profile reranking across six tabs.",
        sourceUrl: "https://github.com/aayushtiwari845/Consensus-AI",
      },
      status: "Research prototype",
      role:
        "Repository owner and primary implementer of the research pipeline, evaluation tooling, and dashboard.",
      problem:
        "Compare role-specialised consensus with simpler mutual-fund ranking baselines without presenting a research interface as financial advice.",
      constraints: [
        "The current 86-fund snapshot contains surviving Indian open-ended equity funds and is subject to survivorship bias.",
        "Available NAV history begins in 2013, so the persisted multi-vintage study covers a predominantly bullish market regime.",
        "Live ingestion depends on AMFI, MFAPI, RBI/manual inputs, and yfinance availability.",
        "LLM calls are optional and non-deterministic; heuristic and mock fallbacks are required for reproducible offline runs.",
      ],
      decisions: [
        {
          title: "Separate evidence from model judgement",
          choice:
            "Engineer return, risk, cost, and consistency objectives before asking four role-specialised agents to rank candidates.",
          rationale:
            "Every agent receives the same bounded fund evidence while its role changes the priority applied to that evidence.",
          tradeoff:
            "The role prompts are deliberately prescriptive, so the agents are closer to specialised rerankers than unconstrained analysts.",
        },
        {
          title: "Keep a deterministic decision path",
          choice:
            "Aggregate proposals with explicit consensus and fallback logic instead of delegating the final result to one free-form response.",
          rationale:
            "Offline runs remain reproducible when a provider is unavailable and negotiation decisions can be replayed.",
          tradeoff:
            "Fallback-heavy runs cannot be treated as evidence of LLM reasoning quality.",
        },
        {
          title: "Evaluate against simple baselines",
          choice:
            "Backtest consensus alongside mean-of-objectives, five-year CAGR, random, and bottom-five controls.",
          rationale:
            "A complex agent workflow should be compared with inexpensive ranking rules before claiming an advantage.",
        },
      ],
      validation: [
        "The repository includes automated tests, backtesting scripts, evaluation baselines, and persisted research reports.",
        "The multi-vintage analysis covers 36 paired vintage/category cells; its reported consensus-versus-simple-baseline effect is directional but not significant at the two-sided 0.05 level.",
        "The Streamlit application exposes six tabs for inspecting funds, sessions, comparisons, and investor-profile reranking.",
      ],
      limitations: [
        "The repository explicitly excludes real-money execution, financial advice, hosted deployment, and guaranteed live-data availability.",
        "Historical TER data is unavailable in the snapshot, category-specific benchmark history is incomplete, and external CRISIL/Value Research validation is not persisted.",
        "The LLM study uses a single local model and mostly single-round negotiation; trained adapter inference was not evaluated end to end.",
        "The dashboard does not yet surface the multi-vintage backtest summary.",
      ],
      domain: "Applied AI / Multi-Agent Systems",
      stack: [
        "Python",
        "Ollama",
        "Qwen2.5-7B",
        "Gemini",
        "Pandas",
        "NumPy",
        "SciPy",
        "Streamlit",
      ],
      metrics: [
        {
          value: "4",
          label: "role-specialised agents",
          detail: "Independent roles contribute to the ranking decision.",
        },
        {
          value: "20+",
          label: "fund metrics",
          detail: "Features assembled from public market and economic sources.",
        },
        {
          value: "6",
          label: "dashboard tabs",
          detail: "A Streamlit interface supports interactive exploration.",
        },
      ],
      overview: [
        "CONCLAVE ingests public mutual-fund and economic data from AMFI, MFAPI, yfinance, and RBI sources, then turns it into a feature set covering more than 20 fund metrics.",
        "Four role-specialised LLM agents can run through Gemini or local Ollama/Qwen2.5-7B providers. Their outputs feed deterministic consensus and fallback behavior before evaluation, backtesting, and six-tab Streamlit exploration.",
      ],
      highlights: [
        "Provider-agnostic LLM inference across Gemini and Ollama/Qwen2.5-7B.",
        "Four specialised agents evaluate the same engineered fund evidence from distinct roles.",
        "Deterministic consensus and fallback behavior keeps the final workflow explicit.",
        "Evaluation and backtesting are part of the system rather than detached demonstrations.",
        "The interface presents the pipeline through an interactive six-tab Streamlit dashboard.",
      ],
      architecture: [
        {
          id: "conclave-data",
          label: "Public data sources",
          detail: "AMFI, MFAPI, yfinance, and RBI data",
          kind: "source",
        },
        {
          id: "conclave-ingestion",
          label: "Ingestion",
          detail: "Collect and normalize source material",
          kind: "process",
        },
        {
          id: "conclave-features",
          label: "Feature engine",
          detail: "Build 20+ fund metrics",
          kind: "process",
        },
        {
          id: "conclave-agents",
          label: "Four specialised agents",
          detail: "Provider-agnostic Gemini or Ollama/Qwen2.5-7B inference",
          kind: "process",
        },
        {
          id: "conclave-consensus",
          label: "Consensus",
          detail: "Deterministic decision and fallback behavior",
          kind: "decision",
        },
        {
          id: "conclave-evaluation",
          label: "Evaluation",
          detail: "Backtesting and result analysis",
          kind: "process",
        },
        {
          id: "conclave-dashboard",
          label: "Dashboard",
          detail: "Six-tab Streamlit exploration",
          kind: "output",
        },
      ],
      visualKind: "conclave",
      seoDescription:
        "Explore CONCLAVE, Aayush Tiwari's multi-agent LLM system for evidence-driven Indian mutual-fund ranking, deterministic consensus, and evaluation.",
    },
    {
      slug: "tracepilot",
      index: "02",
      title: "TracePilot",
      subtitle: "Evidence-grounded incident investigation for distributed systems",
      summary:
        "An incident-response platform that correlates metrics, logs, traces, topology, and change evidence into auditable root-cause rankings and evidence-cited diagnoses.",
      repository: "https://github.com/aayushtiwari845/TracePilot",
      status: "Feature-complete local system and hosted-demo template",
      role:
        "Sole public repository contributor; designed and implemented the application, evaluation gates, safety boundaries, and deployment template.",
      problem:
        "Turn fragmented incident telemetry into reviewable root-cause candidates without allowing a diagnostic model or public demo to become an unrestricted remediation control plane.",
      constraints: [
        "Telemetry collection uses fixed, bounded, read-only queries and persists immutable checksummed bundles before analysis.",
        "The learned models are trained on generated laboratory incidents, not real production incidents.",
        "Experiments and the single recovery action run only through separately trusted local workers with closed, typed interfaces.",
        "The hosted profile is a deployment template; it has not been deployed to a cloud provider or measured under production load.",
      ],
      decisions: [
        {
          title: "Replay immutable evidence",
          choice:
            "Store checksum-addressed telemetry bundles in MinIO and perform RCA against replayed artifacts rather than querying live systems during analysis.",
          rationale:
            "An investigation can be reproduced and its evidence remains tied to the incident window that produced it.",
          tradeoff:
            "Collection failures and missing signals stay visible; the system does not silently backfill them from a later live state.",
        },
        {
          title: "Gate learned models against a deterministic baseline",
          choice:
            "Retain the root-cause ranker as an unpromoted candidate when its held-out result underperforms the graph baseline.",
          rationale:
            "A passing absolute score is insufficient when a simpler deterministic method performs better.",
        },
        {
          title: "Close the action surface",
          choice:
            "Expose seven read-only investigations and one typed, human-approved local recovery action instead of arbitrary shell, Kubernetes, or provider commands.",
          rationale:
            "Diagnosis and recovery remain separate reviewable capabilities with a bounded blast radius.",
          tradeoff:
            "The safety boundary intentionally limits automation and is not a general remediation framework.",
        },
      ],
      validation: [
        "The repository records passing lint, strict type checking, backend/frontend tests, production builds, deterministic OpenAPI export, and eight Compose-backed integration tests.",
        "A generated 180-incident laboratory dataset evaluates the ranker at Top-1 0.854 and the deterministic baseline at Top-1 1.0; the ranker correctly remains ineligible for promotion.",
        "The production profile validation, deterministic security scan, PostgreSQL backup/restore test, and local Kind readiness checks are documented as passing.",
        "The bounded localhost liveness smoke test completed 40/40 requests with p50 52.628 ms and p95 97.919 ms; it is not a capacity benchmark.",
      ],
      limitations: [
        "No real incident corpus, telemetry shift study, privacy review, fairness assessment, threshold tuning, or production SLO evidence exists.",
        "The checked-in models cover five synthetic fault classes and must not be used for operational decision-making.",
        "The hosted template still requires provider-managed secrets, TLS, ingress controls, durable object storage, and digest-specific vulnerability scanning.",
        "The Kubernetes and Chaos Mesh environment is a local Kind laboratory, not a production deployment target.",
      ],
      domain: "Observability / Distributed Systems",
      stack: [
        "Python",
        "FastAPI",
        "Next.js",
        "PostgreSQL",
        "pgvector",
        "Redis",
        "MLflow",
        "Kubernetes",
        "Prometheus",
        "Loki",
        "Jaeger",
        "OpenTelemetry",
        "MinIO",
      ],
      metrics: [
        {
          value: "5",
          label: "evidence channels",
          detail: "Metrics, logs, traces, topology, and change evidence are correlated.",
        },
        {
          value: "Auditable",
          label: "root-cause ranking",
          detail: "Diagnoses retain evidence citations for review.",
        },
      ],
      overview: [
        "TracePilot brings service topology and operational telemetry into one incident context, correlating Prometheus metrics, Loki logs, Jaeger traces, and change evidence.",
        "The platform ranks plausible root causes, retrieves runbooks, cites supporting evidence, and tracks model evaluation and human feedback. Reproducible Kubernetes fault experiments and controlled sandbox recovery keep investigation behavior testable and reviewable.",
      ],
      highlights: [
        "Correlates metrics, logs, traces, topology, and change evidence around an incident.",
        "Produces ranked root-cause candidates with evidence-cited diagnoses.",
        "Retrieves runbook context and records human feedback for subsequent evaluation.",
        "Tracks model evaluation through MLflow.",
        "Supports reproducible Kubernetes fault experiments and controlled sandbox recovery.",
        "Keeps investigation outputs auditable rather than presenting an opaque answer.",
      ],
      architecture: [
        {
          id: "tracepilot-service-graph",
          label: "Service graph",
          detail: "Distributed-system topology and alert context",
          kind: "source",
        },
        {
          id: "tracepilot-incident",
          label: "Incident",
          detail: "Unifies the active investigation scope",
          kind: "process",
        },
        {
          id: "tracepilot-evidence",
          label: "Evidence correlation",
          detail: "Logs, metrics, traces, topology, and changes",
          kind: "process",
        },
        {
          id: "tracepilot-ranking",
          label: "Root-cause ranking",
          detail: "Orders candidate causes against collected evidence",
          kind: "decision",
        },
        {
          id: "tracepilot-diagnosis",
          label: "Evidence-cited diagnosis",
          detail: "Returns auditable conclusions and runbook context",
          kind: "output",
        },
      ],
      visualKind: "tracepilot",
      seoDescription:
        "Explore TracePilot, Aayush Tiwari's distributed-systems incident platform for telemetry correlation, auditable root-cause ranking, and evidence-cited diagnosis.",
    },
    {
      slug: "real-time-fraud-detection",
      index: "03",
      title: "Real-Time Fraud Detection Pipeline",
      subtitle: "Streaming inference under severe class imbalance",
      summary:
        "A collaborative Kafka and Spark Structured Streaming pipeline benchmarked for high-throughput fraud scoring with a compact feature set.",
      repository: "https://github.com/aditya-ravi11/realtime-fraud-detection-qiea",
      artifact: {
        src: "/project-artifacts/fraud-streaming-latency.png",
        alt: "Streaming latency chart from the collaborative real-time fraud-detection benchmark.",
        caption:
          "Latency output from the repository's simulated local streaming replay; it is experimental evidence, not a production payment-system benchmark.",
        sourceUrl:
          "https://github.com/aditya-ravi11/realtime-fraud-detection-qiea",
      },
      ownershipNote:
        "Academic collaboration with Aditya Ravi and Atharva Indulkar; the public repository is owned by Aditya Ravi and does not imply sole ownership by Aayush.",
      status: "Academic prototype with a simulated streaming benchmark",
      role:
        "Named project co-author; individual implementation ownership is not documented in the public repository.",
      problem:
        "Study whether an aggressively reduced fraud feature set can preserve ranking quality while lowering inference cost under severe class imbalance.",
      constraints: [
        "The experiment uses the public ULB/Kaggle European cardholder dataset: 284,807 historical transactions and 492 fraud cases.",
        "Spark runs in local[*] mode and Kafka traffic is simulated by replaying held-out transactions in 100-record micro-batches.",
        "SMOTE is applied only to the training split; the held-out test set contains 42,722 transactions and 74 fraud cases.",
        "Reported throughput and latency describe one local experimental setup, not production payment infrastructure.",
      ],
      decisions: [
        {
          title: "Optimize a compact feature subset",
          choice:
            "Use a Quantum-Inspired Evolutionary Algorithm with a Random Forest proxy and a parsimony penalty to select three of 30 features.",
          rationale:
            "The experiment directly tests the quality-versus-inference-cost tradeoff rather than assuming every available feature is required.",
          tradeoff:
            "The three-feature Random Forest produces far more false positives than the 30-feature baseline: 466 versus 27 on the held-out test set.",
        },
        {
          title: "Compare search and model combinations",
          choice:
            "Benchmark all-features, PCA, mutual information, RFE, and QIEA across Logistic Regression, Random Forest, and Gradient Boosted Trees.",
          rationale:
            "Fifteen combinations expose whether an apparent gain belongs to feature selection, classifier choice, or both.",
        },
        {
          title: "Keep streaming results separate from model latency",
          choice:
            "Report per-transaction classifier latency alongside end-to-end simulated micro-batch throughput and latency.",
          rationale:
            "These measurements describe different boundaries and should not be conflated.",
        },
      ],
      validation: [
        "A stratified 70/15/15 split and training-only SMOTE were used; the repository reports all 15 feature-selection/classifier results on the held-out test split.",
        "QIEA + Random Forest achieved AUC-ROC 0.956 versus 0.964 for all-features + Random Forest, retaining 99.2% of that AUC-ROC value with three features.",
        "The simulated streaming replay processed 42,700 held-out transactions in about 13 seconds: 3,285 transactions/s, 26.53 ms median batch latency, and 49.10 ms p95.",
      ],
      limitations: [
        "This is a notebook-scale local experiment, not a deployed fraud-detection service or a live Kafka/Spark cluster benchmark.",
        "AUC-ROC retention masks a material precision tradeoff: QIEA + Random Forest precision is 11.2% versus 69.7% for all-features + Random Forest at the evaluated thresholds.",
        "The dataset contains anonymised historical European card transactions from a 48-hour period, so external validity and concept drift are untested.",
        "The repository names three authors but does not document each person's individual contribution.",
      ],
      domain: "Streaming Data / Machine Learning",
      stack: [
        "Apache Kafka",
        "PySpark",
        "Spark Structured Streaming",
        "Spark MLlib",
        "NumPy",
      ],
      metrics: [
        {
          value: "3,285/s",
          label: "transactions processed",
          detail: "Verified streaming throughput from the project benchmark.",
        },
        {
          value: "26.53 ms",
          label: "median batch latency",
          detail: "Verified median latency from the streaming benchmark.",
        },
        {
          value: "99.2%",
          label: "full-feature AUC-ROC retained",
          detail: "Three selected features compared with the 30-feature baseline.",
        },
        {
          value: "~30%",
          label: "lower inference latency",
          detail: "Measured after reducing the feature set from 30 to 3.",
        },
      ],
      overview: [
        "The project processes a dataset of more than 284,000 transactions with a 577:1 class imbalance through Kafka, Spark Structured Streaming, feature processing, and Spark MLlib inference.",
        "Its benchmarks compare multiple model and feature-selection combinations. A three-feature configuration retained 99.2% of the full-feature AUC-ROC while reducing inference latency by approximately 30%, alongside measured throughput of 3,285 transactions per second and 26.53 ms median batch latency.",
      ],
      highlights: [
        "Streams transactions through Kafka into Spark Structured Streaming.",
        "Benchmarks multiple model and feature-selection combinations on 284K+ transactions.",
        "Handles a verified 577:1 class imbalance in the project dataset.",
        "Reduces the feature set from 30 to 3 while retaining 99.2% of full-feature AUC-ROC.",
        "Measures 3,285 transactions per second and 26.53 ms median batch latency.",
        "Reports project-specific benchmark results rather than universal performance claims.",
      ],
      architecture: [
        {
          id: "fraud-stream",
          label: "Transaction stream",
          detail: "284K+ transaction project dataset",
          kind: "source",
        },
        {
          id: "fraud-kafka",
          label: "Kafka",
          detail: "Carries the incoming event stream",
          kind: "process",
        },
        {
          id: "fraud-spark",
          label: "Spark Structured Streaming",
          detail: "Processes transactions in streaming batches",
          kind: "process",
        },
        {
          id: "fraud-features",
          label: "Feature pipeline",
          detail: "Selects 3 features from the 30-feature baseline",
          kind: "process",
        },
        {
          id: "fraud-model",
          label: "Model inference",
          detail: "Scores transactions using Spark MLlib",
          kind: "decision",
        },
        {
          id: "fraud-score",
          label: "Fraud score",
          detail: "Emits a scored or flagged transaction state",
          kind: "output",
        },
      ],
      visualKind: "fraud",
      seoDescription:
        "Explore a collaborative academic Kafka and Spark fraud-detection pipeline evaluated in a local simulated streaming benchmark.",
    },
    {
      slug: "civiclens",
      index: "04",
      title: "CivicLens",
      subtitle: "Civic issue archive and public dashboard",
      summary:
        "A Supabase-to-Storacha archival utility with a static public dashboard for filtering and inspecting civic issue records.",
      repository: "https://github.com/aayushtiwari845/Civic-Issues-Dashboard",
      demoUrl: "https://civic-issues-dashboard.vercel.app",
      status: "Deployed static prototype",
      role:
        "Sole public repository contributor; implemented the archival utility and static dashboard.",
      problem:
        "Export civic issue rows from Supabase to content-addressed Storacha storage and make an archived dataset inspectable without requiring the source database.",
      constraints: [
        "The public dashboard is a static HTML, CSS, and JavaScript interface backed by archived/sample JSON, not the issue-submission application.",
        "The Node.js archival utility requires Supabase and Storacha credentials and an interactive Storacha email-authentication flow.",
        "Filtering and status statistics are client-side operations over the fetched archive.",
      ],
      decisions: [
        {
          title: "Separate archival from presentation",
          choice:
            "Use a Node.js utility to fetch and transform Supabase rows, then upload a JSON archive that a static dashboard can read.",
          rationale:
            "The published dashboard can remain simple and read-only while the credentialed export process runs separately.",
          tradeoff:
            "The repository does not implement report creation, assignment, SLA enforcement, or authenticated resolution workflows.",
        },
        {
          title: "Use content-addressed storage",
          choice:
            "Persist exported issue collections to Storacha and expose their CID/IPFS URL as the archive reference.",
          rationale:
            "An export can be referenced independently of the mutable source database.",
        },
        {
          title: "Keep exploration in the browser",
          choice:
            "Calculate status counts and apply search, status, priority, and category filters in the static page.",
          rationale:
            "The deployed view needs no application server for basic archive exploration.",
        },
      ],
      validation: [
        "The repository includes a connection script that exercises Storacha initialization, Supabase statistics, and an archive upload when valid credentials are supplied.",
        "The deployed Vercel homepage returns HTTP 200 and presents the static dashboard.",
        "The checked-in dashboard can fall back across multiple public IPFS gateways before using bundled data.",
      ],
      limitations: [
        "No automated unit, integration, accessibility, or end-to-end test suite is present; test.js is a live credentialed smoke script.",
        "Archive freshness depends on rerunning the credentialed exporter; the static dashboard does not continuously synchronize with Supabase.",
        "The static page bundles issue data, so repository contents must be reviewed for privacy before publishing new archives.",
        "Storacha availability, public gateway behavior, and source-database permissions remain external dependencies.",
      ],
      domain: "Civic Technology / Data Archival",
      stack: [
        "JavaScript",
        "Node.js",
        "Supabase",
        "PostgreSQL",
        "Storacha",
        "IPFS",
        "HTML/CSS",
      ],
      metrics: [],
      overview: [
        "The repository contains a credentialed Node.js exporter that fetches filtered civic issue rows from Supabase, serializes the data with archive metadata, and uploads it to Storacha content-addressed storage.",
        "A separately deployed static dashboard reads an IPFS archive with gateway fallbacks, computes summary counts, and lets visitors search and filter the archived issue records. The evidence supports this archive-and-explore workflow, not a full municipal case-management platform.",
      ],
      highlights: [
        "Fetches Supabase issue rows with status, date, user, category, department, limit, and offset filters.",
        "Transforms geography and timestamp fields into a portable JSON archive with schema and source metadata.",
        "Uploads archives to Storacha and records their content identifier and IPFS URL.",
        "Provides a deployed static view with summary statistics and client-side issue filtering.",
        "Falls back across public IPFS gateways and then bundled data when an archive cannot be loaded.",
      ],
      architecture: [
        {
          id: "civiclens-source",
          label: "Supabase issue rows",
          detail: "Credentialed, filterable PostgreSQL source data",
          kind: "source",
        },
        {
          id: "civiclens-export",
          label: "Archive exporter",
          detail: "Transforms issues and adds schema/source metadata",
          kind: "process",
        },
        {
          id: "civiclens-storage",
          label: "Storacha / IPFS",
          detail: "Content-addressed JSON archive",
          kind: "process",
        },
        {
          id: "civiclens-dashboard",
          label: "Static dashboard",
          detail: "Gateway fetch, statistics, search, and filters",
          kind: "output",
        },
      ],
      visualKind: "civiclens",
      seoDescription:
        "Explore CivicLens, Aayush Tiwari's deployed civic issue archive connecting Supabase data, Storacha/IPFS storage, and a searchable static dashboard.",
    },
    {
      slug: "indian-ipo-analytics",
      index: "05",
      title: "Indian IPO Analytics",
      subtitle: "NSE/BSE market data analysis and risk clustering",
      summary:
        "An interactive analysis of Indian IPOs from 2019–2024 spanning enriched returns, regression, clustering, distribution analysis, and sector-level exploration.",
      repository: "https://github.com/aayushtiwari845/IPO-Analytics",
      artifact: {
        src: "/project-artifacts/ipo-analysis-overview.png",
        alt: "Indian IPO Analytics overview combining exploratory plots from the project dataset.",
        caption:
          "Generated exploratory analysis from the repository's curated 63-record, 2019–2024 IPO dataset; the findings are descriptive rather than prospective forecasts.",
        sourceUrl: "https://github.com/aayushtiwari845/IPO-Analytics",
      },
      status: "Reproducible exploratory analysis",
      role:
        "Sole public repository contributor; built the notebook analysis, generated figures, and local Dash application.",
      problem:
        "Turn a small curated Indian IPO dataset into an inspectable analysis of listing performance, demand, issue size, sector, and post-listing returns without presenting the results as a trading model.",
      constraints: [
        "The dataset contains 63 IPOs across 27 sectors from April 2019 through November 2024.",
        "Grey Market Premium is both an input and a close market expectation of listing performance, so very high listing-gain regression scores require cautious interpretation.",
        "Post-listing return enrichment uses cached/fallback values as well as yfinance; complete coverage does not mean every value was fetched live from one source.",
        "The Dash application is documented for local use at localhost and no maintained public deployment is listed.",
      ],
      decisions: [
        {
          title: "Keep the workflow inspectable",
          choice:
            "Ship the notebook, generated figures, cached return data, and an interactive Dash application in the same repository.",
          rationale:
            "Readers can review both the analysis steps and the presentation layer rather than seeing only headline results.",
        },
        {
          title: "Use several analytical lenses",
          choice:
            "Combine exploratory plots, regression, sampling, K-Means clustering, distribution fitting, and time summaries.",
          rationale:
            "The dataset supports descriptive questions beyond a single prediction score.",
          tradeoff:
            "Many reported findings come from the same small curated sample and are not independent validation studies.",
        },
        {
          title: "Qualify model results as dataset findings",
          choice:
            "Report held-out and five-fold regression results while keeping the portfolio language scoped to the 2019–2024 dataset.",
          rationale:
            "The model has not been evaluated prospectively or against a later market period.",
        },
      ],
      validation: [
        "The repository includes the executed notebook, eight generated figure files, and a local Plotly Dash application.",
        "The documented regression run reports train R² 0.9922, test R² 0.9834, test MAE 4.15%, and five-fold CV R² 0.9808 ± 0.0117.",
        "The clustering study selects k=2 with silhouette score 0.4740, while distribution checks reject a Normal fit at the 5% level for this sample.",
      ],
      limitations: [
        "The sample is small, curated, and limited to one country and market period; the findings are not a prospective return forecast.",
        "The repository does not document a leakage audit, temporal validation split, uncertainty intervals for predictions, or transaction-cost analysis.",
        "GMP alone explains 99.0% of listing-gain variance in the documented run, which limits what the regression demonstrates about less direct features.",
        "No automated test suite or hosted dashboard is present in the public repository.",
      ],
      domain: "Data Analytics / Applied Statistics",
      stack: [
        "Python",
        "Pandas",
        "NumPy",
        "SciPy",
        "Scikit-learn",
        "Statsmodels",
        "Plotly",
        "Dash",
        "yfinance",
      ],
      metrics: [
        {
          value: "63",
          label: "IPO records",
          detail: "NSE/BSE IPOs in the 2019–2024 project dataset.",
        },
        {
          value: "27",
          label: "sectors",
          detail: "Sector coverage in the enriched analytics table.",
        },
        {
          value: "0.9808",
          label: "5-fold CV R²",
          detail: "A result of this project dataset, not a universal prediction claim.",
        },
        {
          value: "~4.15%",
          label: "MAE",
          detail: "A project-dataset regression result.",
        },
      ],
      overview: [
        "Indian IPO Analytics studies 63 NSE/BSE IPO records across 27 sectors from 2019 through 2024. The project builds a 34-column table with complete enriched return coverage for its dataset.",
        "Regression, clustering, and distribution analysis feed an interactive Plotly Dash dashboard. Results include approximately 0.9808 five-fold cross-validation R², approximately 4.15% MAE, and two K-Means risk clusters; these remain project-dataset findings rather than general financial predictions.",
      ],
      highlights: [
        "Builds a 34-column analytics table across 63 IPO records and 27 sectors.",
        "Maintains complete enriched return coverage for the project dataset.",
        "Combines regression, clustering, and distribution analysis.",
        "Reports approximately 0.9808 five-fold CV R² and approximately 4.15% MAE for this dataset.",
        "Segments records into two K-Means risk clusters.",
        "Exposes the analysis through an interactive Plotly Dash dashboard.",
      ],
      architecture: [
        {
          id: "ipo-sources",
          label: "NSE/BSE IPO records",
          detail: "63 records across 27 sectors from 2019–2024",
          kind: "source",
        },
        {
          id: "ipo-enrichment",
          label: "Data enrichment",
          detail: "34-column table with complete project-dataset return coverage",
          kind: "process",
        },
        {
          id: "ipo-analysis",
          label: "Statistical analysis",
          detail: "Regression, clustering, and distributions",
          kind: "process",
        },
        {
          id: "ipo-clusters",
          label: "Risk clusters",
          detail: "Two K-Means groups in the project analysis",
          kind: "decision",
        },
        {
          id: "ipo-dashboard",
          label: "Dash dashboard",
          detail: "Interactive Plotly exploration",
          kind: "output",
        },
      ],
      visualKind: "ipo",
      seoDescription:
        "Explore Aayush Tiwari's Indian IPO Analytics project covering 63 NSE/BSE IPOs, 27 sectors, regression, clustering, and an interactive Dash dashboard.",
    },
  ],
  metadata: {
    siteUrl: "https://aayushktiwari.tech",
    title: "Aayush Tiwari — Software Engineer | AI Systems & Data Infrastructure",
    titleTemplate: "%s — Aayush Tiwari",
    description:
      "Portfolio of Aayush Tiwari, a software and AI engineer building backend systems, real-time data infrastructure, ML platforms, and applied AI products.",
    locale: "en_IN",
  },
  about:
    "I gravitate toward systems where a model is only one component: evidence has to be collected, decisions replayed, and failure boundaries made explicit. That is why my projects pair AI experiments with baselines, tests, and visible limitations.",
  contact: {
    heading: "Building a backend, data, or applied-AI system?",
    copy: "If the hard part is making it trustworthy, operable, or understandable, I would be glad to compare notes.",
  },
} as const satisfies Portfolio;

export const projects = portfolio.projects;

/**
 * Homepage-only editorial order. Canonical project order remains `projects`,
 * which continues to drive static routes and cyclic next-project navigation.
 */
export const homepageProjectSlugs = [
  "tracepilot",
  "conclave",
  "real-time-fraud-detection",
  "civiclens",
  "indian-ipo-analytics",
] as const satisfies readonly ProjectSlug[];

export const homepageProjectEvidence = {
  tracepilot: {
    label: "Model gate",
    statement:
      "The deterministic baseline beat the learned ranker, so the model remained ineligible for promotion.",
  },
  conclave: {
    label: "Evaluation finding",
    statement:
      "The persisted study found a directional, but not statistically significant, advantage over a simple baseline.",
  },
  "real-time-fraud-detection": {
    label: "Measured trade-off",
    statement:
      "The three-feature model retained most AUC-ROC, but produced materially more false positives than the full-feature baseline.",
  },
  civiclens: {
    label: "Deployment boundary",
    statement:
      "The deployed static dashboard explores exported IPFS archives; it is not a municipal case-management platform.",
  },
  "indian-ipo-analytics": {
    label: "Analysis boundary",
    statement:
      "The regression result is scoped to a small curated 2019–2024 dataset and is not a prospective forecast.",
  },
} as const satisfies Record<ProjectSlug, HomepageProjectEvidence>;
