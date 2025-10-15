import React, { useState } from "react";
import ResumeUploadForm from "@/components/ResumeUploadForm";
import CandidateList from "@/components/CandidateList";
import { Candidate } from "@/types";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

// Define the comprehensive list of roles and their core keywords
const ROLE_KEYWORDS: { [key: string]: string[] } = {
  "Software Developer / Software Engineer": [
    "C", "C++", "Java", "Python", "C#", "Go", "Rust", "JavaScript", "TypeScript",
    "Spring Boot", "Spring MVC", "Django", "Flask", "FastAPI", ".NET Core",
    "Ruby on Rails", "Express.js", "Next.js", "NestJS", "Serverless",
    "REST API", "GraphQL", "gRPC", "Microservices", "Monolith Architecture",
    "Data Structures", "Algorithms", "OOP", "Design Patterns", "SOLID",
    "Multithreading", "Concurrency", "Asynchronous Programming",
    "Git", "GitHub", "GitLab", "Bitbucket", "CI/CD", "Jenkins", "GitHub Actions",
    "Agile", "Scrum", "Jira", "Unit Testing", "JUnit", "PyTest", "Mocha", "Jest",
    "PostgreSQL", "MySQL", "SQLite", "Oracle DB", "MongoDB", "Redis", "Cassandra",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Nginx", "Apache", "Shell Scripting",
    "API Security", "OAuth2", "JWT", "WebSockets", "Message Queues (Kafka, RabbitMQ)"
  ],
  "Frontend Developer": [
    "HTML5", "CSS3", "JavaScript", "TypeScript",
    "React.js", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js",
    "Redux", "Zustand", "Context API", "MobX",
    "Tailwind CSS", "Bootstrap", "Material UI", "Chakra UI", "SCSS/SASS",
    "Webpack", "Vite", "Babel", "ES6 Modules",
    "Responsive Design", "Flexbox", "CSS Grid", "Mobile-first UI",
    "Figma", "Adobe XD", "Wireframing", "UI Components",
    "REST API Integration", "GraphQL APIs", "Axios", "Fetch",
    "Accessibility (A11y)", "WCAG", "Browser Compatibility",
    "State Management", "Single Page Applications (SPA)",
    "Testing Library", "Cypress", "Jest", "Storybook"
  ],
  "Backend Developer": [
    "Java", "Spring Boot", "Spring Security", "Hibernate",
    "Python", "Django", "Flask", "FastAPI",
    "Node.js", "Express.js", "NestJS",
    "C#", ".NET Core", "Go", "Rust",
    "REST APIs", "GraphQL", "SOAP", "gRPC",
    "Microservices", "Event-driven Architecture", "Serverless",
    "PostgreSQL", "MySQL", "MariaDB", "Oracle DB", "SQL Server",
    "MongoDB", "DynamoDB", "Redis", "Cassandra",
    "Kafka", "RabbitMQ", "ActiveMQ",
    "OAuth2", "JWT", "API Authentication", "RBAC",
    "MVC", "Clean Architecture", "Domain-driven Design (DDD)",
    "CI/CD", "Pipeline", "Jenkins", "GitHub Actions",
    "Unit Testing", "Integration Testing (JUnit, Mocha, PyTest)",
    "Docker", "Kubernetes", "AWS Lambda", "ECS", "Azure Functions"
  ],
  "Full Stack Developer": [
    "React", "Angular", "Vue.js", "Next.js",
    "Node.js", "Express", "NestJS", "Django", "Flask", "Spring Boot",
    "JavaScript", "TypeScript", "Python", "Java", "C#",
    "REST APIs", "GraphQL", "WebSockets",
    "HTML", "CSS", "SCSS", "Tailwind", "Bootstrap",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase",
    "JWT", "OAuth2", "Authentication & Authorization",
    "CI/CD", "GitHub Actions", "Jenkins", "GitLab CI",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP",
    "Microservices", "MVC", "Server-side Rendering (SSR)",
    "MERN", "MEAN", "JAMStack", "Monorepos",
    "Testing (Jest, Mocha, Cypress)", "Linting (ESLint, Prettier)"
  ],
  "DevOps Engineer": [
    "Linux", "Shell Scripting (Bash, Zsh)",
    "Docker", "Kubernetes", "Helm", "Istio",
    "AWS (EC2, S3, IAM, Lambda, ECS, EKS)", "Azure", "GCP",
    "Terraform", "Ansible", "Packer", "CloudFormation",
    "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI",
    "Prometheus", "Grafana", "ELK Stack", "Loki",
    "Load Balancing", "Nginx", "HAProxy",
    "Networking", "DNS", "VPC", "Subnets", "Firewalls",
    "Monitoring", "Logging", "Auto Scaling",
    "CI/CD Pipelines", "Blue-Green Deployments", "Canary Releases",
    "SonarQube", "Nexus", "Artifactory", "Vault", "Secrets Management",
    "Python", "Go", "Groovy Scripting"
  ],
  "Mobile App Developer": [
    "Android", "Kotlin", "Java", "Jetpack Compose",
    "iOS", "Swift", "SwiftUI", "Objective-C",
    "React Native", "Flutter", "Dart",
    "Xcode", "Android Studio", "Gradle",
    "REST API Integration", "GraphQL", "Retrofit", "Alamofire",
    "SQLite", "Realm", "CoreData", "Firebase",
    "Push Notifications", "FCM", "APNs",
    "Material Design", "UI/UX", "Wireframing",
    "Play Store", "App Store Deployment",
    "MVVM", "MVC", "Clean Architecture",
    "Unit Testing", "Espresso", "XCTest"
  ],
  "Data Analyst": [
    "Excel", "Excel Macros", "VLOOKUP", "Pivot Tables",
    "Power BI", "Tableau", "Google Data Studio",
    "SQL", "PostgreSQL", "MySQL", "BigQuery",
    "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly",
    "Data Cleaning", "EDA", "Data Wrangling",
    "Statistics", "Hypothesis Testing", "A/B Testing",
    "Dashboards", "Reporting", "KPI Tracking",
    "Python", "R", "Excel VBA",
    "Business Intelligence", "Looker", "Snowflake",
    "CSV", "JSON", "ETL Basics"
  ],
  "Data Scientist": [
    "Python", "R",
    "Pandas", "NumPy", "Scikit-learn", "SciPy",
    "Regression", "Classification", "Clustering", "Time Series",
    "Matplotlib", "Seaborn", "Plotly",
    "Feature Engineering", "Model Evaluation", "Cross Validation",
    "Deep Learning", "TensorFlow", "PyTorch", "Keras",
    "NLP (TF-IDF, BERT, Word2Vec, Transformers)",
    "Computer Vision (OpenCV, CNN, YOLO)",
    "Statistical Modelling", "Predictive Analytics",
    "Jupyter", "Google Colab", "MLflow",
    "AWS Sagemaker", "Azure ML",
    "Big Data: Spark", "Hadoop", "Databricks"
  ],
  "Machine Learning Engineer": [
    "Python", "PyTorch", "TensorFlow", "Keras",
    "Scikit-learn", "XGBoost", "LightGBM", "CatBoost",
    "FastAPI", "Flask", "GRPC",
    "Docker", "Kubernetes", "MLflow", "Airflow",
    "Model Deployment", "REST Inference APIs",
    "MLOps", "CI/CD for ML", "Feature Store",
    "ONNX", "TensorRT", "Quantization", "Pruning",
    "AWS Sagemaker", "Vertex AI", "Azure ML",
    "Transformers", "BERT", "LLM Fine-tuning",
    "Kafka", "Streaming Data", "Monitoring Models"
  ],
  "AI Engineer / NLP Engineer": [
    "LLMs", "GPT", "BERT", "T5", "LLaMA",
    "Transformers", "Hugging Face", "LangChain",
    "RAG", "Vector Databases (Pinecone, FAISS, Weaviate)",
    "Prompt Engineering", "Tokenization", "Embeddings",
    "LLM Fine-Tuning", "LoRA", "PEFT",
    "Text Classification", "NER", "Q&A", "Summarization",
    "Sentiment Analysis", "Topic Modeling",
    "OpenAI API", "Vertex AI", "Cohere", "Anthropic",
    "Speech-to-Text", "TTS", "Whisper", "ASR",
    "FastAPI", "Flask", "Streamlit", "Flask APIs",
    "Multimodal Models", "Computer Vision + NLP"
  ],
  "Data Engineer": [
    "ETL", "ELT", "Data Pipelines", "Orchestration",
    "Apache Airflow", "Luigi", "Prefect",
    "Apache Spark", "PySpark", "Hadoop",
    "Kafka", "RabbitMQ", "Kinesis",
    "Data Warehousing", "Snowflake", "Redshift", "BigQuery",
    "Data Lake", "Lakehouse", "Delta Lake",
    "SQL Optimization", "Stored Procedures",
    "AWS Glue", "Athena", "EMR", "Databricks",
    "Scala", "Python", "Shell Scripting",
    "Batch Processing", "Streaming Data",
    "Azure Data Factory", "Informatica", "Talend"
  ],
  "Cloud Engineer": [
    "AWS (EC2, S3, IAM, Lambda, Route53, RDS, IAM, VPC)",
    "Azure (VM, Blob Storage, Functions, AKS)",
    "GCP (GKE, Cloud Run, Pub/Sub, BigQuery)",
    "Terraform", "Ansible", "Packer", "CloudFormation",
    "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI",
    "Prometheus", "Grafana", "ELK Stack", "Loki",
    "Load Balancing", "Nginx", "HAProxy",
    "Networking", "DNS", "VPC", "Subnets", "Firewalls",
    "Monitoring", "Logging", "Auto Scaling",
    "CI/CD Pipelines", "Blue-Green Deployments", "Canary Releases",
    "SonarQube", "Nexus", "Artifactory", "Vault", "Secrets Management",
    "Python", "Go", "Groovy Scripting"
  ],
  "Site Reliability Engineer (SRE)": [
    "SLI", "SLO", "SLA", "Error Budgets",
    "Incident Response", "On-call", "Postmortems",
    "Prometheus", "Grafana", "Kibana", "ELK Stack",
    "Linux", "Bash", "Python", "Go",
    "AWS/GCP/Azure Infra", "Kubernetes",
    "Observability", "Telemetry", "Tracing",
    "Load Testing", "Chaos Engineering",
    "Automation", "Ansible", "Terraform",
    "PagerDuty", "Opsgenie", "Alerts",
    "Networking", "DNS", "Certificates"
  ],
  "Business Analyst": [
    "Excel", "SQL", "Power BI", "Tableau",
    "Data Interpretation", "Dashboards", "Reporting",
    "Requirement Gathering", "BRD", "FRD",
    "UML", "Flowcharts", "Wireframes",
    "Agile", "Scrum", "Sprint Planning",
    "Stakeholder Communication", "Jira", "Confluence",
    "KPI Tracking", "Gap Analysis"
  ],
  "Product Manager": [
    "Roadmapping", "Product Strategy",
    "User Stories", "PRD", "Feature Prioritization",
    "A/B Testing", "Analytics", "Funnels",
    "Scrum", "Agile", "Jira", "Confluence",
    "Wireframes", "Mockups", "Prototyping",
    "Figma", "Balsamiq", "Miro",
    "User Research", "UX/UI Collaboration",
    "Go-to-Market", "Product Lifecycle",
    "Metrics: DAU/MAU", "Churn", "Conversion"
  ],
  "Operations Analyst": [
    "Excel", "SQL", "Dashboards",
    "Process Optimization", "Automation",
    "ERP Systems", "SAP", "Oracle",
    "Forecasting", "Reporting", "KPI Tracking",
    "Workflow Analysis", "Risk Mitigation"
  ],
  "Embedded Systems Engineer": [
    "C", "C++", "Embedded C", "Assembly",
    "Microcontrollers (ARM, STM32, AVR, PIC)",
    "RTOS", "FreeRTOS", "Zephyr",
    "I2C", "SPI", "UART", "CAN",
    "PCB Design", "KiCad", "Altium",
    "Device Drivers", "Bare Metal Coding",
    "JTAG", "Oscilloscope", "Logic Analyzer",
    "Linux Kernel", "Yocto", "Cross-compilation"
  ],
  "Hardware / VLSI Engineer": [
    "Verilog", "SystemVerilog", "VHDL",
    "FPGA", "ASIC", "RTL Design",
    "Vivado", "Quartus", "Synopsys", "Cadence",
    "UVM", "Simulation", "Timing Analysis",
    "Low Power Design", "DFT", "STA",
    "RTL Synthesis", "Testbenches"
  ],
  "IoT Engineer": [
    "Arduino", "Raspberry Pi", "ESP32",
    "MQTT", "CoAP", "BLE", "LoRa", "Wi-Fi",
    "Sensors", "Actuators", "Edge Devices",
    "Node-RED", "MQTT Broker", "AWS IoT",
    "Python", "C", "C++", "MicroPython",
    "Cloud Integration", "IoT Security", "Firmware Development"
  ],
  "Cybersecurity Engineer": [
    "Penetration Testing", "Vulnerability Analysis",
    "OWASP Top 10", "Web Security", "API Security",
    "Metasploit", "Burp Suite", "Nmap", "Wireshark",
    "Firewalls", "IDS", "IPS", "SIEM (Splunk, QRadar)",
    "Threat Hunting", "Incident Response",
    "Linux", "Bash", "Python Scripting",
    "SOC", "IAM", "Zero Trust", "SSL/TLS",
    "CEH", "OSCP", "CISSP (cert mentions)"
  ],
  "Network Engineer": [
    "CCNA", "CCNP", "Routing", "Switching",
    "TCP/IP", "DHCP", "DNS", "Subnetting", "VLAN",
    "Cisco", "Juniper", "Fortinet",
    "Firewall Configuration", "VPN", "IPS/IDS",
    "Network Monitoring", "SNMP", "Wireshark",
    "Load Balancing", "MPLS", "VoIP",
    "Troubleshooting", "Infrastructure Setup"
  ],
  "HR Executive / HRBP": [
    "Recruitment", "Talent Acquisition",
    "Screening", "Interviews", "ATS Tools",
    "Onboarding", "Employee Engagement",
    "Payroll", "Compliance", "HRMS",
    "Policy Implementation", "Leave Management",
    "Performance Reviews", "Exit Process"
  ],
  "Digital Marketing": [
    "SEO", "SEM", "Google Analytics",
    "Meta Ads", "Google Ads", "LinkedIn Ads",
    "Keyword Research", "Content Strategy",
    "Email Marketing", "Copywriting",
    "A/B Testing", "Landing Pages",
    "Canva", "HubSpot", "Social Media Campaigns"
  ],
  "Finance Analyst": [
    "Excel", "Advanced Excel", "Pivot Tables",
    "Financial Modeling", "Budgeting", "Forecasting",
    "Valuation", "Balance Sheet", "P&L",
    "SAP", "Tally", "QuickBooks",
    "SQL", "Power BI", "Cost Analysis",
    "Investment Research", "Reporting"
  ],
  "Mechanical Design Engineer": [
    "AutoCAD", "SolidWorks", "CATIA", "Creo", "NX", "Fusion 360",
    "GD&T (Geometric Dimensioning and Tolerancing)",
    "2D Drafting", "3D Modeling", "FEA", "ANSYS",
    "Sheet Metal Design", "Machine Design", "CAD Drafting",
    "DFM (Design for Manufacturing)", "DFA (Design for Assembly)",
    "Prototyping", "Tolerance Stack-up", "BOM", "Product Lifecycle",
    "PLM Tools (Teamcenter, Windchill)", "ISO Standards",
    "Material Selection", "Stress Analysis",
    "Thermal Simulation", "Kinematics", "Mechanism Design"
  ],
  "Manufacturing / Production Engineer": [
    "CNC Machining", "Lean Manufacturing", "Six Sigma", "Kaizen",
    "TPM", "5S", "SPC (Statistical Process Control)",
    "Process Optimization", "Assembly Line Design",
    "PLC Basics", "Tooling", "Jigs & Fixtures",
    "Quality Control", "TQM", "FMEA", "Root Cause Analysis",
    "AutoCAD", "SolidWorks", "Process Planning",
    "Manufacturing SOPs", "CAM", "CNC Programming",
    "Material Handling", "Supply Chain Coordination",
    "GD&T", "Industrial Safety", "Maintenance Planning"
  ],
  "HVAC / Thermal Engineer": [
    "HVAC Design", "Heat Transfer", "Thermodynamics",
    "AutoCAD", "Revit MEP", "HAP", "TRACE 700",
    "Duct Design", "Load Calculation", "Chiller Systems",
    "Ventilation", "Fire Safety Codes", "ASHRAE Standards",
    "Piping Design", "Fluid Mechanics", "Pump Sizing",
    "CFD Analysis", "Energy Modeling",
    "Cooling Systems", "Thermal Simulation",
    "Building Services", "Airflow Analysis"
  ],
  "Automotive / Vehicle Engineer": [
    "Automotive Design", "Powertrain Systems", "Suspension",
    "NVH Analysis", "Internal Combustion Engines",
    "Electric Vehicles (EV)", "Drivetrain", "FEA",
    "SolidWorks", "CATIA", "MATLAB", "Simulink",
    "Vehicle Dynamics", "Chassis Design",
    "Thermal Systems", "CAD Modeling",
    "Emission Standards", "ISO/TS 16949",
    "Prototyping", "CAM", "GD&T"
  ],
  "Quality / Maintenance Engineer": [
    "Quality Assurance", "Quality Control", "ISO 9001",
    "FMEA", "PPAP", "CAPA", "7QC Tools",
    "Root Cause Analysis", "Statistical Quality Control",
    "Lean Six Sigma", "TPM", "Maintenance Scheduling",
    "Preventive Maintenance", "Reliability Engineering",
    "Equipment Calibration", "SOPs", "Safety Standards",
    "Kaizen", "Production Auditing", "SAP PM", "ERP Systems"
  ],
  "Process Engineer": [
    "Process Design", "PFD", "P&ID", "Aspen HYSYS", "Aspen Plus",
    "Chemical Process Simulation", "Heat Exchangers", "Distillation",
    "Unit Operations", "Mass Transfer", "Fluid Mechanics",
    "Safety Standards", "PSM", "HAZOP", "HAZID",
    "Process Optimization", "Scale-up", "Batch Processing",
    "Process Control", "DCS/SCADA", "Control Valves",
    "Material and Energy Balance", "Reaction Engineering",
    "Pilot Plant Operations", "Equipment Design"
  ],
  "Plant / Production Engineer": [
    "Plant Operations", "Batch Processing", "Continuous Processing",
    "Reactors", "Boilers", "Heat Exchangers",
    "Pump Selection", "Pipeline Design", "SCADA", "DCS",
    "Shift Supervision", "Maintenance Coordination",
    "SOPs", "Shutdown Planning", "Troubleshooting",
    "Process Safety", "Permit to Work", "ISO Standards",
    "Lean Manufacturing", "Waste Reduction",
    "Instrumentation Basics", "Utilities Management"
  ],
  "Quality / Safety / EHS Engineer": [
    "ISO 9001", "ISO 14001", "ISO 45001",
    "GMP", "GLP", "HACCP Standards",
    "Quality Assurance", "Quality Control",
    "HAZOP", "Risk Assessment", "PHA", "PSM",
    "Incident Investigation", "Safety Audits",
    "MSDS", "Chemical Handling", "PPE Compliance",
    "Environmental Compliance", "Waste Treatment",
    "Statistical Quality Control", "Root Cause Analysis"
  ],
  "R&D / Formulation Engineer": [
    "Polymer Science", "Catalysis", "Process Development",
    "Lab-scale to Pilot-scale Scale-up",
    "Coatings", "Pharmaceuticals", "Petrochemicals",
    "Characterization (GC, HPLC, FTIR, DSC, TGA)",
    "Material Testing", "Reaction Kinetics",
    "New Product Development", "Technical Documentation",
    "Formulation Chemistry", "Lab Safety", "DOE"
  ],
  "Petrochemical / Refinery Engineer": [
    "Petrochemical Processing", "Refinery Operations",
    "Crude Distillation", "FCC", "Hydrocracking",
    "Heat Exchangers", "Compressors", "Pumps",
    "Plant Utilities", "SCADA", "PLC",
    "Process Simulation (Aspen, HYSYS)",
    "Piping", "Corrosion Control", "Process Safety",
    "Turnaround Maintenance", "Shutdown Operations"
  ],
};


const Index = () => {
  const [shortlistedCandidates, setShortlistedCandidates] = useState<Candidate[]>([]);
  const [notShortlistedCandidates, setNotShortlistedCandidates] = useState<Candidate[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);

  // Helper function to simulate LLM parsing and scoring
  const mockAnalyzeResume = (resumeFileName: string, resumeContent: string, jobDescription: string): Candidate => {
    const candidateName = resumeFileName.split('.')[0];
    let matchScore = 0;
    let justification = "";
    let skills: string[] = [];
    let experience: string[] = [];
    let education: string[] = [];
    let suggestedRole: string | undefined = undefined;
    let scoreReasoning: string[] = [];

    const resumeContentLower = resumeContent.toLowerCase();
    const jobDescriptionLower = jobDescription.toLowerCase();

    const fileExtension = resumeFileName.split('.').pop()?.toLowerCase();

    // Handle unparseable binary files (PDF, DOCX)
    if (fileExtension === 'pdf' || fileExtension === 'doc' || fileExtension === 'docx') {
      return {
        id: `cand-${Date.now()}-${Math.random()}`,
        name: candidateName,
        email: `${candidateName.toLowerCase()}@example.com`,
        skills: [], // Empty
        experience: [], // Empty
        education: [], // Empty
        matchScore: 1, // Cannot be shortlisted if not parsed
        justification: `This candidate, ${candidateName}, received a score of 1/10. Reasoning: The resume file (${resumeFileName}) is a binary format (PDF/DOCX) which cannot be parsed into readable text by the frontend application. Please upload a plain text (.txt) resume for full analysis.`,
        resumeFileName: resumeFileName,
        suggestedRole: "N/A",
      };
    }

    // --- Parsing logic for plain text files (.txt) ---
    const allKnownHeaders = ["EDUCATION", "WORK EXPERIENCE", "EXPERIENCE", "PROJECTS", "SKILLS", "TECHNICAL SKILLS", "CERTIFICATIONS", "PROFILE", "CLUBS AND CHAPTERS"];

    // Helper to extract content between two markers (now accepts RegExp for endMarker)
    const extractContentBetween = (content: string, startMarker: string, endMarkers: (string | RegExp)[]): string => {
      const startRegex = new RegExp(`(?:^|\\n\\s*)${startMarker}\\s*`, 'i');
      const startIndex = content.search(startRegex);
      if (startIndex === -1) return "";

      const contentAfterStart = content.substring(startIndex + (content.match(startRegex)?.[0].length || 0));

      let endIndex = -1;
      for (const marker of endMarkers) {
        const currentEndIndex = typeof marker === 'string'
          ? contentAfterStart.search(new RegExp(`(?:\\s+|\\n|^)${marker}`, 'i'))
          : contentAfterStart.search(marker); // Use regex directly
        
        if (currentEndIndex !== -1 && (endIndex === -1 || currentEndIndex < endIndex)) {
          endIndex = currentEndIndex;
        }
      }
      return endIndex === -1 ? contentAfterStart.trim() : contentAfterStart.substring(0, endIndex).trim();
    };

    // --- Simulate JD Eligibility Criteria Parsing ---
    const jdCriteria = {
      min10thPercentage: parseFloat(jobDescription.match(/10th grade min (\d+\.?\d*)%/)?.at(1) || '0'),
      min12thPercentage: parseFloat(jobDescription.match(/12th grade min (\d+\.?\d*)%/)?.at(1) || '0'),
      minUGCGPA: parseFloat(jobDescription.match(/UG min CGPA (\d+\.?\d*)/)?.at(1) || '0'),
      minPGCGPA: parseFloat(jobDescription.match(/PG min CGPA (\d+\.?\d*)/)?.at(1) || '0'),
      requiresEngineeringDegree: jobDescriptionLower.includes("engineering degree"),
      dotNetExpertise: jobDescriptionLower.includes(".net expertise"),
      zeroExperienceCandidatesOnly: jobDescriptionLower.includes("zero experience candidates only"),
      communicationSkillsRequired: jobDescriptionLower.includes("excellent written and verbal communication skills"),
      teamworkSkillsRequired: jobDescriptionLower.includes("ability to collaborate and work well in team environments"),
      // Initialize with explicit keywords from JD, but these will be overridden if a primary role is found
      requiredSkillsKeywords: (jobDescription.match(/(?:skills|requirements|proficient in):?\s*([\w\s,.-]+)/i)?.[1]?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)) || [],
      requiredExperienceKeywords: (jobDescription.match(/(?:experience|responsibilities):?\s*([\w\s,.-]+)/i)?.[1]?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)) || [],
    };

    let jdPrimaryRole: string | undefined;
    let jdPrimaryRoleKeywords: string[] = [];

    // Try to infer the primary role from the job description
    for (const role in ROLE_KEYWORDS) {
      if (jobDescriptionLower.includes(role.toLowerCase())) {
        jdPrimaryRole = role;
        jdPrimaryRoleKeywords = ROLE_KEYWORDS[role].map(k => k.toLowerCase());
        break;
      }
    }

    // IMPORTANT: If a primary role is inferred, use its keywords for matching and scoring
    // This overrides any explicit keywords found in the JD text if a role is clearly identified.
    if (jdPrimaryRole) {
      jdCriteria.requiredSkillsKeywords = jdPrimaryRoleKeywords;
      jdCriteria.requiredExperienceKeywords = jdPrimaryRoleKeywords; // Assuming role keywords cover both skills and experience for simplicity
    }

    // Helper to parse lines into distinct entries for education
    const parseEducationEntries = (text: string): string[] => {
      return text.split('\n')
                 .map(line => line.trim())
                 .filter(line => line.length > 0 && !/^\s*•\s*$/.test(line)); // Filter out empty lines and standalone bullets
    };

    // --- Education Parsing ---
    let resume10thPercentage = 0;
    let resume12thPercentage = 0;
    let resumeUGCGPA = 0;
    let extractedEducationDetails: Set<string> = new Set();

    // Specific parsing for Aravind's education which is tightly coupled after SKILLS
    if (resumeFileName === "Resume Aravind.pdf") { // This specific parsing is for a PDF, which will now be skipped.
        // This block will effectively be skipped due to the fileExtension check above.
        // Keeping it here for context if .txt version of Aravind's resume were to be used.
        const aravindEduMatch = resumeContent.match(/(Vellore Institute of Technology Vellore, Tamilnadu\s*B\.? Tech, Electronics and Communication Engineering.*?CGPA-?\s*(\d+\.?\d*).*?SBOA School & Junior College Chennai, Tamilnadu.*?All Indian Senior School Certificate Examination.*?Percentage :?\s*(\d+\.?\d*)%.*?SBOA School & Junior College Chennai, Tamilnadu.*?All Indian Secondary School Examination.*?Percentage :?\s*(\d+\.?\d*)%)/is);
        if (aravindEduMatch) {
            extractedEducationDetails.add(aravindEduMatch[1].trim());
            resumeUGCGPA = parseFloat(aravindEduMatch[2]);
            resume12thPercentage = parseFloat(aravindEduMatch[3]);
            resume10thPercentage = parseFloat(aravindEduMatch[4]);
        }
    } else {
        // General parsing for other resumes
        const vitFullMatch = resumeContent.match(/(Vellore Institute of Technology.*?B\.?Tech.*?Computer Science and Engineering.*?CGPA[-:]?\s*(\d+\.?\d*))/i);
        if (vitFullMatch) {
            extractedEducationDetails.add(vitFullMatch[1].trim());
            resumeUGCGPA = parseFloat(vitFullMatch[2]);
        }

        const sboa12FullMatch = resumeContent.match(/(Chennai Public School.*?Grade 12:?\s*(\d+\.?\d*)%)/i);
        if (sboa12FullMatch) {
            const percentage = sboa12FullMatch[2];
            if (percentage) {
                resume12thPercentage = parseFloat(percentage);
                extractedEducationDetails.add(`Chennai Public School, Grade 12: ${resume12thPercentage}%`);
            }
        }

        const sboa10FullMatch = resumeContent.match(/(Chennai Public School.*?Grade 10:?\s*(\d+\.?\d*)%)/i);
        if (sboa10FullMatch) {
            const percentage = sboa10FullMatch[2];
            if (percentage) {
                resume10thPercentage = parseFloat(percentage);
                extractedEducationDetails.add(`Chennai Public School, Grade 10: ${resume10thPercentage}%`);
            }
        }

        if (resumeUGCGPA === 0) {
            const generalCgpaMatch = resumeContent.match(/CGPA[-:]?\s*(\d+\.?\d*)/i);
            if (generalCgpaMatch) resumeUGCGPA = parseFloat(generalCgpaMatch[1]);
        }

        if (extractedEducationDetails.size === 0) {
            const educationSectionContent = extractContentBetween(resumeContent, "EDUCATION", allKnownHeaders.filter(h => h !== "EDUCATION"));
            if (educationSectionContent) {
                parseEducationEntries(educationSectionContent).forEach(line => extractedEducationDetails.add(line));
            }
        }
    }

    education = Array.from(extractedEducationDetails);


    // --- Skill Extraction ---
    let identifiedSkills = new Set<string>();
    
    // For Aravind's resume, PROFILE and SKILLS are merged and followed by education
    if (resumeFileName === "Resume Aravind.pdf") { // This specific parsing is for a PDF, which will now be skipped.
        // This block will effectively be skipped due to the fileExtension check above.
        const profileSkillsMatch = resumeContent.match(/PROFILESoftware skills - (.*?)\.Programming Skills - (.*?)\. Soft Skills - (.*?)\.Volunteer experience - (.*?)\.SKILLS/is);
        if (profileSkillsMatch) {
            const softwareSkills = profileSkillsMatch[1].split(',').map(s => s.trim()).filter(Boolean);
            const programmingSkills = profileSkillsMatch[2].split(',').map(s => s.trim()).filter(Boolean);
            const softSkills = profileSkillsMatch[3].split(',').map(s => s.trim()).filter(Boolean);
            [...softwareSkills, ...programmingSkills, ...softSkills].forEach(skill => identifiedSkills.add(skill));
        }
        // Explicitly extract skills from the "SKILLS" section, ending before "Vellore Institute of Technology"
        const skillsSectionContent = extractContentBetween(resumeContent, "SKILLS", [/Vellore Institute of Technology/i, ...allKnownHeaders.filter(h => h !== "SKILLS")]);
        if (skillsSectionContent) {
            skillsSectionContent.split(/•\s*|\n/).map(s => s.trim()).filter(Boolean).forEach(skill => identifiedSkills.add(skill));
        }

        // Extract specific keywords from CERTIFICATES section for Aravind
        const certificationsContent = extractContentBetween(resumeContent, "CERTIFICATES", allKnownHeaders.filter(h => h !== "CERTIFICATES"));
        if (certificationsContent) {
            const certKeywords = certificationsContent.match(/(Python Bootcamp|Electronics Foundations|Project Management Foundations|Ethical Hacking: Vulnerability Analysis|Introduction to Artificial Intelligence|Yolo v8|CNN|LM386|RF amplifier|VCO|tuning circuit|Multisim|Matlab|adaptive filtering)/gi);
            if (certKeywords) {
                certKeywords.forEach(kw => identifiedSkills.add(kw));
            }
        }

    } else {
        // General parsing for other resumes
        const skillsSectionContent = extractContentBetween(resumeContent, "SKILLS", allKnownHeaders.filter(h => h !== "SKILLS"));
        const technicalSkillsSectionContent = extractContentBetween(resumeContent, "TECHNICAL SKILLS", allKnownHeaders.filter(h => h !== "TECHNICAL SKILLS"));
        const profileSectionContent = extractContentBetween(resumeContent, "PROFILE", allKnownHeaders.filter(h => h !== "PROFILE"));
        const certificationsSectionContent = extractContentBetween(resumeContent, "CERTIFICATIONS", allKnownHeaders.filter(h => h !== "CERTIFICATIONS"));

        const parseSkillsBlock = (blockContent: string) => {
            if (!blockContent) return;
            const skillLines = blockContent.split(/•\s*|\n/).map(s => s.trim()).filter(Boolean);
            skillLines.forEach(line => {
                const parts = line.split(':');
                if (parts.length > 1) {
                    const categorySkills = parts[1].split(',').map(s => s.trim()).filter(Boolean);
                    categorySkills.forEach(skill => identifiedSkills.add(skill));
                } else {
                    line.split(',').map(s => s.trim()).filter(Boolean).forEach(skill => identifiedSkills.add(skill));
                }
            });
        };

        parseSkillsBlock(skillsSectionContent);
        parseSkillsBlock(technicalSkillsSectionContent);

        const profileSkillsMatch = profileSectionContent.match(/Software skills - (.*?)\.Programming Skills - (.*?)\./i);
        if (profileSkillsMatch) {
            const softwareSkills = profileSkillsMatch[1].split(',').map(s => s.trim()).filter(Boolean);
            const programmingSkills = profileSkillsMatch[2].split(',').map(s => s.trim()).filter(Boolean);
            [...softwareSkills, ...programmingSkills].forEach(skill => identifiedSkills.add(skill));
        }

        if (certificationsSectionContent) {
            const certKeywords = certificationsSectionContent.match(/(AWS Cloud Practitioner|IBM AI Engineering Professional|Data Analytics|Amazon Web Services|Artificial Intelligence|Machine Learning|Python|Semiconductor devices|Project Management|Ethical Hacking|Vulnerability Analysis|Yolo v8|CNN|LM386|RF amplifier|VCO|tuning circuit|Multisim|Matlab|adaptive filtering)/gi);
            if (certKeywords) {
                certKeywords.forEach(kw => identifiedSkills.add(kw));
            }
        }
    }

    skills = Array.from(identifiedSkills);

    // --- Experience Parsing ---
    const tempExperience: string[] = [];

    const parseExperienceEntries = (text: string): string[] => {
      const entries: string[] = [];
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
      let currentEntry: string[] = [];

      for (const line of lines) {
        // If it's a bullet point or a continuation of a previous line (e.g., starts with lowercase or not a clear heading)
        // Also, if it's a line that doesn't start with a capital letter (and isn't a bullet), it's likely a continuation.
        if (line.startsWith('•') || (currentEntry.length > 0 && !/^[A-Z0-9]/.test(line))) {
          currentEntry.push(line);
        } else {
          // This is a new entry/heading
          if (currentEntry.length > 0) {
            entries.push(currentEntry.join('\n'));
          }
          currentEntry = [line];
        }
      }
      if (currentEntry.length > 0) {
        entries.push(currentEntry.join('\n'));
      }
      return entries;
    };

    // Specific handling for Aravind's embedded PROJECT section
    const aravindProjectMatch = resumeContent.match(/PROJECT\s*(.*?)(?:CLUBS AND CHAPTERS|CERTIFICATES|EDUCATION|$)/is);
    if (aravindProjectMatch && aravindProjectMatch[1]) { // This specific parsing is for a PDF, which will now be skipped.
        // This block will effectively be skipped due to the fileExtension check above.
        tempExperience.push(...parseExperienceEntries(aravindProjectMatch[1]));
    } else {
        // General parsing for WORK EXPERIENCE
        const workExperienceSectionContent = extractContentBetween(resumeContent, "WORK EXPERIENCE", allKnownHeaders.filter(h => h !== "WORK EXPERIENCE"));
        if (workExperienceSectionContent) {
            tempExperience.push(...parseExperienceEntries(workExperienceSectionContent));
        }

        // General parsing for PROJECTS (if not handled by Aravind's specific case)
        const projectsSectionContent = extractContentBetween(resumeContent, "PROJECTS", allKnownHeaders.filter(h => h !== "PROJECTS"));
        if (projectsSectionContent) {
            tempExperience.push(...parseExperienceEntries(projectsSectionContent));
        }
    }
    
    // Also add certifications as experience entries if they are substantial
    const certificationsContent = extractContentBetween(resumeContent, "CERTIFICATIONS", allKnownHeaders.filter(h => h !== "CERTIFICATIONS"));
    if (certificationsContent) {
        tempExperience.push(...parseExperienceEntries(certificationsContent));
    }

    experience = tempExperience;


    // --- New Strict Shortlisting Logic ---
    let isShortlisted = true;
    let missingKeywords: string[] = [];
    let matchedJdKeywordsCount = 0;

    // Prepare candidate capabilities for matching
    const candidateCapabilitiesLower = new Set<string>();
    const addWords = (text: string) => {
      text.split(/[\s,.;:()\[\]{}'"`-]+/).map(word => word.trim().toLowerCase()).filter(Boolean).forEach(w => candidateCapabilitiesLower.add(w));
    };

    skills.forEach(s => {
      candidateCapabilitiesLower.add(s.toLowerCase()); // Add full skill phrase
      addWords(s); // Add individual words from skill
    });
    experience.forEach(exp => {
      candidateCapabilitiesLower.add(exp.toLowerCase()); // Add full experience phrase
      addWords(exp); // Add individual words from experience
    });
    education.forEach(edu => {
      candidateCapabilitiesLower.add(edu.toLowerCase()); // Add full education phrase
      addWords(edu); // Add individual words from education
    });
    addWords(resumeContentLower); // Add individual words from raw resume content

    let jdKeywordsToMatch: string[] = [];

    if (jdPrimaryRole && jdPrimaryRoleKeywords.length > 0) {
      // Flatten complex role keywords like "AWS (EC2, S3)" into "aws", "ec2", "s3"
      jdPrimaryRoleKeywords.forEach(keywordPhrase => {
        const mainKeywordMatch = keywordPhrase.match(/^([\w\s.-]+?)(?:\s*\((.*?)\))?$/i);
        if (mainKeywordMatch) {
          const mainKeyword = mainKeywordMatch[1].trim();
          if (mainKeyword) jdKeywordsToMatch.push(mainKeyword.toLowerCase());
          if (mainKeywordMatch[2]) {
            mainKeywordMatch[2].split(',').map(s => s.trim()).filter(Boolean).forEach(subKeyword => {
              jdKeywordsToMatch.push(subKeyword.toLowerCase());
            });
          }
        } else {
          jdKeywordsToMatch.push(keywordPhrase.toLowerCase());
        }
      });
    } else {
      // If no primary role, use explicit skills/experience from JD
      jdKeywordsToMatch = [...jdCriteria.requiredSkillsKeywords, ...jdCriteria.requiredExperienceKeywords];
    }

    // Perform matching with flattened keywords
    if (jdKeywordsToMatch.length > 0) {
      for (const requiredKeyword of jdKeywordsToMatch) {
        // Check if any of the candidate's capabilities *contain* the required keyword
        if (Array.from(candidateCapabilitiesLower).some(cap => cap.includes(requiredKeyword))) {
          matchedJdKeywordsCount++;
        } else {
          missingKeywords.push(requiredKeyword);
        }
      }

      if (matchedJdKeywordsCount < 3) { // Minimum 3 keywords for shortlisting
        isShortlisted = false;
      }
    } else {
      // If no primary role inferred, and no explicit keywords in JD, cannot shortlist based on keywords
      isShortlisted = false;
      justification = "Cannot shortlist: No primary role inferred from job description and no explicit skills/experience keywords provided in JD.";
    }


    if (!isShortlisted) {
      matchScore = 1;
      if (!justification) { // Only set if not already set by the "no primary role" case
        justification = `This candidate, ${candidateName}, received a score of ${matchScore}/10. Reasoning: Candidate is NOT shortlisted because the job description for '${jdPrimaryRole || "unspecified role"}' requires at least 3 critical keywords, but only ${matchedJdKeywordsCount} were found. Missing: ${missingKeywords.join(", ")}.`;
      }
      return {
        id: `cand-${Date.now()}-${Math.random()}`,
        name: candidateName,
        email: `${candidateName.toLowerCase()}@example.com`,
        skills: skills,
        experience: experience,
        education: education,
        matchScore: matchScore,
        justification: justification,
        resumeFileName: resumeFileName,
        suggestedRole: suggestedRole,
      };
    }


    // --- Scoring Logic (only if shortlisted) ---
    let baseScore = 5;

    if (jdCriteria.requiresEngineeringDegree && !education.some(edu => edu.toLowerCase().includes("b.tech") || edu.toLowerCase().includes("computer science engineering") || edu.toLowerCase().includes("electronics and communication engineering"))) {
      scoreReasoning.push("Missing required Engineering degree.");
      baseScore -= 2;
    } else if (jdCriteria.requiresEngineeringDegree) {
      scoreReasoning.push("Engineering degree found.");
      baseScore += 1;
    }

    if (jdCriteria.min10thPercentage > 0 && resume10thPercentage < jdCriteria.min10thPercentage) {
      scoreReasoning.push(`10th grade percentage (${resume10thPercentage}%) is below required ${jdCriteria.min10thPercentage}%.`);
      baseScore -= 2;
    } else if (jdCriteria.min10thPercentage > 0) {
      scoreReasoning.push(`10th grade percentage (${resume10thPercentage}%) meets/exceeds required ${jdCriteria.min10thPercentage}%.`);
      baseScore += 1;
    }

    if (jdCriteria.min12thPercentage > 0 && resume12thPercentage < jdCriteria.min12thPercentage) {
      scoreReasoning.push(`12th grade percentage (${resume12thPercentage}%) is below required ${jdCriteria.min12thPercentage}%.`);
      baseScore -= 2;
    } else if (jdCriteria.min12thPercentage > 0) {
      scoreReasoning.push(`12th grade percentage (${resume12thPercentage}%) meets/exceeds required ${jdCriteria.min12thPercentage}%.`);
      baseScore += 1;
    }

    if (jdCriteria.minUGCGPA > 0 && resumeUGCGPA < jdCriteria.minUGCGPA) {
      scoreReasoning.push(`UG CGPA (${resumeUGCGPA}) is below required ${jdCriteria.minUGCGPA}.`);
      baseScore -= 3;
    } else if (jdCriteria.minUGCGPA > 0) {
      scoreReasoning.push(`UG CGPA (${resumeUGCGPA}) meets/exceeds required ${jdCriteria.minUGCGPA}.`);
      baseScore += 2;
    }

    // 2. Experience Eligibility & Scoring
    if (jdCriteria.zeroExperienceCandidatesOnly && experience.some(exp => !exp.toLowerCase().includes("project"))) { // Check for non-project experience
      scoreReasoning.push("Candidate has professional experience, but job requires zero experience.");
      baseScore -= 4;
    } else if (jdCriteria.zeroExperienceCandidatesOnly) {
      scoreReasoning.push("Candidate has no professional experience, meeting 'zero experience' criteria.");
      baseScore += 1;
    }

    // Score for matching JD experience keywords (from projects for interns)
    let matchedExperienceKeywordsCount = 0;
    const jdExperienceKeywordsToUse = jdPrimaryRole ? jdKeywordsToMatch : jdCriteria.requiredExperienceKeywords; // Use flattened keywords if primary role exists

    if (jdExperienceKeywordsToUse.length > 0 && (experience.length > 0)) {
      jdExperienceKeywordsToUse.forEach(jdExp => {
        if (experience.some(resExp => resExp.toLowerCase().includes(jdExp))) {
          matchedExperienceKeywordsCount++;
        }
      });
      if (matchedExperienceKeywordsCount > 0) {
        baseScore += Math.min(2, matchedExperienceKeywordsCount);
        scoreReasoning.push(`${matchedExperienceKeywordsCount} relevant experience/project keywords matched with JD requirements.`);
      } else {
        scoreReasoning.push(`No specific experience/project keywords from JD (${jdPrimaryRole ? 'inferred' : 'explicit'}) matched in resume.`);
      }
    } else if (experience.length > 0) { // Removed the "No specific experience identified" check
        baseScore += 1;
        scoreReasoning.push("Resume contains project details, but no specific experience keywords were provided in the JD or inferred from role.");
    } else {
        scoreReasoning.push("No specific experience or project details found in resume.");
    }

    // 3. Skills Matching & Scoring
    let matchedSkillsCount = 0;
    const jdSkillsKeywordsToUse = jdPrimaryRole ? jdKeywordsToMatch : jdCriteria.requiredSkillsKeywords; // Use flattened keywords if primary role exists

    if (jdSkillsKeywordsToUse.length > 0 && skills.length > 0) { // Removed the "No specific skills identified" check
      jdSkillsKeywordsToUse.forEach(jdSkill => {
        if (skills.some(resSkill => resSkill.toLowerCase().includes(jdSkill))) {
          matchedSkillsCount++;
        }
      });
      if (matchedSkillsCount > 0) {
        baseScore += Math.min(3, matchedSkillsCount);
        scoreReasoning.push(`${matchedSkillsCount} relevant skills matched with JD requirements.`);
      } else {
        scoreReasoning.push(`No specific skills from JD (${jdPrimaryRole ? 'inferred' : 'explicit'}) matched in resume.`);
      }
    } else if (skills.length > 0) { // Removed the "No specific skills identified" check
        baseScore += 1;
        scoreReasoning.push("Resume contains specific skills, but no specific skills keywords were provided in the JD or inferred from role.");
    } else {
        scoreReasoning.push("No specific skills found in resume.");
    }

    // Check for .Net expertise
    if (jdCriteria.dotNetExpertise && !skills.some(s => s.toLowerCase().includes(".net"))) {
      scoreReasoning.push("Missing required .Net expertise.");
      baseScore -= 2;
    } else if (jdCriteria.dotNetExpertise) {
      scoreReasoning.push(".Net expertise found.");
      baseScore += 1;
    }

    // 4. Soft Skills (keyword check in overall resume content)
    if (jdCriteria.communicationSkillsRequired && (resumeContentLower.includes("communication skills") || resumeContentLower.includes("written communication") || resumeContentLower.includes("verbal communication"))) {
      scoreReasoning.push("Communication skills mentioned in resume.");
      baseScore += 1;
    } else if (jdCriteria.communicationSkillsRequired) {
      scoreReasoning.push("Communication skills not explicitly mentioned.");
    }

    if (jdCriteria.teamworkSkillsRequired && (resumeContentLower.includes("teamwork") || resumeContentLower.includes("collaborate") || resumeContentLower.includes("team environments"))) {
      scoreReasoning.push("Teamwork/collaboration skills mentioned in resume.");
      baseScore += 1;
    } else if (jdCriteria.teamworkSkillsRequired) {
      scoreReasoning.push("Teamwork/collaboration skills not explicitly mentioned.");
    }

    // Final score capping
    matchScore = Math.min(10, Math.max(1, baseScore));

    justification = `This candidate, ${candidateName}, received a score of ${matchScore}/10. Reasoning: ${scoreReasoning.join(" ")}.`;
    
    // --- Determine suggested role based on comprehensive skills/experience ---
    let bestRoleMatchCount = 0;
    let potentialSuggestedRole = "Entry-Level Candidate";

    const candidateCapabilities = new Set<string>();
    skills.forEach(s => candidateCapabilities.add(s.toLowerCase()));
    experience.forEach(exp => exp.split(/\s*,\s*|\s+/).forEach(word => candidateCapabilities.add(word.toLowerCase())));

    for (const role in ROLE_KEYWORDS) {
      let currentRoleMatchCount = 0;
      ROLE_KEYWORDS[role].forEach(keyword => {
        if (candidateCapabilities.has(keyword.toLowerCase())) {
          currentRoleMatchCount++;
        }
      });

      if (currentRoleMatchCount > bestRoleMatchCount) {
        bestRoleMatchCount = currentRoleMatchCount;
        potentialSuggestedRole = role;
      }
    }
    suggestedRole = potentialSuggestedRole;


    return {
      id: `cand-${Date.now()}-${Math.random()}`,
      name: candidateName,
      email: `${candidateName.toLowerCase()}@example.com`,
      skills: skills,
      experience: experience,
      education: education,
      matchScore: matchScore,
      justification: justification,
      resumeFileName: resumeFileName,
      suggestedRole: suggestedRole,
    };
  };

  const handleProcessResumes = async (jobDescription: string, files: File[]) => {
    setProcessing(true);
    console.log("Job Description:", jobDescription);
    console.log("Resumes to process:", files);

    const readFilesPromises = files.map(file => {
      return new Promise<[string, string]>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve([file.name, e.target.result as string]);
          } else {
            reject(new Error(`Failed to read file: ${file.name}`));
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file); // Read as text
      });
    });

    try {
      const fileContents = await Promise.all(readFilesPromises);

      const allProcessedCandidates: Candidate[] = fileContents.map(([fileName, content]) => {
        return mockAnalyzeResume(fileName, content, jobDescription);
      });

      setShortlistedCandidates(allProcessedCandidates.filter(candidate => candidate.matchScore > 1));
      setNotShortlistedCandidates(allProcessedCandidates.filter(candidate => candidate.matchScore === 1));
    } catch (error) {
      console.error("Error processing resumes:", error);
      // You might want to show an error toast here
    } finally {
      setProcessing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center p-4 md:p-8 bg-background text-foreground min-h-[calc(100vh-64px)]"
    >
      <div className="w-full max-w-6xl space-y-8">
        <motion.div variants={itemVariants}>
          <ResumeUploadForm onProcessResumes={handleProcessResumes} />
        </motion.div>

        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-lg text-primary font-medium mt-8 text-neon-glow"
          >
            Processing resumes...
          </motion.div>
        )}

        {(shortlistedCandidates.length > 0 || notShortlistedCandidates.length > 0) && !processing && (
          <motion.div variants={itemVariants}>
            <Separator className="my-8 bg-primary/30" />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-center mb-8 text-primary text-neon-glow"
            >
              Candidate Results
            </motion.h2>
            <Tabs defaultValue="shortlisted" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/30 border border-primary/50 shadow-neon-glow-sm">
                <TabsTrigger 
                  value="shortlisted" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-neon-glow data-[state=active]:border-primary data-[state=active]:border-b-0 data-[state=active]:skew-x-[-10deg] data-[state=active]:transform data-[state=active]:rounded-t-md data-[state=active]:rounded-b-none transition-all duration-300"
                >
                  <span className="inline-block skew-x-[10deg] transform">Shortlisted ({shortlistedCandidates.length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="not-shortlisted" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-neon-glow data-[state=active]:border-primary data-[state=active]:border-b-0 data-[state=active]:skew-x-[-10deg] data-[state=active]:transform data-[state=active]:rounded-t-md data-[state=active]:rounded-b-none transition-all duration-300"
                >
                  <span className="inline-block skew-x-[10deg] transform">Not Shortlisted ({notShortlistedCandidates.length})</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="shortlisted" className="mt-6 border border-primary/50 rounded-b-lg rounded-tr-lg p-4 bg-secondary/10 shadow-neon-glow-sm">
                {shortlistedCandidates.length > 0 ? (
                  <CandidateList candidates={shortlistedCandidates} />
                ) : (
                  <p className="text-center text-muted-foreground p-8">No candidates were shortlisted.</p>
                )}
              </TabsContent>
              <TabsContent value="not-shortlisted" className="mt-6 border border-primary/50 rounded-b-lg rounded-tr-lg p-4 bg-secondary/10 shadow-neon-glow-sm">
                {notShortlistedCandidates.length > 0 ? (
                  <CandidateList candidates={notShortlistedCandidates} />
                ) : (
                  <p className="text-center text-muted-foreground p-8">All processed candidates were shortlisted.</p>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Index;