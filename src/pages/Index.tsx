import React, { useState } from "react";
import ResumeUploadForm from "@/components/ResumeUploadForm";
import CandidateList from "@/components/CandidateList";
import { Candidate, ExperienceEntry, EducationEntry, ProjectEntry } from "@/types";
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
    "Emission Standards", "ISO/TS 1699",
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

// --- NEW, ROBUST PARSING LOGIC ---

const splitResumeIntoSections = (text: string): { [key: string]: string } => {
    const sections: { [key: string]: string } = { header: '' };
    const lines = text.split('\n');
    
    const headerKeywords: { [key: string]: string[] } = {
        skills: ['skills', 'proficiencies', 'technical skills'],
        experience: ['experience', 'work experience', 'employment history', 'professional experience'],
        projects: ['projects', 'personal projects', 'academic projects'],
        education: ['education', 'academic background', 'academic profile'],
        certifications: ['certifications', 'licenses & certifications', 'courses'],
    };

    let currentSection = 'header';
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        let foundSection: string | null = null;
        if (trimmedLine.length < 30) {
            const lowerLine = trimmedLine.toLowerCase().replace(/[:•]/g, '');
            for (const [sectionName, keywords] of Object.entries(headerKeywords)) {
                if (keywords.some(keyword => lowerLine.startsWith(keyword))) {
                    foundSection = sectionName;
                    break;
                }
            }
        }

        if (foundSection) {
            currentSection = foundSection;
            if (!sections[currentSection]) sections[currentSection] = '';
        } else {
            sections[currentSection] = (sections[currentSection] || '') + line + '\n';
        }
    }
    return sections;
};

const parseSkills = (text: string): string[] => {
    if (!text) return [];
    const skills = new Set<string>();
    const stopWords = new Set(['and', 'in', 'the', 'with', 'for', 'of', 'a', 'an', 'experience', 'projects', 'education', 'skills', 'technical', 'languages', 'tools', 'concepts', 'technologies', 'collaboration', 'vellore', 'chennai', 'tamilnadu', 'india']);
    
    const cleanedText = text.replace(/•|:|\[|\]/g, ',').replace(/\(|\)/g, ',');
    
    const parts = cleanedText.split(/, |\n|; | \| /).map(s => s.trim());
    parts.forEach(part => {
        if (part && part.length > 1 && part.length < 30 && !/^\d+$/.test(part) && !stopWords.has(part.toLowerCase())) {
            skills.add(part.replace(/[.,]$/, ''));
        }
    });
    return Array.from(skills);
};

const parseEducation = (text: string): EducationEntry[] => {
    if (!text) return [];
    const entries: EducationEntry[] = [];
    const blocks = text.split(/\n\s*\n/).filter(b => b.trim() && /institute|university|college|school/i.test(b));

    blocks.forEach(block => {
        const lines = block.split('\n').filter(l => l.trim());
        if (lines.length === 0) return;

        const fullBlockText = lines.join(' ');
        const entry: EducationEntry = {
            institution: 'N/A', degree: 'N/A', startDate: 'N/A', endDate: 'N/A', description: lines,
        };

        const gpaMatch = fullBlockText.match(/(?:CGPA|gpa|percentage)[\s:]*(\d+\.?\d*)/i);
        if (gpaMatch) entry.gpa = parseFloat(gpaMatch[1]);

        const dateMatch = fullBlockText.match(/(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b\s+\d{4})\s*[-–—to\s]*(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b\s+\d{4}|\bPresent\b)|(\d{4})\s*[-–—to\s]*(\d{4}|\bPresent\b)/i);
        if (dateMatch) {
            entry.startDate = dateMatch[1] || dateMatch[3] || 'N/A';
            entry.endDate = dateMatch[2] || dateMatch[4] || 'Present';
        }

        const institutionLine = lines.find(l => /institute|university|college|school/i.test(l)) || lines[0];
        entry.institution = institutionLine.split(/,|\|/)[0].trim();

        const degreeLine = lines.find(l => /b\.tech|bachelor|master|grade|examination/i.test(l)) || lines.join(' ');
        entry.degree = degreeLine.split(/,|\|/)[0].replace(/CGPA.*/i, '').trim();

        if (entry.institution !== 'N/A' && entry.degree !== 'N/A') entries.push(entry);
    });
    return entries;
};

const parseExperienceAndProjects = (text: string): (ExperienceEntry | ProjectEntry)[] => {
    if (!text) return [];
    const entries: (ExperienceEntry | ProjectEntry)[] = [];
    const blocks = text.split(/\n\s*\n+/).filter(b => b.trim());

    blocks.forEach(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) return;

        const title = lines[0].replace(/Link to (Github|Website)/i, '').trim();
        const description = lines.slice(1).map(l => l.replace(/^•\s*/, ''));

        if (title && description.length > 0) {
            entries.push({ title, description, company: 'N/A', startDate: 'N/A', endDate: 'N/A' });
        }
    });
    return entries;
};

const parseResumeText = (resumeText: string, fileName: string): Omit<Candidate, 'matchScore' | 'justification' | 'suggestedRole'> => {
    const lines = resumeText.split('\n');
    const name = lines[0]?.trim() || 'Unknown Candidate';
    const email = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || 'N/A';
    const phone = resumeText.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0];
    const linkedin = resumeText.match(/linkedin\.com\/in\/[\w-]+/)?.[0];
    const github = resumeText.match(/github\.com\/[\w-]+/)?.[0];

    const sections = splitResumeIntoSections(resumeText);

    let skills = parseSkills(sections.skills || '');
    if (skills.length === 0) { // If no skills section, infer from the whole text
        const allKeywords = new Set(Object.values(ROLE_KEYWORDS).flat());
        const inferredSkills = new Set<string>();
        allKeywords.forEach(keyword => {
            const pattern = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${pattern}\\b`, 'i');
            if (regex.test(resumeText)) {
                inferredSkills.add(keyword);
            }
        });
        skills = Array.from(inferredSkills);
    }

    const education = parseEducation(sections.education || sections.header || resumeText);
    const experience = parseExperienceAndProjects(sections.experience || '');
    const projects = parseExperienceAndProjects(sections.projects || '');

    return {
        id: `client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name, email, phone, linkedin, github, skills, experience, education, projects,
        resumeFileName: fileName,
    };
};

// --- END OF NEW PARSING LOGIC ---


const Index = () => {
  const [shortlistedCandidates, setShortlistedCandidates] = useState<Candidate[]>([]);
  const [notShortlistedCandidates, setNotShortlistedCandidates] = useState<Candidate[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);

  const analyzeCandidateMatch = (candidate: Candidate, jobDescription: string): Candidate => {
    let matchScore = 1;
    let justification = "";

    const jobDescriptionLower = jobDescription.toLowerCase();
    const candidateTextLower = [...candidate.experience.flatMap(e => [e.title, ...e.description]), ...candidate.projects.flatMap(p => [p.title, ...p.description])].join(' ').toLowerCase();
    const candidateFullText = (candidate.skills.join(' ') + ' ' + candidateTextLower).toLowerCase();

    let jdPrimaryRoleKeywords: string[] = [];
    for (const role in ROLE_KEYWORDS) {
        const roleParts = role.toLowerCase().split(/\s*\/\s*|\s+and\s+/).map(p => p.trim());
        if (roleParts.some(part => jobDescriptionLower.includes(part) && part.length > 3)) {
            jdPrimaryRoleKeywords = ROLE_KEYWORDS[role].map(k => k.toLowerCase());
            break;
        }
    }

    const finalJdKeywords = Array.from(new Set(jdPrimaryRoleKeywords));
    const totalRelevantKeywords = finalJdKeywords.length;

    if (totalRelevantKeywords === 0) {
        return { ...candidate, matchScore: 1, justification: "Cannot evaluate: Could not determine key requirements from the job description." };
    }

    const matchedKeywords = new Set<string>();
    finalJdKeywords.forEach(keyword => {
        const pattern = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|[^a-zA-Z0-9])${pattern}([^a-zA-Z0-9]|$)`, 'i');
        if (regex.test(candidateFullText)) {
            matchedKeywords.add(keyword);
        }
    });

    const matchPercentage = totalRelevantKeywords > 0 ? (matchedKeywords.size / totalRelevantKeywords) * 100 : 0;
    const SHORTLISTING_THRESHOLD_PERCENT = 15;

    let isShortlisted = matchPercentage >= SHORTLISTING_THRESHOLD_PERCENT;

    if (isShortlisted) {
        let score = 5.0; // Base score for meeting the threshold
        score += (matchPercentage - SHORTLISTING_THRESHOLD_PERCENT) / 5; // Add points for exceeding threshold
        
        const relevantProjectsCount = [...candidate.experience, ...candidate.projects].filter(p => {
            const projectText = `${p.title} ${p.description.join(' ')}`.toLowerCase();
            return Array.from(matchedKeywords).some(k => projectText.includes(k));
        }).length;
        score += Math.min(2, relevantProjectsCount * 0.5);

        matchScore = Math.min(10, Math.max(1, Math.round(score)));
        justification = `Candidate is shortlisted with a score of ${matchScore}/10. Matched ${Math.round(matchPercentage)}% of key requirements.`;
    } else {
        matchScore = Math.max(1, Math.round(matchPercentage / 10));
        justification = `Candidate is not shortlisted. Matched only ${Math.round(matchPercentage)}% of key skills, which is below the ${SHORTLISTING_THRESHOLD_PERCENT}% threshold.`;
    }
    
    let bestRoleMatchCount = 0;
    let potentialSuggestedRole = "Generalist / Entry-Level";
    for (const role in ROLE_KEYWORDS) {
        let currentRoleMatchCount = 0;
        ROLE_KEYWORDS[role].forEach(keyword => {
            const pattern = keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(^|[^a-zA-Z0-9])${pattern}([^a-zA-Z0-9]|$)`, 'i');
            if (regex.test(candidateFullText)) {
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
    candidate.matchedKeywords = Array.from(matchedKeywords);
    candidate.totalKeywords = totalRelevantKeywords;
    candidate.matchPercentage = Math.round(matchPercentage);

    return candidate;
  };

  const handleProcessResumes = async (jobDescription: string, resumeFilesData: { fileName: string, resumeText: string }[]): Promise<Candidate[]> => {
    setProcessing(true);
    
    const processedCandidates = resumeFilesData.map(resumeData => {
        const parsedData = parseResumeText(resumeData.resumeText, resumeData.fileName);
        const candidateForAnalysis: Candidate = { ...parsedData, matchScore: 0, justification: '' };
        return analyzeCandidateMatch(candidateForAnalysis, jobDescription);
    });

    setShortlistedCandidates(processedCandidates.filter(c => c.justification.includes('shortlisted')));
    setNotShortlistedCandidates(processedCandidates.filter(c => !c.justification.includes('shortlisted')));
    
    setProcessing(false);
    return processedCandidates;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
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