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
  readonly ownershipNote?: string;
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
  readonly heroMetrics: readonly ProjectMetric[];
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
    descriptor: "Software Engineering / AI Systems / Data",
    headline: "I build intelligent systems that hold up under real workloads.",
    introduction:
      "AI and Data Science engineer building software across backend systems, real-time data infrastructure, and applied AI — from 80M+ record screening workflows to streaming fraud detection and multi-agent decision systems.",
  },
  links: {
    email: "mailto:aayushkumar345@gmail.com",
    github: "https://github.com/aayushtiwari845",
    linkedin: "https://www.linkedin.com/in/aayushktiwari/",
    website: "https://aayushktiwari.tech",
  },
  navigation: [
    { label: "Work", href: "/#work" },
    { label: "Experience", href: "/#experience" },
    { label: "Capabilities", href: "/#capabilities" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
    { label: "Résumé", href: "/resume" },
  ],
  heroMetrics: [
    {
      value: "80M+",
      label: "records",
      detail: "Screening workflows designed to process files with more than 80 million records.",
    },
    {
      value: "3,285/s",
      label: "streaming transactions",
      detail: "Verified throughput from the real-time fraud detection project.",
    },
    {
      value: "26.53 ms",
      label: "median batch latency",
      detail: "Verified streaming-batch latency from the fraud detection project.",
    },
    {
      value: "9.71",
      label: "B.Tech CGPA",
      detail: "Artificial Intelligence & Data Science at K.J. Somaiya School of Engineering.",
    },
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
        "Public portfolio copy is intentionally limited to résumé-level information and does not imply Barclays endorsement.",
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
        "The work is described as product routing and workflow engineering, not as a clinical capability.",
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
      ownershipNote:
        "This is a collaborative/shared repository; the portfolio does not imply sole ownership.",
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
        "Explore a collaborative Kafka and Spark fraud-detection pipeline processing 3,285 transactions per second with 26.53 ms median batch latency.",
    },
    {
      slug: "civiclens",
      index: "04",
      title: "CivicLens",
      subtitle: "Civic Issue Reporting Platform",
      summary:
        "A resilient civic-reporting workflow for GPS and media-assisted submissions, offline queues, geospatial routing, SLA tracking, and authenticated resolution states.",
      repository: "https://github.com/aayushtiwari845/Civic-Issues-Dashboard",
      domain: "Civic Technology / Geospatial Systems",
      stack: [
        "FastAPI",
        "React",
        "PostgreSQL",
        "PostGIS",
        "Redis",
        "OAuth2/JWT",
      ],
      metrics: [
        {
          value: "4",
          label: "tracked workflow states",
          detail: "Reported, routed, assigned, and resolved.",
        },
        {
          value: "Offline",
          label: "queue support",
          detail: "Background synchronization supports intermittent connectivity.",
        },
      ],
      overview: [
        "CivicLens supports GPS and media-assisted issue reporting through REST APIs, with offline queues and background synchronization designed for intermittent connectivity.",
        "PostGIS routing, SLA tracking, authenticated status workflows, and Redis-backed processing move reports from submission toward resolution. The public repository also contains Supabase and Storacha archival work, which is treated as associated work rather than conflated with the core application stack.",
      ],
      highlights: [
        "Captures GPS and media-assisted civic issue reports.",
        "Queues submissions offline and synchronizes them in the background when connectivity returns.",
        "Uses PostGIS for geospatial routing and PostgreSQL for application data.",
        "Tracks SLAs and authenticated state transitions from report to resolution.",
        "Uses Redis-backed processing for asynchronous workflow needs.",
        "Keeps associated Supabase/Storacha archival work distinct from the core stack.",
      ],
      architecture: [
        {
          id: "civiclens-report",
          label: "Reported",
          detail: "GPS and media-assisted issue submission",
          kind: "source",
        },
        {
          id: "civiclens-route",
          label: "Routed",
          detail: "PostGIS-assisted geospatial routing",
          kind: "process",
        },
        {
          id: "civiclens-assigned",
          label: "Assigned",
          detail: "Authenticated workflow and SLA tracking",
          kind: "decision",
        },
        {
          id: "civiclens-resolved",
          label: "Resolved",
          detail: "Final tracked issue state",
          kind: "output",
        },
      ],
      visualKind: "civiclens",
      seoDescription:
        "Explore CivicLens, Aayush Tiwari's resilient civic issue platform for offline reporting, PostGIS routing, SLA tracking, and authenticated resolution workflows.",
    },
    {
      slug: "indian-ipo-analytics",
      index: "05",
      title: "Indian IPO Analytics",
      subtitle: "NSE/BSE market data analysis and risk clustering",
      summary:
        "An interactive analysis of Indian IPOs from 2019–2024 spanning enriched returns, regression, clustering, distribution analysis, and sector-level exploration.",
      repository: "https://github.com/aayushtiwari845/IPO-Analytics",
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
    "I work at the intersection of software engineering, data infrastructure, and applied AI. I'm particularly interested in systems where models, APIs, streaming data, and production constraints have to work together rather than exist as isolated demos.",
  contact: {
    heading: "Have a difficult system to build?",
    copy: "I'm always interested in thoughtful engineering conversations, ambitious software, and interesting problems.",
  },
} as const satisfies Portfolio;

export const projects = portfolio.projects;
