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

    // --- Simulate JD Eligibility Criteria Parsing ---
    const jdCriteria = {
      min10thPercentage: parseFloat(jobDescription.match(/10th grade min (\d+\.?\d*)%/)?.at(1) || '0'),
      min12thPercentage: parseFloat(jobDescription.match(/12th grade min (\d+\.?\d*)%/)?.at(1) || '0'),
      minUGCGPA: parseFloat(jobDescription.match(/UG min CGPA (\d+\.?\d*)/)?.at(1) || '0'),
      minPGCGPA: parseFloat(jobDescription.match(/PG min CGPA (\d+\.?\d*)/)?.at(1) || '0'),
      requiresEducation: jobDescription.toLowerCase().includes("bachelor's degree") || jobDescription.toLowerCase().includes("education required") || jobDescription.toLowerCase().includes("degree in"),
    };

    // --- Simulate Resume Education Details Extraction ---
    const resumeDetails = {
      hasEducationSection: resumeContent.toLowerCase().includes("education:") || resumeContent.toLowerCase().includes("academic background"),
      resume10thPercentage: parseFloat(resumeContent.match(/10th grade: (\d+\.?\d*)%/)?.at(1) || '0'),
      resume12thPercentage: parseFloat(resumeContent.match(/12th grade: (\d+\.?\d*)%/)?.at(1) || '0'),
      resumeUGCGPA: parseFloat(resumeContent.match(/UG CGPA:? (\d+\.?\d*)/)?.at(1) || '0'),
      resumePGCGPA: parseFloat(resumeContent.match(/PG CGPA:? (\d+\.?\d*)/)?.at(1) || '0'),
      extractedDegrees: resumeContent.match(/(B\.S\.|M\.S\.|Ph\.D\.) in [A-Za-z\s]+(?:, \d{4})?/g) || [],
    };

    // Populate education array if found
    if (resumeDetails.hasEducationSection || resumeDetails.extractedDegrees.length > 0 || resumeDetails.resumeUGCGPA > 0) {
      if (resumeDetails.extractedDegrees.length > 0) education.push(...resumeDetails.extractedDegrees);
      if (resumeDetails.resumeUGCGPA > 0) education.push(`UG CGPA: ${resumeDetails.resumeUGCGPA}`);
      if (resumeDetails.resumePGCGPA > 0) education.push(`PG CGPA: ${resumeDetails.resumePGCGPA}`);
      if (resumeDetails.resume12thPercentage > 0) education.push(`12th Grade: ${resumeDetails.resume12thPercentage}%`);
      if (resumeDetails.resume10thPercentage > 0) education.push(`10th Grade: ${resumeDetails.resume10thPercentage}%`);
      if (education.length === 0 && resumeDetails.hasEducationSection) education.push("Education details present but not specifically parsed.");
    }


    // --- Strict Validity Checks ---
    let rejected = false;
    let rejectionReason = "";

    if (jdCriteria.requiresEducation && !resumeDetails.hasEducationSection && resumeDetails.extractedDegrees.length === 0) {
      rejected = true;
      rejectionReason = `Resume rejected: Missing basic qualification (Education) required by the job description.`;
    } else if (jdCriteria.min10thPercentage > 0 && resumeDetails.resume10thPercentage < jdCriteria.min10thPercentage) {
      rejected = true;
      rejectionReason = `Resume rejected: 10th grade percentage (${resumeDetails.resume10thPercentage}%) is below the required ${jdCriteria.min10thPercentage}%.`;
    } else if (jdCriteria.min12thPercentage > 0 && resumeDetails.resume12thPercentage < jdCriteria.min12thPercentage) {
      rejected = true;
      rejectionReason = `Resume rejected: 12th grade percentage (${resumeDetails.resume12thPercentage}%) is below the required ${jdCriteria.min12thPercentage}%.`;
    } else if (jdCriteria.minUGCGPA > 0 && resumeDetails.resumeUGCGPA < jdCriteria.minUGCGPA) {
      rejected = true;
      rejectionReason = `Resume rejected: UG CGPA (${resumeDetails.resumeUGCGPA}) is below the required ${jdCriteria.minUGCGPA}.`;
    } else if (jdCriteria.minPGCGPA > 0 && resumeDetails.resumePGCGPA < jdCriteria.minPGCGPA) {
      rejected = true;
      rejectionReason = `Resume rejected: PG CGPA (${resumeDetails.resumePGCGPA}) is below the required ${jdCriteria.minPGCGPA}.`;
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
        justification: rejectionReason + " Please ensure the resume meets all eligibility criteria.",
        resumeFileName: resumeFileName,
        suggestedRole: "N/A - Not Eligible",
      };
    }

    // --- Simulate parsing for the given single sentence resume content ---
    // For the specific test case: "Senior Software Engineer with 6 years experience. Proficient in React.js, Node.js, and AWS cloud services. Proven track record of solving complex technical challenges."
    if (resumeContent.includes("Senior Software Engineer") && resumeContent.includes("React.js") && resumeContent.includes("Node.js") && resumeContent.includes("AWS cloud services")) {
      skills = ["React.js", "Node.js", "AWS Cloud Services", "Problem Solving"];
      experience = ["Senior Software Engineer (6 years)", "Proven track record in complex technical challenges"];
      
      justification = `This candidate, ${candidateName}, shows strong alignment with the technical requirements (React.js, Node.js, AWS) and experience level (Senior Software Engineer, 6 years).`;
      matchScore = Math.floor(Math.random() * 3) + 7; // Still a good score for strong technical match

      if (!resumeDetails.hasEducationSection && resumeDetails.extractedDegrees.length === 0) {
        justification += ` However, explicit education details were not clearly identified, which might limit a full assessment. Consider a more structured resume format.`;
        matchScore = Math.max(1, matchScore - 2); // Deduct points for missing explicit education
        suggestedRole = "Senior Software Engineer (Education Review Needed)";
      } else {
        justification += ` Their educational background further strengthens their profile.`;
        suggestedRole = "Lead Software Architect";
      }
    } else {
      // Generic handling for other brief/unstructured resumes
      skills = ["General Technical Skills"];
      experience = ["Limited experience details"];
      matchScore = Math.floor(Math.random() * 4) + 3; // Lower score for less detail
      justification = `This resume (${resumeFileName}) provides some relevant keywords but lacks detailed sections for a comprehensive assessment.`;
      if (!resumeDetails.hasEducationSection && resumeDetails.extractedDegrees.length === 0) {
        justification += ` Education details were not clearly identified.`;
      }
      justification += ` Consider a more structured resume format for better analysis.`;
      suggestedRole = "Technical Support Specialist";
    }

    // Add a warning for badly formatted sections if education was found but not fully parsed
    if (resumeDetails.hasEducationSection && education.length === 0 && !rejected) {
      justification += ` Warning: Education section found but format was not clearly parsable for specific details.`;
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