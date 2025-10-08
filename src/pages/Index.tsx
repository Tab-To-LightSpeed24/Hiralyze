import React, { useState } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import ResumeUploadForm from "@/components/ResumeUploadForm";
import CandidateList from "@/components/CandidateList";
import { Candidate } from "@/types";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Placeholder function for processing resumes
  const handleProcessResumes = (jobDescription: string, files: File[]) => {
    console.log("Job Description:", jobDescription);
    console.log("Resumes to process:", files);

    // In a real application, you would send these to your backend API.
    // For demonstration, we'll generate some mock data.
    const mockCandidates: Candidate[] = files.map((file, index) => ({
      id: `cand-${index + 1}`,
      name: `Candidate ${index + 1}`,
      email: `candidate${index + 1}@example.com`,
      skills: ["React", "TypeScript", "Tailwind CSS", "LLM Integration"],
      experience: [
        "Developed web applications using React.",
        "Integrated AI services for data processing.",
      ],
      education: ["B.S. in Computer Science"],
      matchScore: Math.floor(Math.random() * 5) + 6, // Score between 6 and 10
      justification: `This candidate has strong skills in ${file.name.split('.')[0]} and relevant experience matching the job description's requirements for modern web development and AI integration.`,
      resumeFileName: file.name,
    }));

    setCandidates(mockCandidates);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-background text-foreground">
      <div className="w-full max-w-4xl space-y-8">
        <ResumeUploadForm onProcessResumes={handleProcessResumes} />

        {candidates.length > 0 && (
          <>
            <Separator />
            <h2 className="text-3xl font-bold text-center mt-8">Shortlisted Candidates</h2>
            <CandidateList candidates={candidates} />
          </>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;