import React, { useState } from "react";
import ResumeUploadForm from "@/components/ResumeUploadForm";
import CandidateList from "@/components/CandidateList";
import { Candidate } from "@/types";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const Index = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);

  const handleProcessResumes = (jobDescription: string, files: File[]) => {
    setProcessing(true);
    console.log("Job Description:", jobDescription);
    console.log("Resumes to process:", files);

    // Simulate API call with a delay
    setTimeout(() => {
      const mockCandidates: Candidate[] = files.map((file, index) => ({
        id: `cand-${index + 1}-${Date.now()}`, // Ensure unique IDs
        name: `Candidate ${index + 1}`,
        email: `candidate${index + 1}@example.com`,
        skills: ["React", "TypeScript", "Tailwind CSS", "LLM Integration", "Data Analysis"],
        experience: [
          "Developed scalable web applications using React and Node.js.",
          "Implemented AI-driven data processing pipelines.",
          "Managed full-stack development lifecycle.",
        ],
        education: ["B.S. in Computer Science, University of Tech", "M.S. in AI, Global Institute"],
        matchScore: Math.floor(Math.random() * 5) + 6, // Score between 6 and 10
        justification: `This candidate demonstrates strong proficiency in ${file.name.split('.')[0]} with a solid background in modern web development, AI integration, and data analysis, aligning well with the job requirements.`,
        resumeFileName: file.name,
      }));

      setCandidates(mockCandidates);
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
      className="flex flex-col items-center p-4 md:p-8 bg-background text-foreground min-h-[calc(100vh-64px)]" // Adjust min-h to account for header
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