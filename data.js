/* =====================================================================
   Portfolio 3 — single source of truth.
   One person, three professional lenses. The role you pick rewrites
   the headline, the spec sheet, the metric set, how I describe how I
   work, the resume download, AND the order the domains appear in.
   ===================================================================== */

window.PORTFOLIO = {
  identity: {
    name: "C S Vineeth",
    email: "csvineeth2001@gmail.com",
    location: "Bengaluru, India",
    linkedin: "https://www.linkedin.com/in/c-s-vineeth-751b74229/",
    github: "https://github.com/Vineeth1007"
  },

  roles: {
    ml: {
      key: "ml",
      short: "ML Engineer",
      mode: "Production and serving",
      scene: "pipeline",
      resume: "resume/CS_Vineeth_ML_Engineer.pdf",
      title: "AI / Machine Learning Engineer",
      headline: ["I ship ML ", "systems", " - from messy data to a served endpoint."],
      statement: "I care about the path from notebook to production: reproducible pipelines, model serving, latency and cost - not just a good offline score.",
      spec: [
        ["focus", "pipelines, serving, inference"],
        ["runtime", "TorchScript, ONNX, AWS"],
        ["delivery", "batch + real-time APIs"],
        ["discipline", "leakage-safe, reproducible"]
      ],
      metrics: [
        { num: "5", lbl: "production domains shipped", to: 5, dp: 0 },
        { num: "35", lbl: "inference latency cut", to: 35, dp: 0, prefix: "-", suffix: "%" },
        { num: "22", lbl: "serving cost reduced", to: 22, dp: 0, prefix: "-", suffix: "%" },
        { num: "2.2", lbl: "sensor readings streamed", to: 2.2, dp: 1, suffix: "M+" }
      ],
      approach: [
        ["Pipelines, not notebooks", "Training and inference wrapped as reproducible steps - versioned features, deterministic splits, one command from raw data to scored output."],
        ["Serving that holds up", "Batch and real-time APIs with TorchScript / ONNX export, latency budgets and cost watched as first-class metrics, deployed on AWS."],
        ["Leakage-safe by construction", "Train-only normalisation, identifier removal and drift checks baked into the pipeline, so the offline number survives contact with production."]
      ],
      order: ["cyber", "fraud", "vision", "genomics", "nlp"]
    },

    ds: {
      key: "ds",
      short: "Data Scientist",
      mode: "Signal and decisions",
      scene: "signal",
      resume: "resume/CS_Vineeth_Data_Scientist.pdf",
      title: "Data Scientist",
      headline: ["I find the ", "signal", " others write off as noise."],
      statement: "I start from the data and the decision it has to support: which features actually move the outcome, and how confident we can honestly be.",
      spec: [
        ["focus", "EDA, features, evidence"],
        ["toolkit", "SHAP, mutual information"],
        ["rigor", "CV, calibration, CIs"],
        ["output", "decision support"]
      ],
      metrics: [
        { num: "10", lbl: "behavioural events analysed", to: 10, dp: 0, suffix: "M+" },
        { num: "54", lbl: "engineered genomic features", to: 54, dp: 0 },
        { num: "44", lbl: "intrusion features ranked", to: 44, dp: 0 },
        { num: "3", lbl: "model families compared", to: 3, dp: 0 }
      ],
      approach: [
        ["Signal discovery", "Mutual information, SHAP and ablation to separate the features that truly drive the outcome from the ones that only correlate by accident."],
        ["Honest uncertainty", "Stratified cross-validation, calibration curves and bootstrap intervals - a number always arrives with how much to trust it."],
        ["Built for a decision", "Threshold tuning and cost-aware framing so the analysis answers the business question, not just the leaderboard."]
      ],
      order: ["nlp", "fraud", "cyber", "genomics", "vision"]
    },

    as: {
      key: "as",
      short: "Applied Scientist",
      mode: "Research and benchmarks",
      scene: "bench",
      resume: "resume/CS_Vineeth_Applied_Scientist.pdf",
      title: "Applied Scientist / AI Researcher",
      headline: ["I turn open ", "questions", " into verifiable evidence."],
      statement: "I treat each problem as an experiment: competing architectures, controlled ablations, cross-dataset robustness - and claims that someone else could reproduce.",
      spec: [
        ["focus", "benchmarks, ablations"],
        ["method", "controlled comparison"],
        ["robustness", "cross-dataset, open-set"],
        ["evidence", "explainable, reproducible"]
      ],
      metrics: [
        { num: "8.9", lbl: "raw variants curated", to: 8.9, dp: 1, suffix: "M" },
        { num: "637", lbl: "clean benchmark SNVs", to: 637, dp: 0, suffix: "K" },
        { num: "5", lbl: "domains benchmarked", to: 5, dp: 0 },
        { num: "2", lbl: "architectures contrasted", to: 2, dp: 0, prefix: "≥" }
      ],
      approach: [
        ["Benchmark, don't assert", "Classical ML, tabular transformers and graph / sequence models compared head-to-head under one leakage-safe protocol."],
        ["Ablate to explain", "Feature-group ablations, SHAP attribution and error analysis to show a model leans on real structure - and quantify what each part is worth."],
        ["Robustness as the test", "Cross-dataset and open-set evaluation with calibrated rejection, because the result that matters is the one that transfers."]
      ],
      order: ["genomics", "vision", "cyber", "fraud", "nlp"]
    }
  },

  projects: [
    {
      id: "fraud",
      no: "01",
      domain: "Fraud Detection & Risk Intelligence",
      tag: "Risk intelligence",
      accent: "#4ea1ff",
      viz: "fraud",
      desc: "Production fraud-scoring over 500K+ transactional and relational records - gradient-boosted and graph models with automated feature construction, class-imbalance handling and calibrated decision thresholds.",
      lens: {
        ml: "Wrapped scoring as a reproducible batch-inference pipeline with input hashing and model fingerprinting for traceable, auditable decisions.",
        ds: "Engineered transactional and relational risk features and resolved severe class imbalance; comparative tests isolated which signals actually drove fraud.",
        as: "Benchmarked classical ML vs tabular transformers vs GNNs under one leakage-safe protocol; graph-aggregation ablations quantified the lift from relational structure (+2.3%)."
      }
    },
    {
      id: "cyber",
      no: "02",
      domain: "Cybersecurity & IoT Anomaly Detection",
      tag: "Intrusion & anomaly",
      accent: "#5fd0c4",
      viz: "intrusion",
      desc: "Intrusion detection on Edge-IIoTset (211K+ flows, 44 features) plus streaming anomaly detection over 2.2M+ sensor readings using LSTM and Transformer autoencoders with adaptive thresholding.",
      lens: {
        ml: "Served three model families with automated feature selection and simulated real-time inference for edge-style, zero-day detection.",
        ds: "Used mutual information and SHAP to find and validate the behavioural signals that separate attacks from normal traffic across model families.",
        as: "Contrasted LSTM vs Transformer autoencoders for unsupervised zero-day detection - reconstruction-error scoring with calibrated open-set rejection."
      }
    },
    {
      id: "vision",
      no: "03",
      domain: "Medical Imaging & Computer Vision",
      tag: "Clinical vision",
      accent: "#57c98b",
      viz: "vision",
      desc: "YOLO dental-detection with embedding-based similarity matching, plus transfer learning across diabetic-retinopathy grading, osteoporosis, EEG seizure detection and edge-deployed gait analysis.",
      lens: {
        ml: "Productionised standardised, reusable training and inference pipelines across five imaging tasks, including edge deployment for gait.",
        ds: "Ran multi-dataset studies on data quality, label refinement and metric-driven comparison; analysed error patterns and embedding similarity.",
        as: "Designed transfer-learning and knowledge-distillation frameworks evaluating cross-dataset robustness and acquisition-shift generalisation."
      }
    },
    {
      id: "genomics",
      no: "04",
      domain: "Genomic & Biomedical ML",
      tag: "Genomic benchmark",
      accent: "#9b86ff",
      viz: "genomics",
      desc: "A scalable ClinVar pipeline turning 8.9M raw variants into a clean 637K-variant benchmark, with 54-feature genomic matrices for downstream deep-learning pathogenicity prediction.",
      lens: {
        ml: "Automated review-status filtering, conflict resolution, SNV selection and allele-validity checks into a reproducible, scalable pipeline.",
        ds: "Engineered interpretable features - encodings, transition/transversion, GC/CpG, k-mers, functional scores - with imputation and scaling.",
        as: "Constructed a principled, reproducible ClinVar benchmark for comparative deep-learning pathogenicity research."
      }
    },
    {
      id: "nlp",
      no: "05",
      domain: "NLP & Predictive Analytics",
      tag: "Language & behaviour",
      accent: "#e0a44a",
      viz: "nlp",
      desc: "Depression-detection models fusing linguistic and psychological features (XLNet, BiLSTM, CNN), plus analysis of 10M+ behavioural learning events to predict engagement and outcome-risk.",
      lens: {
        ml: "Built text-classification variants and engagement predictors over large behavioural event streams.",
        ds: "Fused linguistic and psychological features and addressed class imbalance and dataset bias through label refinement and benchmarking.",
        as: "Studied generalisation of text-classification models under dataset bias via controlled experimentation and benchmarking."
      }
    }
  ]
};
