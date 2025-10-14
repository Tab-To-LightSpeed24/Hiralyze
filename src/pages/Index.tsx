import React, { useState } from "react";
import ResumeUploadForm from "@/components/ResumeUploadForm";
import CandidateList from "@/components/CandidateList";
import { Candidate } from "@/types";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs components
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

  // NEW: Multi-pass parsing engine
  const mockAnalyzeResume = (resumeFileName: string, resumeContent: string, jobDescription: string): Candidate => {
    const candidateName = resumeFileName.split('.')[0];
    const resumeContentLower = resumeContent.toLowerCase();
    const jobDescriptionLower = jobDescription.toLowerCase();

    // --- Pass 1: Structure Identification ---
    const allKnownHeaders = [
        "PROFILE", "EDUCATION", "SKILLS", "TECHNICAL SKILLS", "WORK EXPERIENCE", 
        "EXPERIENCE", "PROJECTS", "PROJECT", "CERTIFICATIONS", "PUBLICATIONS", 
        "AWARDS", "LANGUAGES", "INTERESTS"
    ];
    const sectionMap: { header: string; index: number }[] = [];
    allKnownHeaders.forEach(header => {
        const regex = new RegExp(`(?:^|\\n)${header.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}(?:\\n|\\s|:|$)`, 'ig');
        let match;
        while ((match = regex.exec(resumeContent)) != null) {
            sectionMap.push({ header, index: match.index });
        }
    });
    sectionMap.sort((a, b) => a.index - b.index);

    // --- Pass 2: Section-Specific Extraction ---
    let education: string[] = [];
    let experience: string[] = [];
    let explicitSkills = new Set<string>();
    let resumeUGCGPA = 0;

    const getSectionContent = (header: string): string => {
        const section = sectionMap.find(s => s.header.toLowerCase() === header.toLowerCase());
        if (!section) return "";
        const currentIndex = sectionMap.findIndex(s => s.index === section.index);
        const nextSection = sectionMap[currentIndex + 1];
        const startIndex = section.index + section.header.length;
        const endIndex = nextSection ? nextSection.index : resumeContent.length;
        return resumeContent.substring(startIndex, endIndex).trim();
    };
    
    const parseEntries = (text: string): string[] => text.split('\n').map(line => line.replace(/•/g, '').trim()).filter(line => line.length > 2 && line.split(' ').length > 1);

    // Education
    const educationContent = getSectionContent("EDUCATION");
    if (educationContent) {
        education = parseEntries(educationContent);
        const cgpaMatch = educationContent.match(/CGPA[-:\s/]*(\d+\.?\d*)/i);
        if (cgpaMatch) resumeUGCGPA = parseFloat(cgpaMatch[1]);
    }

    // Experience & Projects
    const workExpContent = getSectionContent("WORK EXPERIENCE") || getSectionContent("EXPERIENCE");
    const projectsContent = getSectionContent("PROJECTS") || getSectionContent("PROJECT");
    if (workExpContent) experience.push(...parseEntries(workExpContent));
    if (projectsContent) experience.push(...parseEntries(projectsContent));

    // Skills
    const skillsContent = getSectionContent("SKILLS") || getSectionContent("TECHNICAL SKILLS");
    if (skillsContent) {
        skillsContent.split('\n').forEach(line => {
            const cleanedLine = line.replace(/•/g, '').trim();
            const parts = cleanedLine.split(':');
            const skillsString = (parts.length > 1 ? parts[1] : parts[0]).trim();
            skillsString.split(/, |,|; /).map(s => s.trim().replace(/\.$/, '')).filter(Boolean).forEach(skill => explicitSkills.add(skill));
        });
    }

    // --- Pass 3: Contextual Keyword Inference ---
    const allKeywords = new Set(Object.values(ROLE_KEYWORDS).flat());
    const inferredSkills = new Set<string>();
    allKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(resumeContent)) {
            inferredSkills.add(keyword);
        }
    });

    // --- Pass 4: Data Consolidation ---
    const finalSkills = Array.from(new Set([...explicitSkills, ...inferredSkills]));

    // --- JD Parsing and Matching ---
    let jdPrimaryRole: string | undefined;
    let jdPrimaryRoleKeywords: string[] = [];
    for (const role in ROLE_KEYWORDS) {
      const roleParts = role.toLowerCase().split(/\s*\/\s*|\s+and\s+/);
      if (roleParts.some(part => jobDescriptionLower.includes(part) && part.length > 3)) {
        jdPrimaryRole = role;
        jdPrimaryRoleKeywords = ROLE_KEYWORDS[role].map(k => k.toLowerCase());
        break;
      }
    }
    const explicitJdKeywords = (jobDescription.match(/(?:skills|requirements|proficient in):?\s*([\s\S]+)/i)?.[1]?.split(/,|\n|•/).map(s => s.trim().toLowerCase()).filter(Boolean)) || [];
    const jdKeywordsToMatch = new Set<string>([...jdPrimaryRoleKeywords, ...explicitJdKeywords]);
    const finalJdKeywords = Array.from(jdKeywordsToMatch);

    // --- Suggested Role (based on inferred skills) ---
    let bestRoleMatchCount = 0;
    let suggestedRole = "General Candidate";
    for (const role in ROLE_KEYWORDS) {
        let currentRoleMatchCount = 0;
        ROLE_KEYWORDS[role].forEach(keyword => {
            if (inferredSkills.has(keyword)) currentRoleMatchCount++;
        });
        if (currentRoleMatchCount > bestRoleMatchCount) {
            bestRoleMatchCount = currentRoleMatchCount;
            suggestedRole = role;
        }
    }

    // --- Scoring & Justification ---
    let matchScore = 0;
    let justification = "";
    let scoreReasoning: string[] = [];
    
    const matchedJdKeywordsCount = finalJdKeywords.filter(keyword => resumeContentLower.includes(keyword)).length;

    if (finalJdKeywords.length > 0 && matchedJdKeywordsCount < 3) {
        matchScore = 1;
        justification = `Candidate is not shortlisted. The job requires at least 3 matching keywords, but only ${matchedJdKeywordsCount} were found.`;
    } else if (finalJdKeywords.length === 0) {
        matchScore = 1;
        justification = "Cannot shortlist: No relevant technical keywords could be identified from the job description.";
    } else {
        let baseScore = 5;
        scoreReasoning.push(`${matchedJdKeywordsCount} keywords matched.`);
        baseScore += Math.min(3, matchedJdKeywordsCount - 3);
        
        const jdCriteria = {
          minUGCGPA: parseFloat(jobDescription.match(/UG min CGPA (\d+\.?\d*)/)?.at(1) || '0'),
          zeroExperienceCandidatesOnly: jobDescriptionLower.includes("zero experience candidates only"),
        };

        if (jdCriteria.minUGCGPA > 0 && resumeUGCGPA > 0 && resumeUGCGPA < jdCriteria.minUGCGPA) {
            scoreReasoning.push(`UG CGPA (${resumeUGCGPA}) is below required ${jdCriteria.minUGCGPA}.`); baseScore -= 3;
        }
        if (jdCriteria.zeroExperienceCandidatesOnly && experience.some(exp => !exp.toLowerCase().includes("project"))) {
            scoreReasoning.push("Candidate has professional experience, but job requires zero experience."); baseScore -= 4;
        }

        matchScore = Math.min(10, Math.max(1, baseScore));
        justification = `This candidate received a score of ${matchScore}/10. Reasoning: ${scoreReasoning.join(" ")}.`;
    }

    return { 
        id: `cand-${Date.now()}-${Math.random()}`, 
        name: candidateName, 
        email: `${candidateName.toLowerCase()}@example.com`, 
        skills: finalSkills, 
        experience, 
        education, 
        matchScore, 
        justification, 
        resumeFileName, 
        suggestedRole 
    };
  };

  const handleProcessResumes = (jobDescription: string, files: File[]) => {
    setProcessing(true);
    console.log("Job Description:", jobDescription);
    console.log("Resumes to process:", files);

    // Simulate reading file content (for demonstration, we'll use a hardcoded string for the specific test case)
    const mockResumeContentMap: { [key: string]: string } = {
      "testing.pdf": "Senior Software Engineer with 6 years experience. Proficient in React.js, Node.js, and AWS cloud services. Proven track record of solving complex technical challenges. Education: B.S. in Computer Science, 8.5 CGPA. 12th grade: 90%. 10th grade: 85%.",
      "another_resume.pdf": "Junior Developer with 2 years experience in JavaScript. Education: B.S. in Information Technology, 6.5 CGPA. 12th grade: 70%.",
      "no_education.pdf": "Experienced Project Manager with 10 years in agile environments. Led multiple successful product launches.",
      "poorly_formatted_edu.pdf": "Project Lead. Experience in team management. Education section: University of XYZ, Graduated 2010. No specific grades mentioned.",
      "Kaushik_resume_8.pdf": `Education
Vellore Institute of Technology, B.Tech. Computer Science | CGPA: 7.75 Sept 2022 – May 2026
Chennai Public School | Grade 12: 91.0% | Grade 10: 94.6% 2022 | 2020
Technical Skills
• Languages: Python, TypeScript, SQL, C++, Deno, Java
• Full-Stack Development: React.js, Vite, Tailwind CSS, shadcn/ui, FastAPI, PostgreSQL, Supabase,
SQLAlchemy, REST APIs
• AI/ML: PyTorch, TensorFlow, Hugging Face Transformers (ROBERTa), Scikit-learn, OpenAI API, NumPy,
Panda
• Computer Vision & Audio: OpenCV, Librosa, MFCC, ResNet18, CUDA/GPU
• Tools & Collaboration: Git, Postman, Figma, Discord.py
Projects
CommunityClara AI - Discord Moderation Platform Link to Github
• Engineered a full-stack, privacy-first Discord moderation platform using a Python (FastAPI) backend,
PostgreSQL database, and React dashboard. The platform leverages Hugging Face Transformers for content
analysis and implements a novel Federated Learning architecture to ensure user data never leaves the local
server.
• Implemented Differential Privacy to mathematically guarantee user anonymity during collaborative model
training, leading to a 75%+ reduction in harmful content and a 60% decrease in moderator workload.
Achieved high performance with <500ms message analysis time and real-time dashboard updates with
<100ms latency.
Multimodal Emotion Recognition System (ERIC)
• Built deep learning system achieving 74.11% accuracy on 13,708 video clips for 7-emotion classification
using RoBERTa (text), ResNet18 (visual), and MFCC (audio) features with late fusion architecture.
• Optimized training pipeline reducing processing time by 40% through batch optimization and implemented
real-time inference capabilities.
TradeRadar – Trading Strategy & Analytics Platform Link to Website
• Developed a full-stack trading analytics platform where users build custom market strategies, receive
real-time Telegram alerts, and log trades in a journal. Built the responsive UI with React, TypeScript, Vite,
shadcn/ui, and Tailwind CSS.
• Architected a secure, serverless backend using Supabase, leveraging Postgres with Row Level Security for
data isolation and Deno-based Edge Functions. The core includes a strategy-engine processing live market
data from the Twelve Data API and an AI assistant powered by a natural language command-parser.`,
      "Resume Aravind.pdf": `ARAVIND SA
| saaravind16@gmail.com | LinkedIn
PROFILESoftware skills - Verilog HDL, MATLAB, and Simulation - Multisim.Programming Skills - Python, C, C++, HTML, CSS, Java, JavaScript, ReactJS. Soft Skills - Project Management, Team Work, Communication, Leadership.Volunteer experience - Technical and cultural fest organizing committee.SKILLS Vellore Institute of Technology Vellore, Tamilnadu
B. Tech, Electronics and Communication Engineering February 2025-Present CGPA-8.00.SBOA School & Junior College Chennai, TamilnaduAll Indian Senior School Certificate Examination May - 2022Percentage : 85.0%SBOA School & Junior College Chennai, TamilnaduAll Indian Secondary School Examination May - 2020Percentage : 86.4%Dedicated third-year Electronics and Communication Engineering student with a stronginterest in core ECE technologies. Passionate about exploring digital marketing andcommitted to continuous learning and innovation in the tech industry.EDUCATIONPROJECTCLUBS AND CHAPTERS Senior Core Community Member in Tamil Literary Association (TLA) VIT and have organized and volunteered in many events.CERTIFICATESThe Complete Python Bootcamp From Zero to Hero in Python, Udemy.Electronics Foundations - Semiconductor devices, LinkedIn.Project Management Foundations, LinkedIn.Ethical Hacking: Vulnerability Analysis, LinkedIn. Introduction to Artificial Intelligence, LinkedIn.
Pollin AIDeveloped an AI system to monitor pollinator activity (e.g., bees, butterflies) inagricultural environments.Applied object detection through the Yolo v8 algorithm and CNN.
Mobile jammer and detector device (Multisim)Using LM386 as a comparator circuit for detection and using an RF amplifier,VCO, and a tuning circuit for jamming purposes.
Noise canceling headphones (Matlab)Detection of noise generated using a sample input and removing any noiseabove voice frequency using adaptive filtering algorithms to provide noise-cancelled output.`,
      "Vishakan_latest_August_resume.pdf": `SKILLS
• Programming: Python, Java, SQL, R, Bash.
• Cloud Computing: Amazon Web Services (AWS).
• ML, DL&AI: Scikit-learn, TensorFlow, Pytorch, Transformers (BERT, RoBERTa), Vision Transformers (ViT).
• Data Handling and Visualization: Pandas, NumPy, Tableau, Data Cleaning
• Languages: English, Tamil, Hindi (Basic), French (Basic)
EDUCATION
Vellore Institute of Technology, Vellore 2022 - Present
• B. Tech in Computer Science Engineering Vellore, India
• CGPA: 8.45/10
Chennai Public School 2020 - 2022
• Central Board of Secondary Education (CBSE) Chennai, India
• Grade 12: 94.8%
• Grade 10: 94.6%
WORK EXPERIENCE
Machine Learning Intern
Salcomp India Pvt Ltd, Chennai, India June 2025 – July 2025
• Prototyped machine learning solutions to predict industrial equipment failures using real-time MySQL data.
• Developed customized LSTM-based models to forecast next failure events and automate risk alerts.
• Integrated ML models into a Flask web app to support intelligent decision-making.
CERTIFICATIONS
• Amazon Web Services: Holder of AWS Cloud Practitioner Certification.
• IBM AI Engineer: Achieved IBM AI Engineering Professional Certification.
• My Captain Data Analytics: Earned external certification on Data Analytics on My Captain platform with LOR
PROJECTS
Multimodal Emotion Recognition System (MELD Dataset) using Fusion
• Achieved 67% accuracy on 7-emotion classification from 13,708 videos by fusing text (RoBERTa), audio (MFCC), and visual (ResNet18) features, outperforming unimodal baselines by 86%.
• Optimized training pipeline with late fusion architecture, reducing convergence time by 40%
Quantum vs Classical Maze Pathfinding
• Designed a comparative maze pathfinding framework implementing classical A search and quantum Grover’s algorithm.
• Demonstrated theoretical speedup of Grover’s algorithm over A* in complex maze environments, using Qiskit simulations and analysed scaling behaviour along with limitations.
Dynamic Traffic Route Planner with Live Simulation
• Developed a Python-based routing engine with Dijkstra, A*, and real`,
      "SANTHOSH_Resume.pdf": `SANTHOSH KUMAR
+91 9361610070 | santhoshkumar.s.2022@vitstudent.ac.in | Chennai, India | LinkedIn
EDUCATION
Vellore Institute of Technology, Vellore
B.Tech in Computer Science and Engineering | CGPA: 8.00/10
Chennai Public School
Grade 12: 90.0% | Grade 10: 92.0%
SKILLS
Programming Languages: Python, Java, C, C++
Web Technologies: HTML, CSS, JavaScript, React.js, Node.js, Express.js, MongoDB, SQL
Tools & Platforms: Git, GitHub, VS Code, Postman, Docker
Machine Learning: Scikit-learn, TensorFlow, Keras, Pandas, NumPy
PROJECTS
E-commerce Website (Full-Stack)
• Developed a responsive e-commerce platform using MERN stack (MongoDB, Express.js, React.js, Node.js).
• Implemented user authentication, product catalog, shopping cart, and payment gateway integration.
• Designed and managed database schema with MongoDB, ensuring data integrity and scalability.
AI-Powered Chatbot
• Built a chatbot using Python and TensorFlow, capable of understanding natural language queries.
• Integrated with a knowledge base to provide accurate and relevant responses to user questions.
• Achieved 85% accuracy in intent recognition and entity extraction.
WORK EXPERIENCE
Software Development Intern | Tech Solutions Inc. | Chennai, India
June 2024 – August 2024
• Collaborated with a team to develop and maintain web applications using React.js and Node.js.
• Contributed to the design and implementation of RESTful APIs for various features.
• Participated in code reviews and agile development sprints.
CERTIFICATIONS
• AWS Certified Cloud Practitioner
• Google IT Support Professional Certificate`,
      "ResumeSanjay_Final.pdf": `Experience
Novac Technology Solutions May 2025 – June 2025
FullStack Development Intern Chennai, TamilNadu
• Implemented microservices architecture using Node.js and Express, improving API response time by 25% and
reducing server load by 30%.
• Built and optimized React components for dynamic data rendering, streamlining API integration and improving user
engagement by 20%.
Team Ojas April 2023 – May 2024
Core Autonomous Developer VIT Vellore
• Improved core perception algorithms using YOLOv8, CNNs, and PyTorch, achieving over 95% object detection
accuracy and reducing false positives by 30%.
• Engineered path planning and navigation systems using A-star algorithm and Model Predictive Control (MPC),
enhancing route efficiency by 40% and enabling localization precision within 10 cm using SLAM.
Projects
Personal Finance Dashboard | React.js, Node.js, Express, MongoDB, TailwindCSS
• Built a secure family finance dashboard using MERN stack, with JWT authentication and role-based user access,
allowing families to collaboratively manage income and expenses.
• Designed a responsive, mobile-friendly UI using Tailwind CSS and React Hooks, integrating RESTful APIs to reduce
manual tracking effort by 80% and improve data visibility and user retention.
Online Payments Fraud Detection | Python, Scikit-learn, XGBoost, Flask
• Engineered a real-time fraud detection system using Python, Pandas, Scikit-learn, and XGBoost, achieving 99.5%
accuracy and minimizing false positives through model comparison, hyperparameter tuning, and evaluation on a
balanced dataset.
Cone detection for FS Driverless Competition | MATLAB, Simulink, YOLOv2, Unreal Engine
• Developed a cone detection system using YOLOv2 and MATLAB Simulink, achieving over 92% detection accuracy
on custom-labeled datasets.
• Simulated autonomous skidpad navigation using Unreal Engine and Vehicle Dynamics Blockset in MATLAB R2023a,
integrating real-time cone coordinates from the 3D Simulation Camera to validate vehicle control logic in
photorealistic environments.
Certifications
Professional Machine Learning Engineer | Google
• Designed and deployed scalable ML models, validating proficiency in production-ready systems with 90%+ model
performance benchmarks on Google Cloud Platform (GCP).
Formula Bharat’s DriverlessWorkshop | Formula Bharat
Education
Vellore Institute of Technology Expected May 2026
B.Tech in Electronics and Communication Engineering (CGPA: 9.07 / 10.00) Vellore, TamilNadu
Skills
Languages: Python, C, C++, Java, JavaScript
Technologies: HTML, CSS, React.js, Node.js, Express.js, SQL, JWT, TensorFlow, PyTorch, Bootstrap, Tailwind, Flask,
ASP.NET, Fast API, Restful API, Django, Flutter, Docker, AWS, MATLAB
Concepts: Compiler, Operating System, Data Structures and Algorithms, Software design, Object Oriented Programming,
Artificial Intelligence, Deep Learning, Big Data Analytics, Agile Methodology, Cloud Computing`,
      "Software Role Resume1.pdf": `
SKILLS
• Languages: Java, SQL
• Frameworks: Spring Boot, Hibernate
• Tools: Git, Maven, Docker
EXPERIENCE
Software Engineer at TechCorp
• Developed and maintained backend services using Java and Spring Boot.
• Wrote complex SQL queries for data retrieval and analysis.
EDUCATION
B.Tech in Computer Science | CGPA: 8.0`,
      "Senior Software Role Resume.pdf": `
SKILLS
• Languages: Python, Go
• Frameworks: Django, FastAPI
• Cloud: AWS, GCP
• Tools: Docker, Kubernetes, Terraform
EXPERIENCE
Senior Software Developer at Cloud Innovators
• Led a team to build a scalable microservices architecture on AWS.
• Designed and implemented CI/CD pipelines using Jenkins and Terraform.
EDUCATION
M.Tech in Computer Science`,
      "Embedded Role Resume2.pdf": `
SKILLS
• Languages: C++, C, Embedded C
• Microcontrollers: ARM, STM32, AVR
• Protocols: I2C, SPI, UART, CAN
• RTOS: FreeRTOS, Zephyr
• Tools: JTAG, Oscilloscope, KiCad
PROJECTS
Automotive Control Unit
• Developed firmware for an ECU using C++ and FreeRTOS.
• Implemented CAN bus communication for vehicle diagnostics.
EDUCATION
B.E in Electronics and Communication Engineering`,
      "IOT Role Resume3.pdf": `
SKILLS
• IoT Platforms: AWS IoT, Azure IoT Hub
• Hardware: Raspberry Pi, Arduino, ESP32
• Protocols: MQTT, CoAP, BLE, LoRaWAN
• Programming: Python, C++, MicroPython
• Cloud: AWS Lambda, S3
PROJECTS
Smart Home Automation System
• Designed an IoT system using ESP32 and MQTT to control home appliances.
• Developed a Python backend on AWS Lambda to process sensor data.
EDUCATION
B.Tech in Electrical Engineering | CGPA: 8.5`,
      "ML Engineer Role Resume4.pdf": `
SKILLS
• Programming: Python
• ML/DL Frameworks: PyTorch, TensorFlow, Scikit-learn, XGBoost
• MLOps: Docker, Kubernetes, MLflow, Airflow
• Cloud: AWS Sagemaker, Azure ML
• APIs: FastAPI, Flask
PROJECTS
Real-time Fraud Detection API
• Deployed a credit card fraud detection model using XGBoost.
• Built a REST API with FastAPI for real-time inference.
• Containerized the application with Docker for deployment.
EDUCATION
M.Tech in Artificial Intelligence | CGPA: 9.1`,
      "VLSI Engineer Role Resume5.pdf": `
SKILLS
• HDL: Verilog, SystemVerilog, VHDL
• Tools: Vivado, Quartus, Synopsys, Cadence
• Concepts: RTL Design, FPGA, ASIC, UVM, STA
• Scripting: Python, Perl, Tcl
PROJECTS
FPGA-based Image Processor
• Designed and implemented an image processing pipeline on a Xilinx FPGA.
• Wrote RTL code in Verilog and performed synthesis and timing analysis.
• Created a UVM testbench for verification.
EDUCATION
B.Tech in Electronics and Communication Engineering | CGPA: 8.8`,
    };

    setTimeout(() => {
      const allProcessedCandidates: Candidate[] = files.map(file => {
        const resumeContent = mockResumeContentMap[file.name] || `Content of ${file.name} is not mocked.`;
        return mockAnalyzeResume(file.name, resumeContent, jobDescription);
      });

      setShortlistedCandidates(allProcessedCandidates.filter(candidate => candidate.matchScore > 1));
      setNotShortlistedCandidates(allProcessedCandidates.filter(candidate => candidate.matchScore === 1));
      setProcessing(false);
    }, 1500); // Simulate network delay
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
      <div className="w-full max-w-6xl space-y-8"> {/* Changed max-w-4xl to max-w-6xl */}
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