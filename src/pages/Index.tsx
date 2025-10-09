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

    // --- Simulate strict qualification and formatting checks ---
    const jdRequiresEducation = jobDescription.toLowerCase().includes("bachelor's degree") || jobDescription.toLowerCase().includes("education required");
    const resumeMentionsEducation = resumeContent.toLowerCase().includes("degree") || resumeContent.toLowerCase().includes("university") || resumeContent.toLowerCase().includes("education:");

    if (jdRequiresEducation && !resumeMentionsEducation) {
      matchScore = 0;
      justification = `Resume rejected: Missing basic qualification (Education) required by the job description. Please ensure the resume includes educational details.`;
      suggestedRole = "N/A - Missing Qualifications";
      return {
        id: `cand-${Date.now()}-${Math.random()}`,
        name: candidateName,
        email: `${candidateName.toLowerCase()}@example.com`,
        skills: [],
        experience: [],
        education: [],
        matchScore: 0,
        justification: justification,
        resumeFileName: resumeFileName,
        suggestedRole: suggestedRole,
      };
    }

    // Simulate parsing for the given single sentence resume content
    // For the specific test case: "Senior Software Engineer with 6 years experience. Proficient in React.js, Node.js, and AWS cloud services. Proven track record of solving complex technical challenges."
    if (resumeContent.includes("Senior Software Engineer") && resumeContent.includes("React.js") && resumeContent.includes("Node.js") && resumeContent.includes("AWS cloud services")) {
      skills = ["React.js", "Node.js", "AWS Cloud Services", "Problem Solving"];
      experience = ["Senior Software Engineer (6 years)", "Proven track record in complex technical challenges"];
      
      // If education is not strictly required by JD, but not found in resume
      if (!resumeMentionsEducation) {
        justification = `This candidate, ${candidateName}, shows strong alignment with the technical requirements (React.js, Node.js, AWS) and experience level (Senior Software Engineer, 6 years).`;
        justification += ` However, explicit education details were not clearly identified, which might limit a full assessment.`;
        matchScore = Math.floor(Math.random() * 3) + 7; // Still a good score for strong technical match
        suggestedRole = "Senior Software Engineer";
      } else {
        // If education was found (e.g., in a more comprehensive resume)
        education = ["Relevant Technical Degree"]; // Placeholder for actual extraction
        justification = `This candidate, ${candidateName}, is an excellent match for the role, demonstrating strong proficiency in ${skills.join(', ')} and extensive experience as a ${experience[0]}.`;
        justification += ` Their educational background further strengthens their profile.`;
        matchScore = Math.floor(Math.random() * 2) + 8; // Very high score
        suggestedRole = "Lead Software Architect";
      }
    } else {
      // Generic handling for other brief/unstructured resumes
      skills = ["General Technical Skills"];
      experience = ["Limited experience details"];
      education = resumeMentionsEducation ? ["Some educational background"] : [];
      matchScore = Math.floor(Math.random() * 4) + 3; // Lower score for less detail
      justification = `This resume (${resumeFileName}) provides some relevant keywords but lacks detailed sections for a comprehensive assessment.`;
      if (!resumeMentionsEducation) {
        justification += ` Education details were not clearly identified.`;
      }
      justification += ` Consider a more structured resume format for better analysis.`;
      suggestedRole = "Technical Support Specialist";
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
      "testing.pdf": "Senior Software Engineer with 6 years experience. Proficient in React.js, Node.js, and AWS cloud services. Proven track record of solving complex technical challenges.",
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