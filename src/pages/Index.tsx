import React, { useState } from "react";
import ResumeUploadForm from "@/components/ResumeUploadForm";
import CandidateList from "@/components/CandidateList";
import { Candidate } from "@/types";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

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

    // --- Simulate JD Eligibility Criteria Parsing ---
    const jdCriteria = {
      min10thPercentage: parseFloat(jobDescription.match(/10th grade min (\d+\.?\d*)%/)?.at(1) || '0'),
      min12thPercentage: parseFloat(jobDescription.match(/12th grade min (\d+\.?\d*)%/)?.at(1) || '0'),
      minUGCGPA: parseFloat(jobDescription.match(/UG min CGPA (\d+\.?\d*)/)?.at(1) || '0'),
      minPGCGPA: parseFloat(jobDescription.match(/PG min CGPA (\d+\.?\d*)/)?.at(1) || '0'),
      requiresEngineeringDegree: jobDescription.toLowerCase().includes("engineering degree"),
      dotNetExpertise: jobDescription.toLowerCase().includes(".net expertise"),
      zeroExperienceCandidatesOnly: jobDescription.toLowerCase().includes("zero experience candidates only"),
      communicationSkillsRequired: jobDescription.toLowerCase().includes("excellent written and verbal communication skills"),
      teamworkSkillsRequired: jobDescription.toLowerCase().includes("ability to collaborate and work well in team environments"),
      requiredSkillsKeywords: (jobDescription.match(/(?:skills|requirements|proficient in):?\s*([\w\s,.-]+)/i)?.[1]?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)) || [],
      requiredExperienceKeywords: (jobDescription.match(/(?:experience|responsibilities):?\s*([\w\s,.-]+)/i)?.[1]?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)) || [],
    };

    // --- Simulate Resume Details Extraction ---
    const resumeDetails = {
      resume10thPercentage: parseFloat(resumeContent.match(/Grade 10: (\d+\.?\d*)%/)?.at(1) || '0'),
      resume12thPercentage: parseFloat(resumeContent.match(/Grade 12: (\d+\.?\d*)%/)?.at(1) || '0'),
      resumeUGCGPA: parseFloat(resumeContent.match(/CGPA:\s*(\d+\.?\d*)/i)?.[1] || '0'),
      extractedDegrees: resumeContent.match(/(B\.Tech|M\.Tech|B\.S\.|M\.S\.|Ph\.D\.)(?: in [A-Za-z\s]+)?(?: \| CGPA: \d+\.?\d*)?/g) || [],
      extractedSkills: resumeContent.match(/Technical Skills\s*([\s\S]+?)(?=(?:Projects:|Experience:|$))/i)?.[1]?.split(/•\s*|\n/).map(s => s.trim()).filter(Boolean) || [],
      extractedProfessionalExperience: resumeContent.match(/Experience:\s*([\s\S]+?)(?=(?:Skills:|Education:|Projects:|$))/i)?.[1]?.split('\n').map(s => s.trim()).filter(Boolean) || [],
      extractedProjects: resumeContent.match(/Projects\s*([\s\S]+?)(?=(?:Skills:|Education:|Experience:|$))/i)?.[1]?.split(/•\s*|\n/).map(s => s.trim()).filter(Boolean) || [],
    };

    // Populate education array
    if (resumeDetails.extractedDegrees.length > 0) education.push(...resumeDetails.extractedDegrees);
    if (resumeDetails.resumeUGCGPA > 0) education.push(`UG CGPA: ${resumeDetails.resumeUGCGPA}`);
    if (resumeDetails.resume12thPercentage > 0) education.push(`12th Grade: ${resumeDetails.resume12thPercentage}%`);
    if (resumeDetails.resume10thPercentage > 0) education.push(`10th Grade: ${resumeDetails.resume10thPercentage}%`);
    if (education.length === 0) education.push("No specific education identified");

    // Populate skills and experience (projects are considered experience for interns)
    skills = resumeDetails.extractedSkills.length > 0 ? resumeDetails.extractedSkills : ["No specific skills identified"];
    experience = resumeDetails.extractedProjects.length > 0 ? resumeDetails.extractedProjects : ["No specific experience identified"];
    if (resumeDetails.extractedProfessionalExperience.length > 0) {
      experience = [...resumeDetails.extractedProfessionalExperience, ...experience];
    }


    // --- Scoring Logic ---
    let baseScore = 5; // Start with a neutral score

    // 1. Education Eligibility & Scoring
    let educationMet = true;
    if (jdCriteria.requiresEngineeringDegree && !education.some(edu => edu.toLowerCase().includes("b.tech") || edu.toLowerCase().includes("computer science") || edu.toLowerCase().includes("engineering"))) {
      educationMet = false;
      scoreReasoning.push("Missing required Engineering degree.");
      baseScore -= 2;
    } else if (jdCriteria.requiresEngineeringDegree) {
      scoreReasoning.push("Engineering degree found.");
      baseScore += 1;
    }

    if (jdCriteria.min10thPercentage > 0 && resumeDetails.resume10thPercentage < jdCriteria.min10thPercentage) {
      educationMet = false;
      scoreReasoning.push(`10th grade percentage (${resumeDetails.resume10thPercentage}%) is below required ${jdCriteria.min10thPercentage}%.`);
      baseScore -= 2;
    } else if (jdCriteria.min10thPercentage > 0) {
      scoreReasoning.push(`10th grade percentage (${resumeDetails.resume10thPercentage}%) meets/exceeds required ${jdCriteria.min10thPercentage}%.`);
      baseScore += 1;
    }

    if (jdCriteria.min12thPercentage > 0 && resumeDetails.resume12thPercentage < jdCriteria.min12thPercentage) {
      educationMet = false;
      scoreReasoning.push(`12th grade percentage (${resumeDetails.resume12thPercentage}%) is below required ${jdCriteria.min12thPercentage}%.`);
      baseScore -= 2;
    } else if (jdCriteria.min12thPercentage > 0) {
      scoreReasoning.push(`12th grade percentage (${resumeDetails.resume12thPercentage}%) meets/exceeds required ${jdCriteria.min12thPercentage}%.`);
      baseScore += 1;
    }

    if (jdCriteria.minUGCGPA > 0 && resumeDetails.resumeUGCGPA < jdCriteria.minUGCGPA) {
      educationMet = false;
      scoreReasoning.push(`UG CGPA (${resumeDetails.resumeUGCGPA}) is below required ${jdCriteria.minUGCGPA}.`);
      baseScore -= 3;
    } else if (jdCriteria.minUGCGPA > 0) {
      scoreReasoning.push(`UG CGPA (${resumeDetails.resumeUGCGPA}) meets/exceeds required ${jdCriteria.minUGCGPA}.`);
      baseScore += 2;
    }

    if (jdCriteria.minPGCGPA > 0 && resumeDetails.resumePGCGPA < jdCriteria.minPGCGPA) {
      educationMet = false;
      scoreReasoning.push(`PG CGPA (${resumeDetails.resumePGCGPA}) is below required ${jdCriteria.minPGCGPA}.`);
      baseScore -= 3;
    } else if (jdCriteria.minPGCGPA > 0) {
      scoreReasoning.push(`PG CGPA (${resumeDetails.resumePGCGPA}) meets/exceeds required ${jdCriteria.minPGCGPA}.`);
      baseScore += 2;
    }

    // 2. Experience Eligibility & Scoring
    let experienceMet = true;
    if (jdCriteria.zeroExperienceCandidatesOnly && resumeDetails.extractedProfessionalExperience.length > 0) {
      experienceMet = false;
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
    
    // Determine suggested role based on skills/experience
    if (skills.some(s => s.toLowerCase().includes("machine learning")) || skills.some(s => s.toLowerCase().includes("data science")) || skills.some(s => s.toLowerCase().includes("pytorch")) || skills.some(s => s.toLowerCase().includes("tensorflow"))) {
      suggestedRole = "AI/ML Engineer Intern";
    } else if (skills.some(s => s.toLowerCase().includes("react")) || skills.some(s => s.toLowerCase().includes("node.js")) || skills.some(s => s.toLowerCase().includes("full-stack"))) {
      suggestedRole = "Full-stack Developer Intern";
    } else if (skills.some(s => s.toLowerCase().includes("python")) || skills.some(s => s.toLowerCase().includes("java")) || skills.some(s => s.toLowerCase().includes("c++"))) {
      suggestedRole = "Software Developer Intern";
    } else {
      suggestedRole = "Entry-Level Candidate";
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
      // Add other mock resume contents here for different test cases if needed
    };

    setTimeout(() => {
      const processedCandidates: Candidate[] = files.map(file => {
        const resumeContent = mockResumeContentMap[file.name] || `Content of ${file.name} is not mocked.`;
        return mockAnalyzeResume(file.name, resumeContent, jobDescription);
      });

      setCandidates(processedCandidates);
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