import React, { useState } from "react";
import ResumeUploadForm from "@/components/ResumeUploadForm";
import CandidateList from "@/components/CandidateList";
import { Candidate, ExperienceEntry, EducationEntry } from "@/types"; // Import updated types
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } '@/lib/utils';
import { useSession } from '@/components/SessionContextProvider'; // To get auth token
import { showError } from '@/utils/toast';

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
  const { session } = useSession(); // Get session to retrieve auth token

  // Function to analyze candidate match based on structured data
  const analyzeCandidateMatch = (candidate: Candidate, jobDescription: string): Candidate => {
    let matchScore = 1; // Default to 1 (not shortlisted)
    let justification = "";
    let scoreReasoning: string[] = [];
    let isShortlisted = true;

    const jobDescriptionLower = jobDescription.toLowerCase();
    const candidateSkillsLower = candidate.skills.map(s => s.toLowerCase());
    const candidateExperienceLower = candidate.experience.flatMap(e => [e.title, e.company, ...e.description]).map(s => s.toLowerCase());
    const candidateEducationLower = candidate.education.flatMap(e => [e.degree, e.institution]).map(s => s.toLowerCase());

    // --- JD Parsing and Criteria Extraction ---
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

    const explicitKeywordsMatch = jobDescription.match(/(?:skills|requirements|proficient in|technologies|must have|experience with):?\s*([\s\S]+?)(?:\n\n|\n\s*(?:responsibilities|about the role|qualifications|education)|$)/i);
    const explicitKeywords = explicitKeywordsMatch?.[1]?.split(/,|\n|•|-/)
                                .map(s => s.trim().toLowerCase())
                                .filter(Boolean) || [];
    
    const jdKeywordsToMatch = new Set<string>([...jdPrimaryRoleKeywords, ...explicitKeywords]);
    
    // Fallback: If no primary role or explicit keywords, try to infer from general JD content
    if (!jdPrimaryRole && jdKeywordsToMatch.size < 5) { // If very few keywords found
        const allRoleKeywordsFlat = Object.values(ROLE_KEYWORDS).flat().map(k => k.toLowerCase());
        allRoleKeywordsFlat.forEach(keyword => {
            if (new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(jobDescriptionLower)) {
                jdKeywordsToMatch.add(keyword);
            }
        });
    }
    const finalJdKeywords = Array.from(jdKeywordsToMatch);

    const jdCriteria = {
      minUGCGPA: parseFloat(jobDescription.match(/UG min CGPA (\d+\.?\d*)/i)?.[1] || '0'),
      zeroExperienceCandidatesOnly: jobDescriptionLower.includes("zero experience candidates only") || jobDescriptionLower.includes("freshers only"),
      minExperienceYears: parseFloat(jobDescription.match(/(\d+)\+?\s*years?\s*experience/i)?.[1] || '0'),
    };

    // --- Initial Shortlisting Check & Justification ---
    if (finalJdKeywords.length === 0) {
        isShortlisted = false;
        justification = "Cannot shortlist: No relevant technical keywords could be identified from the job description.";
        scoreReasoning.push("No JD keywords identified.");
    } else {
        let matchedJdKeywordsCount = 0;
        finalJdKeywords.forEach(keyword => {
            if (candidateSkillsLower.includes(keyword) || candidateExperienceLower.some(exp => exp.includes(keyword))) matchedJdKeywordsCount++;
        });

        // Shortlisting criteria: minimum 10 keywords
        if (matchedJdKeywordsCount < 10) { 
            isShortlisted = false;
            justification = `Candidate is not shortlisted. Only ${matchedJdKeywordsCount} out of ${finalJdKeywords.length} key skills/keywords from the job description were found in the resume. A minimum of 10 keywords are required for shortlisting.`;
            scoreReasoning.push(`Low JD keyword match (${matchedJdKeywordsCount}/${finalJdKeywords.length}).`);
        } else {
            scoreReasoning.push(`${matchedJdKeywordsCount}/${finalJdKeywords.length} JD keywords matched.`);
        }
    }

    // The following checks for education and experience are now conditional based on JD requirements
    if (jdCriteria.minUGCGPA > 0) {
        const candidateUGCGPA = candidate.education.find(edu => edu.degree.toLowerCase().includes("bachelor") || edu.degree.toLowerCase().includes("ug"))?.gpa || 0;
        if (candidateUGCGPA === 0) {
            isShortlisted = false;
            justification = `Candidate is not shortlisted. Job requires a minimum UG CGPA of ${jdCriteria.minUGCGPA}, but no CGPA was found in the resume.`;
            scoreReasoning.push("Missing UG CGPA.");
        } else if (candidateUGCGPA < jdCriteria.minUGCGPA) {
            isShortlisted = false;
            justification = `Candidate is not shortlisted. UG CGPA (${candidateUGCGPA}) is below the required ${jdCriteria.minUGCGPA}.`;
            scoreReasoning.push(`UG CGPA (${candidateUGCGPA}) below required ${jdCriteria.minUGCGPA}.`);
        } else {
            scoreReasoning.push(`UG CGPA (${candidateUGCGPA}) meets requirement.`);
        }
        candidate.ugCgpa = candidateUGCGPA; // Store for display
    }

    const hasProfessionalExperience = candidate.experience.some(exp => !exp.title.toLowerCase().includes("project") && !exp.title.toLowerCase().includes("academic"));
    if (jdCriteria.zeroExperienceCandidatesOnly && hasProfessionalExperience) {
        isShortlisted = false;
        justification = `Candidate is not shortlisted. Job requires zero experience candidates only, but professional experience was found in the resume.`;
        scoreReasoning.push("Professional experience found, but JD requires zero experience.");
    } else if (jdCriteria.minExperienceYears > 0 && !hasProfessionalExperience) {
        isShortlisted = false;
        justification = `Candidate is not shortlisted. Job requires at least ${jdCriteria.minExperienceYears} years of experience, but no professional experience was clearly identified.`;
        scoreReasoning.push(`Missing required ${jdCriteria.minExperienceYears}+ years experience.`);
    } else if (jdCriteria.minExperienceYears > 0 && hasProfessionalExperience) {
        scoreReasoning.push(`Professional experience identified.`);
    }


    // --- Scoring Logic (if still shortlisted) ---
    if (isShortlisted) {
        matchScore = 5; // Base score for being shortlisted

        // Points for JD keyword match
        let matchedJdKeywordsCount = 0;
        finalJdKeywords.forEach(keyword => {
            if (candidateSkillsLower.includes(keyword) || candidateExperienceLower.some(exp => exp.includes(keyword))) matchedJdKeywordsCount++;
        });
        matchScore += Math.min(3, Math.floor(matchedJdKeywordsCount / Math.max(1, finalJdKeywords.length) * 5)); // Up to +3 points for keyword density

        // Points for relevant experience/projects
        let relevantExperienceCount = 0;
        candidate.experience.forEach(expEntry => {
            const expLower = `${expEntry.title} ${expEntry.company} ${expEntry.description.join(' ')}`.toLowerCase();
            if (finalJdKeywords.some(keyword => expLower.includes(keyword))) {
                relevantExperienceCount++;
            }
        });
        candidate.projects?.forEach(projEntry => {
            const projLower = `${projEntry.title} ${projEntry.description} ${projEntry.technologies?.join(' ')}`.toLowerCase();
            if (finalJdKeywords.some(keyword => projLower.includes(keyword))) {
                relevantExperienceCount++;
            }
        });
        matchScore += Math.min(2, Math.floor(relevantExperienceCount / Math.max(1, candidate.experience.length + (candidate.projects?.length || 0)) * 3)); // Up to +2 points

        // Points for academic performance (if relevant)
        if (jdCriteria.minUGCGPA > 0 && (candidate.ugCgpa || 0) >= jdCriteria.minUGCGPA) {
            matchScore += 1; // +1 point for meeting CGPA
        }

        // Cap score between 1 and 10
        matchScore = Math.min(10, Math.max(1, matchScore));
        justification = `This candidate received a score of ${matchScore}/10. Reasoning: ${scoreReasoning.join(" ")}.`;
    } else {
        // If not shortlisted, ensure score is 1 and justification is set
        matchScore = 1;
        if (!justification) justification = "Candidate did not meet the minimum shortlisting criteria.";
    }
    
    // --- Suggested Role ---
    let bestRoleMatchCount = 0;
    let potentialSuggestedRole = "Generalist / Entry-Level";
    const allCandidateKeywords = new Set([...candidateSkillsLower, ...candidateExperienceLower, ...candidateEducationLower]);

    for (const role in ROLE_KEYWORDS) {
        let currentRoleMatchCount = 0;
        ROLE_KEYWORDS[role].forEach(keyword => {
            if (allCandidateKeywords.has(keyword.toLowerCase())) {
                currentRoleMatchCount++;
            }
        });
        if (currentRoleMatchCount > bestRoleMatchCount) {
            bestRoleMatchCount = currentRoleMatchCount;
            potentialSuggestedRole = role;
        }
    }
    candidate.suggestedRole = potentialSuggestedRole;
    candidate.matchScore = matchScore;
    candidate.justification = justification;

    return candidate;
  };

  const handleProcessResumes = async (jobDescription: string, resumeTexts: { fileName: string, text: string }[]): Promise<Candidate[]> => {
    setProcessing(true);
    const processedCandidates: Candidate[] = [];
    const authToken = session?.access_token;

    if (!authToken) {
      showError("Authentication token not found. Please log in again.");
      setProcessing(false);
      return [];
    }

    for (const resumeData of resumeTexts) {
      try {
        const response = await fetch('https://dcxzxknlizesuengfhia.supabase.co/functions/v1/parse-resume', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json', // Now sending JSON
          },
          body: JSON.stringify({ // Send resumeText and jobDescription as JSON
            resumeText: resumeData.text,
            jobDescription: jobDescription,
            resumeFileName: resumeData.fileName,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to parse resume ${resumeData.fileName}: ${errorData.error || response.statusText}`);
        }

        const parsedData: Candidate = await response.json();
        processedCandidates.push(analyzeCandidateMatch(parsedData, jobDescription)); // Apply scoring after parsing
      } catch (error: any) {
        console.error(`Error processing ${resumeData.fileName}:`, error);
        showError(`Failed to process ${resumeData.fileName}: ${error.message}`);
        // Add a placeholder candidate for failed parsing
        processedCandidates.push({
          id: `failed-${Date.now()}-${Math.random()}`,
          name: resumeData.fileName.split('.')[0] || 'Unknown Candidate',
          email: 'N/A',
          skills: ['Parsing Failed'],
          experience: [{ title: 'N/A', company: 'N/A', startDate: 'N/A', endDate: 'N/A', description: ['Failed to extract data.'] }],
          education: [{ degree: 'N/A', institution: 'N/A', startDate: 'N/A', endDate: 'N/A' }],
          matchScore: 1,
          justification: `Failed to parse resume: ${error.message}`,
          resumeFileName: resumeData.fileName,
          suggestedRole: 'N/A',
        });
      }
    }

    setShortlistedCandidates(processedCandidates.filter(candidate => candidate.matchScore > 1));
    setNotShortlistedCandidates(processedCandidates.filter(candidate => candidate.matchScore === 1));
    setProcessing(false);
    return processedCandidates;
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