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
    let experience: string[] = [];
    let education: string[] = [];
    let suggestedRole: string | undefined = undefined;
    let scoreReasoning: string[] = [];

    // --- Simulate JD Eligibility Criteria Parsing ---
    const jdCriteria = {
      min10thPercentage: parseFloat(jobDescription.match(/10th grade min (\d+\.?\d*)%/)?.at(1) || '0'),
      min12thPercentage: parseFloat(jobDescription.match(/12th grade min (\d+\.?\d*)%/)?.at(1) || '0'),
      minUGCGPA: parseFloat(jobDescription.match(/UG min CGPA (\d+\.?\d*)/)?.at(1) || '0'),
      minPGCGPA: parseFloat(jobDescription.match(/PG min CGPA (\d+\.?\d*)/)?.at(1) || '0'),
      requiresEducation: jobDescription.toLowerCase().includes("bachelor's degree") || jobDescription.toLowerCase().includes("education required") || jobDescription.toLowerCase().includes("degree in"),
      requiredSkillsKeywords: (jobDescription.match(/(?:skills|requirements|proficient in):?\s*([\w\s,.-]+)/i)?.[1]?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)) || [],
      requiredExperienceKeywords: (jobDescription.match(/(?:experience|responsibilities):?\s*([\w\s,.-]+)/i)?.[1]?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)) || [],
    };

    // --- Simulate Resume Details Extraction ---
    const resumeDetails = {
      hasEducationSection: resumeContent.toLowerCase().includes("education:") || resumeContent.toLowerCase().includes("academic background") || resumeContent.match(/(?:grade|cgpa)/i),
      resume10thPercentage: parseFloat(resumeContent.match(/Grade 10: (\d+\.?\d*)%/)?.at(1) || '0'),
      resume12thPercentage: parseFloat(resumeContent.match(/Grade 12: (\d+\.?\d*)%/)?.at(1) || '0'),
      resumeUGCGPA: parseFloat(resumeContent.match(/CGPA:\s*(\d+\.?\d*)/i)?.[1] || '0'), // More generic CGPA match
      resumePGCGPA: parseFloat(resumeContent.match(/PG CGPA:? (\d+\.?\d*)/)?.at(1) || '0'), // Specific for PG if present
      extractedDegrees: resumeContent.match(/(M\.Tech|B\.Tech|B\.S\.|M\.S\.|Ph\.D\.)(?: in [A-Za-z\s]+)?(?:, CGPA:\s\d+\.?\d*)?/g) || [],
      extractedSkills: resumeContent.match(/Skills:\s*([\w\s,.-]+)/i)?.[1]?.split(',').map(s => s.trim()).filter(Boolean) || [],
      extractedExperience: resumeContent.match(/Experience:\s*([\s\S]+?)(?=(?:Skills:|Education:|$))/i)?.[1]?.split('\n').map(s => s.trim()).filter(Boolean) || [],
      extractedProjects: resumeContent.match(/Projects:\s*([\s\S]+?)(?=(?:Skills:|Experience:|Education:|$))/i)?.[1]?.split('\n').map(s => s.trim()).filter(Boolean) || [],
    };

    // Populate education array
    if (resumeDetails.extractedDegrees.length > 0) education.push(...resumeDetails.extractedDegrees);
    if (resumeDetails.resumePGCGPA > 0) education.push(`PG CGPA: ${resumeDetails.resumePGCGPA}`);
    if (resumeDetails.resumeUGCGPA > 0) education.push(`UG CGPA: ${resumeDetails.resumeUGCGPA}`);
    if (resumeDetails.resume12thPercentage > 0) education.push(`12th Grade: ${resumeDetails.resume12thPercentage}%`);
    if (resumeDetails.resume10thPercentage > 0) education.push(`10th Grade: ${resumeDetails.resume10thPercentage}%`);
    if (education.length === 0 && resumeDetails.hasEducationSection) education.push("Education details present but not specifically parsed due to unclear format.");

    // Populate skills and experience
    skills = resumeDetails.extractedSkills.length > 0 ? resumeDetails.extractedSkills : [];
    experience = resumeDetails.extractedExperience.length > 0 ? resumeDetails.extractedExperience : [];
    const projects = resumeDetails.extractedProjects.length > 0 ? resumeDetails.extractedProjects : [];

    // --- Strict Validity Checks ---
    let rejected = false;
    let rejectionReason = "";

    if (jdCriteria.requiresEducation && !resumeDetails.hasEducationSection && resumeDetails.extractedDegrees.length === 0) {
      rejected = true;
      rejectionReason = `Resume rejected: Missing basic qualification (Education) required by the job description.`;
      scoreReasoning.push("Mandatory education not found.");
    } else {
      if (jdCriteria.min10thPercentage > 0 && resumeDetails.resume10thPercentage < jdCriteria.min10thPercentage) {
        rejected = true;
        rejectionReason = `Resume rejected: 10th grade percentage (${resumeDetails.resume10thPercentage}%) is below the required ${jdCriteria.min10thPercentage}%.`;
        scoreReasoning.push(`10th grade percentage (${resumeDetails.resume10thPercentage}%) below required ${jdCriteria.min10thPercentage}%.`);
      }
      if (jdCriteria.min12thPercentage > 0 && resumeDetails.resume12thPercentage < jdCriteria.min12thPercentage) {
        rejected = true;
        rejectionReason = `Resume rejected: 12th grade percentage (${resumeDetails.resume12thPercentage}%) is below the required ${jdCriteria.min12thPercentage}%.`;
        scoreReasoning.push(`12th grade percentage (${resumeDetails.resume12thPercentage}%) below required ${jdCriteria.min12thPercentage}%.`);
      }
      if (jdCriteria.minUGCGPA > 0 && resumeDetails.resumeUGCGPA < jdCriteria.minUGCGPA) {
        rejected = true;
        rejectionReason = `Resume rejected: UG CGPA (${resumeDetails.resumeUGCGPA}) is below the required ${jdCriteria.minUGCGPA}.`;
        scoreReasoning.push(`UG CGPA (${resumeDetails.resumeUGCGPA}) below required ${jdCriteria.minUGCGPA}.`);
      }
      if (jdCriteria.minPGCGPA > 0 && resumeDetails.resumePGCGPA < jdCriteria.minPGCGPA) {
        rejected = true;
        rejectionReason = `Resume rejected: PG CGPA (${resumeDetails.resumePGCGPA}) is below the required ${jdCriteria.minPGCGPA}.`;
        scoreReasoning.push(`PG CGPA (${resumeDetails.resumePGCGPA}) below required ${jdCriteria.minPGCGPA}.`);
      }
    }

    if (rejected) {
      return {
        id: `cand-${Date.now()}-${Math.random()}`,
        name: candidateName,
        email: `${candidateName.toLowerCase()}@example.com`,
        skills: [],
        experience: [],
        education: [],
        matchScore: 0,
        justification: rejectionReason + " Please ensure the resume meets all eligibility criteria. " + scoreReasoning.join(" "),
        resumeFileName: resumeFileName,
        suggestedRole: "N/A - Not Eligible",
      };
    }

    // --- Scoring Logic (if not rejected) ---
    let baseScore = 1; // Start with a minimal score if not rejected

    // Score for meeting JD education criteria
    if (jdCriteria.min10thPercentage > 0 && resumeDetails.resume10thPercentage >= jdCriteria.min10thPercentage) {
      baseScore += 1;
      scoreReasoning.push(`10th grade percentage (${resumeDetails.resume10thPercentage}%) meets required ${jdCriteria.min10thPercentage}%.`);
    }
    if (jdCriteria.min12thPercentage > 0 && resumeDetails.resume12thPercentage >= jdCriteria.min12thPercentage) {
      baseScore += 1;
      scoreReasoning.push(`12th grade percentage (${resumeDetails.resume12thPercentage}%) meets required ${jdCriteria.min12thPercentage}%.`);
    }
    if (jdCriteria.minUGCGPA > 0 && resumeDetails.resumeUGCGPA >= jdCriteria.minUGCGPA) {
      baseScore += 2;
      scoreReasoning.push(`UG CGPA (${resumeDetails.resumeUGCGPA}) meets required ${jdCriteria.minUGCGPA}.`);
    }
    if (jdCriteria.minPGCGPA > 0 && resumeDetails.resumePGCGPA >= jdCriteria.minPGCGPA) {
      baseScore += 2;
      scoreReasoning.push(`PG CGPA (${resumeDetails.resumePGCGPA}) meets required ${jdCriteria.minPGCGPA}.`);
    }
    if (jdCriteria.requiresEducation && education.length > 0) {
      baseScore += 1;
      scoreReasoning.push("Mandatory education section found and parsed.");
    }

    // Score for matching JD skills keywords
    let matchedSkillsCount = 0;
    if (jdCriteria.requiredSkillsKeywords.length > 0 && skills.length > 0) {
      jdCriteria.requiredSkillsKeywords.forEach(jdSkill => {
        if (skills.some(resSkill => resSkill.toLowerCase().includes(jdSkill))) {
          matchedSkillsCount++;
        }
      });
      if (matchedSkillsCount > 0) {
        baseScore += Math.min(3, matchedSkillsCount); // Max 3 points for skills
        scoreReasoning.push(`${matchedSkillsCount} relevant skills matched with JD requirements.`);
      } else {
        scoreReasoning.push("No specific skills from JD matched in resume.");
      }
    } else if (skills.length > 0) {
        baseScore += 1; // General skills if JD doesn't specify
        scoreReasoning.push("Resume contains specific skills, though JD did not specify keywords.");
    } else {
        scoreReasoning.push("No specific skills found in resume.");
    }


    // Score for matching JD experience keywords
    let matchedExperienceCount = 0;
    const allResumeText = resumeContent.toLowerCase(); // Use full resume content for broader experience/project keyword matching
    if (jdCriteria.requiredExperienceKeywords.length > 0 && (experience.length > 0 || projects.length > 0)) {
      jdCriteria.requiredExperienceKeywords.forEach(jdExp => {
        if (allResumeText.includes(jdExp)) {
          matchedExperienceCount++;
        }
      });
      if (matchedExperienceCount > 0) {
        baseScore += Math.min(3, matchedExperienceCount); // Max 3 points for experience
        scoreReasoning.push(`${matchedExperienceCount} relevant experience/project keywords matched with JD requirements.`);
      } else {
        scoreReasoning.push("No specific experience/project keywords from JD matched in resume.");
      }
    } else if (experience.length > 0 || projects.length > 0) {
        baseScore += 1; // General experience if JD doesn't specify
        scoreReasoning.push("Resume contains experience/project details, though JD did not specify keywords.");
    } else {
        scoreReasoning.push("No specific experience or project details found in resume.");
    }


    // Deduct for poor formatting if education was found but not fully parsed
    if (resumeDetails.hasEducationSection && education.includes("Education details present but not specifically parsed due to unclear format.")) {
      baseScore = Math.max(1, baseScore - 1); // Deduct for poor formatting
      scoreReasoning.push("Warning: Education section found but format was not clearly parsable for specific details, impacting score slightly.");
    }

    matchScore = Math.min(10, Math.max(1, baseScore)); // Cap score between 1 and 10

    justification = `This candidate, ${candidateName}, received a score of ${matchScore}/10. Reasoning: ${scoreReasoning.join(" ")}.`;
    
    // Determine suggested role based on skills/experience
    if (skills.some(s => s.toLowerCase().includes("machine learning")) || skills.some(s => s.toLowerCase().includes("data science"))) {
      suggestedRole = "Data Scientist / ML Engineer";
    } else if (skills.some(s => s.toLowerCase().includes("react")) || skills.some(s => s.toLowerCase().includes("node.js"))) {
      suggestedRole = "Full-stack Software Engineer";
    } else if (experience.some(exp => exp.toLowerCase().includes("project manager")) || projects.some(p => p.toLowerCase().includes("led project"))) {
      suggestedRole = "Project Lead / Manager";
    } else if (skills.length > 0 || experience.length > 0 || projects.length > 0) {
      suggestedRole = "Technical Specialist";
    } else {
      suggestedRole = "Entry-Level Candidate";
    }


    return {
      id: `cand-${Date.now()}-${Math.random()}`,
      name: candidateName,
      email: `${candidateName.toLowerCase()}@example.com`,
      skills: skills.length > 0 ? skills : ["No specific skills identified"],
      experience: experience.length > 0 ? experience : ["No specific experience identified"],
      education: education.length > 0 ? education : ["No specific education identified"],
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
      "Kaushik_resume_8.pdf": `Vellore Institute of Technology, B.Tech. Computer Science | CGPA: 7.75 Sept 2022 – May 2026
Chennai Public School | Grade 12: 91.0% | Grade 10: 94.6% 2022 | 2020`,
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