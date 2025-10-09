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

    // --- Simulate Resume Details Extraction ---
    const resumeDetails = {
      hasEducationSection: resumeContent.toLowerCase().includes("education:") || resumeContent.toLowerCase().includes("academic background"),
      resume10thPercentage: parseFloat(resumeContent.match(/10th Grade: (\d+\.?\d*)%/)?.at(1) || '0'),
      resume12thPercentage: parseFloat(resumeContent.match(/12th Grade: (\d+\.?\d*)%/)?.at(1) || '0'),
      resumeUGCGPA: parseFloat(resumeContent.match(/UG CGPA:? (\d+\.?\d*)/)?.at(1) || '0'),
      resumePGCGPA: parseFloat(resumeContent.match(/PG CGPA:? (\d+\.?\d*)/)?.at(1) || '0'),
      extractedDegrees: resumeContent.match(/(M\.Tech|B\.Tech|B\.S\.|M\.S\.|Ph\.D\.) in [A-Za-z\s]+(?:, \d{4})?/g) || [],
      extractedSkills: resumeContent.match(/Skills:\s*([\w\s,.-]+)/i)?.[1]?.split(',').map(s => s.trim()).filter(Boolean) || [],
      extractedExperience: resumeContent.match(/Experience:\s*([\s\S]+?)(?=(?:Skills:|Education:|$))/i)?.[1]?.split('\n').map(s => s.trim()).filter(Boolean) || [],
    };

    // Populate education array if found
    if (resumeDetails.hasEducationSection || resumeDetails.extractedDegrees.length > 0 || resumeDetails.resumeUGCGPA > 0) {
      if (resumeDetails.extractedDegrees.length > 0) education.push(...resumeDetails.extractedDegrees);
      if (resumeDetails.resumePGCGPA > 0) education.push(`PG CGPA: ${resumeDetails.resumePGCGPA}`);
      if (resumeDetails.resumeUGCGPA > 0) education.push(`UG CGPA: ${resumeDetails.resumeUGCGPA}`);
      if (resumeDetails.resume12thPercentage > 0) education.push(`12th Grade: ${resumeDetails.resume12thPercentage}%`);
      if (resumeDetails.resume10thPercentage > 0) education.push(`10th Grade: ${resumeDetails.resume10thPercentage}%`);
      if (education.length === 0 && resumeDetails.hasEducationSection) education.push("Education details present but not specifically parsed due to unclear format.");
    }

    // Populate skills and experience
    skills = resumeDetails.extractedSkills.length > 0 ? resumeDetails.extractedSkills : ["General Technical Skills"];
    experience = resumeDetails.extractedExperience.length > 0 ? resumeDetails.extractedExperience : ["Experience details not explicitly parsed or limited."];


    // --- Strict Validity Checks ---
    let rejected = false;
    let rejectionReason = "";
    let scoreReasoning: string[] = [];

    if (jdCriteria.requiresEducation && !resumeDetails.hasEducationSection && resumeDetails.extractedDegrees.length === 0) {
      rejected = true;
      rejectionReason = `Resume rejected: Missing basic qualification (Education) required by the job description.`;
      scoreReasoning.push("Mandatory education not found.");
    } else if (jdCriteria.min10thPercentage > 0 && resumeDetails.resume10thPercentage < jdCriteria.min10thPercentage) {
      rejected = true;
      rejectionReason = `Resume rejected: 10th grade percentage (${resumeDetails.resume10thPercentage}%) is below the required ${jdCriteria.min10thPercentage}%.`;
      scoreReasoning.push(`10th grade percentage (${resumeDetails.resume10thPercentage}%) below required ${jdCriteria.min10thPercentage}%.`);
    } else if (jdCriteria.min12thPercentage > 0 && resumeDetails.resume12thPercentage < jdCriteria.min12thPercentage) {
      rejected = true;
      rejectionReason = `Resume rejected: 12th grade percentage (${resumeDetails.resume12thPercentage}%) is below the required ${jdCriteria.min12thPercentage}%.`;
      scoreReasoning.push(`12th grade percentage (${resumeDetails.resume12thPercentage}%) below required ${jdCriteria.min12thPercentage}%.`);
    } else if (jdCriteria.minUGCGPA > 0 && resumeDetails.resumeUGCGPA < jdCriteria.minUGCGPA) {
      rejected = true;
      rejectionReason = `Resume rejected: UG CGPA (${resumeDetails.resumeUGCGPA}) is below the required ${jdCriteria.minUGCGPA}.`;
      scoreReasoning.push(`UG CGPA (${resumeDetails.resumeUGCGPA}) below required ${jdCriteria.minUGCGPA}.`);
    } else if (jdCriteria.minPGCGPA > 0 && resumeDetails.resumePGCGPA < jdCriteria.minPGCGPA) {
      rejected = true;
      rejectionReason = `Resume rejected: PG CGPA (${resumeDetails.resumePGCGPA}) is below the required ${jdCriteria.minPGCGPA}.`;
      scoreReasoning.push(`PG CGPA (${resumeDetails.resumePGCGPA}) below required ${jdCriteria.minPGCGPA}.`);
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
    let baseScore = 5; // Starting point for a decent resume

    // Adjust score based on skills
    if (skills.includes("Python") && skills.includes("Machine Learning")) {
      baseScore += 2; // High relevance for data science roles
      scoreReasoning.push("Strong core skills (Python, ML) identified.");
    } else if (skills.includes("React.js") && skills.includes("Node.js")) {
      baseScore += 2; // High relevance for full-stack roles
      scoreReasoning.push("Strong core skills (React.js, Node.js) identified.");
    } else if (skills.length > 2 && !skills.includes("General Technical Skills")) {
      baseScore += 1; // Some specific skills found
      scoreReasoning.push("Multiple specific skills identified.");
    } else {
      scoreReasoning.push("Limited specific skills identified, relying on general technical aptitude.");
    }

    // Adjust score based on experience
    if (experience.some(exp => exp.includes("Senior Software Engineer") || exp.includes("Data Scientist"))) {
      baseScore += 2;
      scoreReasoning.push("Relevant senior-level experience detected.");
    } else if (experience.some(exp => exp.includes("years experience"))) {
      baseScore += 1;
      scoreReasoning.push("General work experience noted.");
    } else {
      scoreReasoning.push("Experience details are brief or not clearly structured.");
    }

    // Adjust score based on education
    if (education.length > 0 && !education.includes("Education details present but not specifically parsed due to unclear format.")) {
      baseScore += 1;
      scoreReasoning.push("Educational background is present and parsed.");
      if (resumeDetails.resumePGCGPA >= jdCriteria.minPGCGPA && jdCriteria.minPGCGPA > 0) {
        baseScore += 1;
        scoreReasoning.push(`PG CGPA (${resumeDetails.resumePGCGPA}) meets/exceeds requirement.`);
      }
      if (resumeDetails.resumeUGCGPA >= jdCriteria.minUGCGPA && jdCriteria.minUGCGPA > 0) {
        baseScore += 1;
        scoreReasoning.push(`UG CGPA (${resumeDetails.resumeUGCGPA}) meets/exceeds requirement.`);
      }
    } else if (resumeDetails.hasEducationSection && education.includes("Education details present but not specifically parsed due to unclear format.")) {
      scoreReasoning.push("Education section found but format was not clearly parsable for specific details, impacting score slightly.");
      baseScore = Math.max(1, baseScore - 1); // Deduct for poor formatting
    } else {
      scoreReasoning.push("No explicit education details found, impacting score.");
      baseScore = Math.max(1, baseScore - 2); // Deduct more for missing education
    }

    matchScore = Math.min(10, Math.max(1, baseScore)); // Cap score between 1 and 10

    justification = `This candidate, ${candidateName}, received a score of ${matchScore}/10. Reasoning: ${scoreReasoning.join(" ")}.`;
    
    // Determine suggested role based on skills/experience
    if (skills.includes("Python") && skills.includes("Machine Learning")) {
      suggestedRole = "Senior Data Scientist";
    } else if (skills.includes("React.js") && skills.includes("Node.js")) {
      suggestedRole = "Full-stack Software Engineer";
    } else if (experience.some(exp => exp.includes("Project Manager"))) {
      suggestedRole = "Project Lead";
    } else {
      suggestedRole = "Technical Specialist";
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
      "Kaushik_resume_8.pdf": `Kaushik Sharma
Email: kaushik.sharma@example.com

Education:
M.Tech in Data Science, IIT Delhi (2022) - PG CGPA: 9.2
B.Tech in Computer Engineering, NIT Warangal (2020) - UG CGPA: 8.8
12th Grade: 95% (2016)
10th Grade: 90% (2014)

Experience:
Data Scientist at Tech Solutions (2 years)
- Developed machine learning models using Python, TensorFlow, and PyTorch.
- Implemented data pipelines with Apache Spark and AWS Glue.
- Led a project on predictive analytics, improving forecast accuracy by 15%.

Skills:
Python, R, SQL, TensorFlow, PyTorch, Scikit-learn, AWS, Azure, Docker, Kubernetes, Machine Learning, Deep Learning, Data Analysis, Big Data, Predictive Modeling.`,
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