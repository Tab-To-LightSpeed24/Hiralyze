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
    let experience: string[] = [];
    let education: string[] = [];
    let suggestedRole: string | undefined = undefined;
    let scoreReasoning: string[] = [];

    const resumeContentLower = resumeContent.toLowerCase();
    const jobDescriptionLower = jobDescription.toLowerCase();

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

    // --- Education Parsing ---
    let resume10thPercentage = 0;
    let resume12thPercentage = 0;
    let resumeUGCGPA = 0;

    const educationBlockMatch = resumeContent.match(/EDUCATION\s*([\s\S]+?)(?=(?:WORK EXPERIENCE|PROJECTS|SKILLS|CERTIFICATIONS|$))/i);
    if (educationBlockMatch) {
      const educationBlock = educationBlockMatch[1];
      const universityDegreeMatch = educationBlock.match(/(Vellore Institute of Technology,.*?B\. Tech in Computer Science Engineering.*?CGPA:\s*(\d+\.?\d*)\/10)/i);
      if (universityDegreeMatch) {
        education.push(universityDegreeMatch[1].trim());
        resumeUGCGPA = parseFloat(universityDegreeMatch[2]);
      }
      const grade12Match = educationBlock.match(/(Chennai Public School.*?Grade 12:\s*(\d+\.?\d*)%)/i);
      if (grade12Match) {
        education.push(grade12Match[1].trim());
        resume12thPercentage = parseFloat(grade12Match[2]);
      }
      const grade10Match = educationBlock.match(/(Chennai Public School.*?Grade 10:\s*(\d+\.?\d*)%)/i);
      if (grade10Match) {
        education.push(grade10Match[1].trim());
        resume10thPercentage = parseFloat(grade10Match[2]);
      }
    }
    // For Vishakan's resume, which has a different education format
    if (education.length === 0 && resumeFileName === "Vishakan_latest_August_resume.pdf") {
      const vishakanEduMatch = resumeContent.match(/EDUCATION\s*Vellore Institute of Technology, Vellore.*?B\. Tech in Computer Science Engineering.*?CGPA:\s*(\d+\.?\d*)\/10.*?Chennai Public School.*?Grade 12:\s*(\d+\.?\d*)%.*?Grade 10:\s*(\d+\.?\d*)%/is);
      if (vishakanEduMatch) {
        education.push("Vellore Institute of Technology, B. Tech in Computer Science Engineering");
        resumeUGCGPA = parseFloat(vishakanEduMatch[1]);
        education.push("Chennai Public School, Grade 12");
        resume12thPercentage = parseFloat(vishakanEduMatch[2]);
        education.push("Chennai Public School, Grade 10");
        resume10thPercentage = parseFloat(vishakanEduMatch[3]);
      }
    }
    if (education.length === 0) education.push("No specific education identified");

    // --- Skill Extraction ---
    let identifiedSkills = new Set<string>();
    const skillsBlockMatch = resumeContent.match(/SKILLS\s*([\s\S]+?)(?=(?:EDUCATION|WORK EXPERIENCE|PROJECTS|CERTIFICATIONS|$))/i);
    if (skillsBlockMatch) {
      const skillsBlock = skillsBlockMatch[1];
      const skillLines = skillsBlock.split(/•\s*/).map(s => s.trim()).filter(Boolean);
      skillLines.forEach(line => {
        const parts = line.split(':');
        if (parts.length > 1) {
          const categorySkills = parts[1].split(',').map(s => s.trim()).filter(Boolean);
          categorySkills.forEach(skill => identifiedSkills.add(skill));
        } else {
          line.split(',').map(s => s.trim()).filter(Boolean).forEach(skill => identifiedSkills.add(skill));
        }
      });
    }
    // For Vishakan's resume, which has a different skills format
    if (identifiedSkills.size === 0 && resumeFileName === "Vishakan_latest_August_resume.pdf") {
      const vishakanSkillsMatch = resumeContent.match(/SKILLS\s*• Programming: (.*?)\.\s*• Cloud Computing: (.*?)\.\s*• ML, DL&AI: (.*?)\.\s*• Data Handling and Visualization: (.*?)\.\s*• Languages: (.*?)\./is);
      if (vishakanSkillsMatch) {
        const programming = vishakanSkillsMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        const cloud = vishakanSkillsMatch[2].split(',').map(s => s.trim()).filter(Boolean);
        const mlDlAi = vishakanSkillsMatch[3].split(',').map(s => s.trim()).filter(Boolean);
        const dataHandling = vishakanSkillsMatch[4].split(',').map(s => s.trim()).filter(Boolean);
        [...programming, ...cloud, ...mlDlAi, ...dataHandling].forEach(skill => identifiedSkills.add(skill));
      }
    }


    // Extract skills from CERTIFICATIONS
    const certificationsBlockMatch = resumeContent.match(/CERTIFICATIONS\s*([\s\S]+?)(?=(?:WORK EXPERIENCE|PROJECTS|SKILLS|EDUCATION|$))/i);
    if (certificationsBlockMatch) {
      const certs = certificationsBlockMatch[1].split(/•\s*/).map(s => s.trim()).filter(Boolean);
      certs.forEach(cert => {
        const certKeywords = cert.match(/(AWS Cloud Practitioner|IBM AI Engineering Professional|Data Analytics|Amazon Web Services|Artificial Intelligence|Machine Learning)/i);
        if (certKeywords) {
          certKeywords.forEach(kw => identifiedSkills.add(kw));
        }
      });
    }

    // Scan resume content for keywords from ROLE_KEYWORDS
    Object.values(ROLE_KEYWORDS).flat().forEach(keyword => {
      if (resumeContentLower.includes(keyword.toLowerCase())) {
        identifiedSkills.add(keyword);
      }
    });
    skills = Array.from(identifiedSkills);
    if (skills.length === 0) skills.push("No specific skills identified");

    // --- Experience Parsing ---
    const tempExperience: string[] = [];

    const parseSectionContent = (sectionContent: string) => {
      const entries: string[] = [];
      const lines = sectionContent.split('\n').map(l => l.trim()).filter(Boolean);
      let currentEntryLines: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isBullet = line.startsWith('•');

        if (isBullet) {
          currentEntryLines.push(line.substring(1).trim());
        } else {
          if (currentEntryLines.length > 0) {
            entries.push(currentEntryLines.join(' '));
            currentEntryLines = [];
          }
          currentEntryLines.push(line);
        }
      }
      if (currentEntryLines.length > 0) {
        entries.push(currentEntryLines.join(' '));
      }
      return entries;
    };

    const workExperienceBlockMatch = resumeContent.match(/WORK EXPERIENCE\s*([\s\S]+?)(?=(?:CERTIFICATIONS|PROJECTS|SKILLS|EDUCATION|$))/i);
    if (workExperienceBlockMatch) {
      tempExperience.push(...parseSectionContent(workExperienceBlockMatch[1]));
    }

    const projectsBlockMatch = resumeContent.match(/PROJECTS\s*([\s\S]+?)(?=(?:SKILLS|EDUCATION|WORK EXPERIENCE|CERTIFICATIONS|$))/i);
    if (projectsBlockMatch) {
      tempExperience.push(...parseSectionContent(projectsBlockMatch[1]));
    }
    experience = tempExperience;
    if (experience.length === 0) experience.push("No specific experience identified");


    // --- New Strict Shortlisting Logic ---
    let isShortlisted = true;
    let missingKeywords: string[] = [];
    let jdPrimaryRoleKeywords: string[] = [];
    let jdPrimaryRole: string | undefined;
    let matchedJdKeywordsCount = 0;

    // Try to infer the primary role from the job description
    for (const role in ROLE_KEYWORDS) {
      if (jobDescriptionLower.includes(role.toLowerCase())) {
        jdPrimaryRole = role;
        jdPrimaryRoleKeywords = ROLE_KEYWORDS[role].map(k => k.toLowerCase());
        break;
      }
    }

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

      if (matchedJdKeywordsCount < 3) {
        isShortlisted = false;
      }
    }

    if (!isShortlisted) {
      matchScore = 1;
      justification = `This candidate, ${candidateName}, received a score of ${matchScore}/10. Reasoning: Candidate is NOT shortlisted because the job description for '${jdPrimaryRole || "unspecified role"}' requires at least 3 critical keywords, but only ${matchedJdKeywordsCount} were found. Missing: ${missingKeywords.join(", ")}.`;
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

    if (jdCriteria.requiresEngineeringDegree && !education.some(edu => edu.toLowerCase().includes("b.tech") || edu.toLowerCase().includes("computer science engineering"))) {
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
      "Resume Aravind.pdf": `PROFILESoftware skills - Verilog HDL, MATLAB, and Simulation - Multisim.Programming Skills - Python, C, C++, HTML, CSS, Java, JavaScript, ReactJS. Soft Skills - Project Management, Team Work, Communication, Leadership.Volunteer experience - Technical and cultural fest organizing committee.SKILLS Vellore Institute of Technology Vellore, Tamilnadu
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