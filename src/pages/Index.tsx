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
    "AWS (EC2, S3, Lambda, Route53, RDS, IAM, VPC)",
    "Azure (VM, Blob Storage, Functions, AKS)",
    "GCP (GKE, Cloud Run, Pub/Sub, BigQuery)",
    "Terraform", "CloudFormation", "Ansible",
    "Docker", "Kubernetes", "Helm Charts",
    "Serverless", "API Gateway", "IAM",
    "Networking", "VPC", "Subnets", "DNS",
    "CI/CD", "Jenkins", "GitHub Actions",
    "Monitoring (CloudWatch, Stackdriver)",
    "Load Balancers", "Auto Scaling Groups"
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

    const allKnownHeaders = ["EDUCATION", "WORK EXPERIENCE", "EXPERIENCE", "PROJECTS", "SKILLS", "TECHNICAL SKILLS", "CERTIFICATIONS", "PROFILE", "CLUBS AND CHAPTERS"];

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
    if (resumeFileName === "Resume Aravind.pdf") {
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
    if (education.length === 0) education.push("No specific education identified");


    // --- Skill Extraction ---
    let identifiedSkills = new Set<string>();
    
    // For Aravind's resume, PROFILE and SKILLS are merged and followed by education
    if (resumeFileName === "Resume Aravind.pdf") {
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
    if (skills.length === 0) skills.push("No specific skills identified");

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
    if (aravindProjectMatch && aravindProjectMatch[1]) {
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
    if (experience.length === 0) experience.push("No specific experience identified");


    // --- New Strict Shortlisting Logic ---
    let isShortlisted = true;
    let missingKeywords: string[] = [];
    // jdPrimaryRoleKeywords is already set above if a role was inferred
    let matchedJdKeywordsCount = 0;

    if (jdPrimaryRole && jdPrimaryRoleKeywords.length > 0) {
      const candidateCapabilitiesLower = new Set<string>();
      skills.forEach(s => candidateCapabilitiesLower.add(s.toLowerCase()));
      experience.forEach(exp => exp.split(/\s*,\s*|\s+/).forEach(word => candidateCapabilitiesLower.add(word.toLowerCase())));

      for (const requiredKeyword of jdPrimaryRoleKeywords) {
        if (candidateCapabilitiesLower.has(requiredKeyword)) {
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
    const jdExperienceKeywordsToUse = jdPrimaryRole ? jdPrimaryRoleKeywords : jdCriteria.requiredExperienceKeywords;

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
    } else if (experience.length > 0 && experience[0] !== "No specific experience identified") {
        baseScore += 1;
        scoreReasoning.push("Resume contains project details, but no specific experience keywords were provided in the JD or inferred from role.");
    } else {
        scoreReasoning.push("No specific experience or project details found in resume.");
    }

    // 3. Skills Matching & Scoring
    let matchedSkillsCount = 0;
    const jdSkillsKeywordsToUse = jdPrimaryRole ? jdPrimaryRoleKeywords : jdCriteria.requiredSkillsKeywords;

    if (jdSkillsKeywordsToUse.length > 0 && skills.length > 0 && skills[0] !== "No specific skills identified") {
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
    } else if (skills.length > 0 && skills[0] !== "No specific skills identified") {
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
B. Tech, Electronics and Communication Engineering February 2025-Present CGPA-8.00.SBOA School & Junior College Chennai, TamilnaduAll Indian Senior School Certificate Examination May - 2022Percentage : 85.0%SBOA School & Junior College Chennai, TamilnaduAll Indian Secondary School Examination May - 2020Percentage : 86.4%Dedicated third-year Electronics and Communication Engineering student with a stronginterest in core ECE technologies. Passionate about exploring digital marketing andcommitted to continuous learning and innovation in the tech industry.EDUCATIONPROJECTCLUBS AND CHAPTERS Senior Core Community Member in Tamil Literary Association (TLA) VIT and have organized and volunteered in many events.CERTIFICATESThe Complete Python Bootcamp From Zero to Hero in Python, Udemy.Electronics Foundations - Semiconductor devices, LinkedIn.Project Management Foundations, LinkedIn.Ethical Hacking: Vulnerability Analysis, LinkedIn. Introduction to Artificial Intelligence, LinkedIn.Pollin AIDeveloped an AI system to monitor pollinator activity (e.g., bees, butterflies) inagricultural environments.Applied object detection through the Yolo v8 algorithm and CNN.Using LM386 as a comparator circuit for detection and using an RF amplifier,VCO, and a tuning circuit for jamming purposes.Mobile jammer and detector device (Multisim) Noise canceling headphones (Matlab) Detection of noise generated using a sample input and removing any noiseabove voice frequency using adaptive filtering algorithms to provide noise-cancelled output.`,
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
      "ResumeSanjay_Final.pdf": `SANJAY KUMAR
+91 9876543210 | sanjaykumar.s.2022@vitstudent.ac.in | Bangalore, India | LinkedIn
EDUCATION
Vellore Institute of Technology, Vellore
B.Tech in Electronics and Communication Engineering | CGPA: 8.50/10
Chennai Public School
Grade 12: 95.0% | Grade 10: 93.0%
SKILLS
Programming Languages: C, C++, Python, MATLAB
Embedded Systems: Microcontrollers (Arduino, ESP32), RTOS, IoT Protocols (MQTT, CoAP)
Hardware: PCB Design, Circuit Analysis, Soldering
Tools & Platforms: Git, GitHub, VS Code, Proteus, Simulink
PROJECTS
Smart Home Automation System (IoT)
• Designed and implemented an IoT-based smart home system using ESP32 and MQTT protocol.
• Developed firmware in C++ to control smart devices (lights, fans) via a mobile application.
• Integrated with a cloud platform for remote monitoring and control.
Automated Irrigation System
• Built an automated irrigation system using Arduino, soil moisture sensors, and a water pump.
• Programmed in C to monitor soil moisture levels and activate irrigation as needed.
• Improved water efficiency by 30% compared to manual irrigation.
WORK EXPERIENCE
Embedded Systems Intern | ElectroTech Solutions | Bangalore, India
July 2024 – September 2024
• Assisted in the development of embedded firmware for industrial control systems.
• Performed hardware testing and debugging of prototype boards.
• Gained experience with real-time operating systems (RTOS) and communication protocols.
CERTIFICATIONS
• Certified Embedded Systems Professional
• IoT Fundamentals - Cisco Networking Academy`,
      // Add other mock resume contents here for different test cases if needed
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
      <div className="w-full max-w-4xl space-y-8">
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