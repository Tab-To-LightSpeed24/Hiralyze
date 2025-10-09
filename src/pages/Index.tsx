import React, { useState } from "react";
import ResumeUploadForm from "@/components/ResumeUploadForm";
import CandidateList from "@/components/CandidateList";
import { Candidate } from "@/types";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

// Define the comprehensive list of roles and their core keywords
const ROLE_KEYWORDS: { [key: string]: string[] } = {
  "Software Developer / Engineer": ["C", "C++", "Java", "Python", "JavaScript", "TypeScript", "Node.js", "React", "Angular", "Spring Boot", "Django", "Flask", "REST API", "Git", "CI/CD", "OOP", "Data Structures", "Algorithms", "SQL", "PostgreSQL", "MongoDB", "AWS", "Docker", "Kubernetes"],
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Vue.js", "Next.js", "Redux", "Tailwind", "Bootstrap", "Figma", "UX", "Responsive Design", "Webpack", "API integration"],
  "Backend Developer": ["Node.js", "Express", "Java", "Spring", "Python", "Flask", "FastAPI", "C#", ".NET", "SQL", "PostgreSQL", "MongoDB", "Redis", "RabbitMQ", "API design", "Microservices", "Authentication", "Scalability", "Cloud Deployment"],
  "Full Stack Developer": [
    "MERN", "MEAN", "LAMP", "DevOps", "GitHub Actions", "CI/CD", "API Security", "Docker", "GraphQL",
    // Combined from Frontend and Backend
    "HTML", "CSS", "JavaScript", "TypeScript", "React", "Vue.js", "Next.js", "Redux", "Tailwind", "Bootstrap", "Figma", "UX", "Responsive Design", "Webpack", "API integration",
    "Node.js", "Express", "Java", "Spring", "Python", "Flask", "FastAPI", "C#", ".NET", "SQL", "PostgreSQL", "MongoDB", "Redis", "RabbitMQ", "API design", "Microservices", "Authentication", "Scalability", "Cloud Deployment"
  ],
  "DevOps Engineer": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins", "CI/CD", "Linux", "Shell", "Ansible", "Prometheus", "Grafana", "Load Balancing", "Networking", "Monitoring", "Automation"],
  "Mobile App Developer": ["Android", "Kotlin", "Java", "Jetpack Compose", "iOS", "Swift", "SwiftUI", "Flutter", "React Native", "Firebase", "Push Notifications", "Play Store", "App Store", "UI/UX"],
  "Data Analyst": ["Excel", "Power BI", "Tableau", "SQL", "Data Cleaning", "EDA", "Pandas", "NumPy", "Statistics", "Visualization", "Business Insights", "Dashboards"],
  "Data Scientist": ["Python", "R", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Seaborn", "Regression", "Classification", "Clustering", "Feature Engineering", "Model Evaluation", "ML Pipelines", "Data Preprocessing", "Deep Learning", "NLP", "TensorFlow", "PyTorch", "Jupyter", "AWS Sagemaker", "MLflow"],
  "Machine Learning Engineer": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "FastAPI", "MLflow", "Data Preprocessing", "Model Deployment", "MLOps", "Docker", "Kubernetes", "AWS", "Airflow", "Feature Store", "ONNX", "Inference Optimization", "Transformers", "BERT", "LLMs"],
  "AI Engineer / NLP Engineer": ["Transformers", "BERT", "GPT", "Hugging Face", "LangChain", "RAG", "Prompt Engineering", "Vector Databases", "FAISS", "Pinecone", "LLM Fine-tuning", "Text Classification", "NER", "Sentiment Analysis", "Embeddings", "OpenAI API", "Speech Recognition", "TTS", "Computer Vision", "Diffusion Models"],
  "Data Engineer": ["ETL", "Airflow", "Spark", "Kafka", "Data Pipeline", "BigQuery", "Snowflake", "AWS Glue", "Redshift", "HDFS", "Scala", "PySpark", "Batch Processing", "Data Lake", "Data Warehouse", "Scheduling", "SQL Optimization"],
  "Cloud Engineer": ["AWS", "Azure", "GCP", "EC2", "S3", "Lambda", "CloudFormation", "Terraform", "Networking", "IAM", "Load Balancer", "DevOps", "CI/CD", "Monitoring", "Serverless", "Docker", "Kubernetes"],
  "Site Reliability Engineer (SRE)": ["Monitoring", "Incident Response", "SLI/SLO", "Grafana", "Prometheus", "Logging", "Automation", "On-call", "Python", "Bash", "Kubernetes", "Observability", "System Design"],
  "Business Analyst": ["Excel", "SQL", "Power BI", "Tableau", "Requirement Gathering", "Stakeholder Management", "Documentation", "UML", "Agile", "Data Interpretation", "Dashboards", "KPIs", "JIRA"],
  "Product Manager": ["Roadmap", "User Stories", "Wireframes", "Analytics", "A/B Testing", "Feature Prioritization", "Agile", "Scrum", "Stakeholder", "Product Lifecycle", "UI/UX", "Figma", "KPI tracking"],
  "Operations Analyst": ["Excel", "SQL", "Process Optimization", "Automation", "ERP", "Data Reporting", "Forecasting", "KPI tracking", "Workflow Analysis"],
  "Embedded Systems Engineer": [
    "C", "C++", "RTOS", "Microcontrollers", "ARM", "STM32", "UART", "SPI", "I2C", "PCB Design",
    "Embedded C", "FreeRTOS", "Linux Kernel", "Device Drivers", "Verilog", "MATLAB", "Multisim",
    "LM386", "RF amplifier", "VCO", "tuning circuit", "Semiconductor devices",
    "Electronics and Communication Engineering", "Python", "Yolo v8", "CNN", "adaptive filtering"
  ],
  "Hardware Design Engineer": ["VHDL", "Verilog", "FPGA", "ASIC", "SystemVerilog", "EDA Tools", "Cadence", "Synopsys", "RTL", "Simulation", "Synthesis"],
  "IoT Engineer": ["Arduino", "Raspberry Pi", "MQTT", "LoRa", "Wi-Fi", "BLE", "ESP32", "Python", "C", "Node-RED", "Cloud Integration", "IoT Security", "Sensors"],
  "Cybersecurity Engineer": ["Penetration Testing", "Vulnerability Assessment", "OWASP", "Burp Suite", "Metasploit", "Wireshark", "SIEM", "IDS/IPS", "SOC", "Incident Response", "Threat Analysis", "Firewalls", "Linux", "Python"],
  "Network Engineer": ["CCNA", "Routing", "Switching", "Subnetting", "TCP/IP", "Firewalls", "Load Balancing", "VPN", "Cisco", "Juniper", "Network Monitoring", "Troubleshooting"],
  "HR Executive": ["Recruitment", "Talent Acquisition", "Onboarding", "Payroll", "Employee Engagement", "HRMS", "Excel", "Policies", "Compliance", "Performance Management"],
  "Digital Marketing Specialist": ["SEO", "SEM", "Google Ads", "Facebook Ads", "Analytics", "Content Marketing", "Email Campaigns", "A/B Testing", "Copywriting", "Social Media", "Keyword Research"],
  "Finance Analyst": ["Excel", "Financial Modeling", "Budgeting", "Forecasting", "Accounting", "SQL", "Power BI", "SAP", "Valuation", "Balance Sheet", "Cash Flow", "Investment Analysis"],
};


const Index = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);

  // Helper function to simulate LLM parsing and scoring
  const mockAnalyzeResume = (resumeFileName: string, resumeContent: string, jobDescription: string): Candidate => {
    const candidateName = resumeFileName.split('.')[0];
    let matchScore = 0;
    let justification = "";
    let skills: string[] = [];
    let experience: string[] = []; // This will primarily hold project experience for interns
    let education: string[] = [];
    let suggestedRole: string | undefined = undefined;
    let scoreReasoning: string[] = [];

    const resumeContentLower = resumeContent.toLowerCase();
    const jobDescriptionLower = jobDescription.toLowerCase(); // Added for easier comparison

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
      requiredSkillsKeywords: (jobDescription.match(/(?:skills|requirements|proficient in):?\s*([\w\s,.-]+)/i)?.[1]?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)) || [],
      requiredExperienceKeywords: (jobDescription.match(/(?:experience|responsibilities):?\s*([\w\s,.-]+)/i)?.[1]?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)) || [],
    };

    // --- Simulate Resume Details Extraction ---
    const resumeDetails = {
      resume10thPercentage: parseFloat(resumeContent.match(/Grade 10:\s*(\d+\.?\d*)%|Secondary School Examination.*?Percentage\s*:\s*(\d+\.?\d*)%/i)?.[1] || resumeContent.match(/Secondary School Examination.*?Percentage\s*:\s*(\d+\.?\d*)%/i)?.[2] || '0'),
      resume12thPercentage: parseFloat(resumeContent.match(/Grade 12:\s*(\d+\.?\d*)%|Senior School Certificate Examination.*?Percentage\s*:\s*(\d+\.?\d*)%/i)?.[1] || resumeContent.match(/Senior School Certificate Examination.*?Percentage\s*:\s*(\d+\.?\d*)%/i)?.[2] || '0'),
      resumeUGCGPA: parseFloat(resumeContent.match(/CGPA:\s*(\d+\.?\d*)|CGPA-(\d+\.?\d*)/i)?.[1] || resumeContent.match(/CGPA:\s*(\d+\.?\d*)|CGPA-(\d+\.?\d*)/i)?.[2] || '0'),
      extractedDegrees: resumeContent.match(/(B\.Tech|M\.Tech|B\.S\.|M\.S\.|Ph\.D\.)(?: in [A-Za-z\s]+)?(?:.*?CGPA[-:]?\s*(\d+\.?\d*))?/g) || [],
      extractedSkillsSection: resumeContent.match(/Technical Skills\s*([\s\S]+?)(?=(?:Projects|CLUBS AND CHAPTERS|CERTIFICATES|EDUCATION|$))/i)?.[1]?.split(/•\s*|\n/).map(s => s.trim()).filter(Boolean) || [],
      extractedCertificates: resumeContent.match(/CERTIFICATES\s*([\s\S]+?)(?=(?:Projects|CLUBS AND CHAPTERS|EDUCATION|$))/i)?.[1]?.split(/•\s*|\n/).map(s => s.trim()).filter(Boolean) || [],
      extractedProfessionalExperience: resumeContent.match(/Experience:\s*([\s\S]+?)(?=(?:Skills:|Education:|Projects:|$))/i)?.[1]?.split('\n').map(s => s.trim()).filter(Boolean) || [],
      extractedProjects: resumeContent.match(/PROJECTS?\s*([\s\S]+?)(?=(?:CLUBS AND CHAPTERS|CERTIFICATES|EDUCATION|$))/i)?.[1]?.split(/(?:\n\s*(?=[A-Z][a-z])|•\s*)/).map(s => s.trim()).filter(Boolean) || [], // Improved project parsing
    };

    // Populate education array
    if (resumeDetails.extractedDegrees.length > 0) education.push(...resumeDetails.extractedDegrees);
    if (resumeDetails.resumeUGCGPA > 0) education.push(`UG CGPA: ${resumeDetails.resumeUGCGPA}`);
    if (resumeDetails.resume12thPercentage > 0) education.push(`12th Grade: ${resumeDetails.resume12thPercentage}%`);
    if (resumeDetails.resume10thPercentage > 0) education.push(`10th Grade: ${resumeDetails.resume10thPercentage}%`);
    if (education.length === 0 && resumeContentLower.includes("education")) education.push("Education details present but not specifically parsed due to unclear format.");
    if (education.length === 0) education.push("No specific education identified");


    // --- Enhanced Skill Extraction ---
    let identifiedSkills = new Set<string>();
    // Add skills from the dedicated section
    resumeDetails.extractedSkillsSection.forEach(skill => identifiedSkills.add(skill));
    // Add skills from certificates
    resumeDetails.extractedCertificates.forEach(cert => {
        // Extract keywords from certificate names, e.g., "Python" from "The Complete Python Bootcamp"
        const certKeywords = cert.match(/(Python|Semiconductor devices|Project Management|Ethical Hacking|Vulnerability Analysis|Artificial Intelligence|Yolo v8|CNN|LM386|RF amplifier|VCO|tuning circuit|Multisim|Matlab|adaptive filtering)/i);
        if (certKeywords) {
            certKeywords.forEach(kw => identifiedSkills.add(kw));
        }
    });

    // Scan resume content for keywords from ROLE_KEYWORDS
    Object.values(ROLE_KEYWORDS).flat().forEach(keyword => {
      if (resumeContentLower.includes(keyword.toLowerCase())) {
        identifiedSkills.add(keyword);
      }
    });
    skills = Array.from(identifiedSkills);
    if (skills.length === 0) skills.push("No specific skills identified");

    // Populate experience (projects are considered experience for interns)
    experience = resumeDetails.extractedProjects.length > 0 ? resumeDetails.extractedProjects : [];
    if (resumeDetails.extractedProfessionalExperience.length > 0) {
      experience = [...resumeDetails.extractedProfessionalExperience, ...experience];
    }
    if (experience.length === 0) experience.push("No specific experience identified");


    // --- New Strict Shortlisting Logic ---
    let isShortlisted = true;
    let missingKeywords: string[] = [];
    let jdPrimaryRoleKeywords: string[] = [];
    let jdPrimaryRole: string | undefined;

    // Try to infer the primary role from the job description
    for (const role in ROLE_KEYWORDS) {
      if (jobDescriptionLower.includes(role.toLowerCase())) {
        jdPrimaryRole = role;
        jdPrimaryRoleKeywords = ROLE_KEYWORDS[role].map(k => k.toLowerCase());
        break; // Found a direct match, use it
      }
    }

    if (jdPrimaryRole && jdPrimaryRoleKeywords.length > 0) {
      const candidateCapabilitiesLower = new Set<string>();
      skills.forEach(s => candidateCapabilitiesLower.add(s.toLowerCase()));
      experience.forEach(exp => exp.split(/\s*,\s*|\s+/).forEach(word => candidateCapabilitiesLower.add(word.toLowerCase())));

      let matchedJdKeywordsCount = 0;
      for (const requiredKeyword of jdPrimaryRoleKeywords) {
        if (candidateCapabilitiesLower.has(requiredKeyword)) {
          matchedJdKeywordsCount++;
        } else {
          missingKeywords.push(requiredKeyword);
        }
      }

      if (matchedJdKeywordsCount < 3) { // Require at least 3 keywords for shortlisting
        isShortlisted = false;
      }
    }

    if (!isShortlisted) {
      matchScore = 1; // Set to minimum score if not shortlisted
      justification = `This candidate, ${candidateName}, received a score of ${matchScore}/10. Reasoning: Candidate is NOT shortlisted because the job description for '${jdPrimaryRole || "unspecified role"}' requires at least 3 critical keywords, but only ${matchedJdKeywordsCount} were found. Missing: ${missingKeywords.join(", ")}.`;
      // Skip further scoring as the candidate is already not shortlisted
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
        suggestedRole: suggestedRole, // Still suggest a role based on their skills
      };
    }


    // --- Scoring Logic (only if shortlisted) ---
    let baseScore = 5; // Start with a neutral score

    // 1. Education Eligibility & Scoring
    if (jdCriteria.requiresEngineeringDegree && !education.some(edu => edu.toLowerCase().includes("b.tech") || edu.toLowerCase().includes("computer science") || edu.toLowerCase().includes("engineering"))) {
      scoreReasoning.push("Missing required Engineering degree.");
      baseScore -= 2;
    } else if (jdCriteria.requiresEngineeringDegree) {
      scoreReasoning.push("Engineering degree found.");
      baseScore += 1;
    }

    if (jdCriteria.min10thPercentage > 0 && resumeDetails.resume10thPercentage < jdCriteria.min10thPercentage) {
      scoreReasoning.push(`10th grade percentage (${resumeDetails.resume10thPercentage}%) is below required ${jdCriteria.min10thPercentage}%.`);
      baseScore -= 2;
    } else if (jdCriteria.min10thPercentage > 0) {
      scoreReasoning.push(`10th grade percentage (${resumeDetails.resume10thPercentage}%) meets/exceeds required ${jdCriteria.min10thPercentage}%.`);
      baseScore += 1;
    }

    if (jdCriteria.min12thPercentage > 0 && resumeDetails.resume12thPercentage < jdCriteria.min12thPercentage) {
      scoreReasoning.push(`12th grade percentage (${resumeDetails.resume12thPercentage}%) is below required ${jdCriteria.min12thPercentage}%.`);
      baseScore -= 2;
    } else if (jdCriteria.min12thPercentage > 0) {
      scoreReasoning.push(`12th grade percentage (${resumeDetails.resume12thPercentage}%) meets/exceeds required ${jdCriteria.min12thPercentage}%.`);
      baseScore += 1;
    }

    if (jdCriteria.minUGCGPA > 0 && resumeDetails.resumeUGCGPA < jdCriteria.minUGCGPA) {
      scoreReasoning.push(`UG CGPA (${resumeDetails.resumeUGCGPA}) is below required ${jdCriteria.minUGCGPA}.`);
      baseScore -= 3;
    } else if (jdCriteria.minUGCGPA > 0) {
      scoreReasoning.push(`UG CGPA (${resumeDetails.resumeUGCGPA}) meets/exceeds required ${jdCriteria.minUGCGPA}.`);
      baseScore += 2;
    }

    // 2. Experience Eligibility & Scoring
    if (jdCriteria.zeroExperienceCandidatesOnly && resumeDetails.extractedProfessionalExperience.length > 0) {
      scoreReasoning.push("Candidate has professional experience, but job requires zero experience.");
      baseScore -= 4; // Significant deduction
    } else if (jdCriteria.zeroExperienceCandidatesOnly) {
      scoreReasoning.push("Candidate has no professional experience, meeting 'zero experience' criteria.");
      baseScore += 1;
    }

    // Score for matching JD experience keywords (from projects for interns)
    let matchedExperienceKeywordsCount = 0;
    if (jdCriteria.requiredExperienceKeywords.length > 0 && (experience.length > 0)) {
      jdCriteria.requiredExperienceKeywords.forEach(jdExp => {
        if (experience.some(resExp => resExp.toLowerCase().includes(jdExp))) {
          matchedExperienceKeywordsCount++;
        }
      });
      if (matchedExperienceKeywordsCount > 0) {
        baseScore += Math.min(2, matchedExperienceKeywordsCount);
        scoreReasoning.push(`${matchedExperienceKeywordsCount} relevant experience/project keywords matched with JD requirements.`);
      } else {
        scoreReasoning.push("No specific experience/project keywords from JD matched in resume.");
      }
    } else if (experience.length > 0 && experience[0] !== "No specific experience identified") {
        baseScore += 1;
        scoreReasoning.push("Resume contains project details, though JD did not specify keywords.");
    } else {
        scoreReasoning.push("No specific experience or project details found in resume.");
    }

    // 3. Skills Matching & Scoring
    let matchedSkillsCount = 0;
    if (jdCriteria.requiredSkillsKeywords.length > 0 && skills.length > 0 && skills[0] !== "No specific skills identified") {
      jdCriteria.requiredSkillsKeywords.forEach(jdSkill => {
        if (skills.some(resSkill => resSkill.toLowerCase().includes(jdSkill))) {
          matchedSkillsCount++;
        }
      });
      if (matchedSkillsCount > 0) {
        baseScore += Math.min(3, matchedSkillsCount);
        scoreReasoning.push(`${matchedSkillsCount} relevant skills matched with JD requirements.`);
      } else {
        scoreReasoning.push("No specific skills from JD matched in resume.");
      }
    } else if (skills.length > 0 && skills[0] !== "No specific skills identified") {
        baseScore += 1;
        scoreReasoning.push("Resume contains specific skills, though JD did not specify keywords.");
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
    matchScore = Math.min(10, Math.max(1, baseScore)); // Cap score between 1 and 10

    justification = `This candidate, ${candidateName}, received a score of ${matchScore}/10. Reasoning: ${scoreReasoning.join(" ")}.`;
    
    // --- Determine suggested role based on comprehensive skills/experience ---
    let bestRoleMatchCount = 0;
    let potentialSuggestedRole = "Entry-Level Candidate"; // Default

    const candidateCapabilities = new Set<string>();
    skills.forEach(s => candidateCapabilities.add(s.toLowerCase()));
    experience.forEach(exp => exp.split(/\s*,\s*|\s+/).forEach(word => candidateCapabilities.add(word.toLowerCase()))); // Break down experience into keywords

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
      "Resume Aravind.pdf": `PROFILESoftware skills - Verilog HDL, MATLAB, and Simulation - Multisim.Programming Skills - Python, C, C++, HTML, CSS, Java, JavaScript, ReactJS. Soft Skills - Project Management, Team Work, Communication, Leadership.Volunteer experience - Technical and cultural fest organizing committee.SKILLS Vellore Institute of Technology Vellore, Tamilnadu
B. Tech, Electronics and Communication Engineering February 2025-Present CGPA-8.00.SBOA School & Junior College Chennai, TamilnaduAll Indian Senior School Certificate Examination May - 2022Percentage : 85.0%SBOA School & Junior College Chennai, TamilnaduAll Indian Secondary School Examination May - 2020Percentage : 86.4%Dedicated third-year Electronics and Communication Engineering student with a stronginterest in core ECE technologies. Passionate about exploring digital marketing andcommitted to continuous learning and innovation in the tech industry.EDUCATIONPROJECTCLUBS AND CHAPTERS Senior Core Community Member in Tamil Literary Association (TLA) VIT and have organized and volunteered in many events.CERTIFICATESThe Complete Python Bootcamp From Zero to Hero in Python, Udemy.Electronics Foundations - Semiconductor devices, LinkedIn.Project Management Foundations, LinkedIn.Ethical Hacking: Vulnerability Analysis, LinkedIn. Introduction to Artificial Intelligence, LinkedIn.Pollin AIDeveloped an AI system to monitor pollinator activity (e.g., bees, butterflies) inagricultural environments.Applied object detection through the Yolo v8 algorithm and CNN.Using LM386 as a comparator circuit for detection and using an RF amplifier,VCO, and a tuning circuit for jamming purposes.Mobile jammer and detector device (Multisim) Noise canceling headphones (Matlab) Detection of noise generated using a sample input and removing any noiseabove voice frequency using adaptive filtering algorithms to provide noise-cancelled output.`,
      // Add other mock resume contents here for different test cases if needed
    };

    setTimeout(() => {
      const processedCandidates: Candidate[] = files.map(file => {
        const resumeContent = mockResumeContentMap[file.name] || `Content of ${file.name} is not mocked.`;
        return mockAnalyzeResume(file.name, resumeContent, jobDescription);
      });

      // Filter out candidates that were explicitly marked as "NOT shortlisted" (matchScore === 1)
      const shortlistedCandidates = processedCandidates.filter(candidate => candidate.matchScore > 1);

      setCandidates(shortlistedCandidates);
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
            className="text-center text-lg text-primary font-medium mt-8"
          >
            Processing resumes...
          </motion.div>
        )}

        {candidates.length > 0 && !processing && (
          <motion.div variants={itemVariants}>
            <Separator className="my-8" />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-center mb-8"
            >
              Shortlisted Candidates
            </motion.h2>
            <CandidateList candidates={candidates} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Index;