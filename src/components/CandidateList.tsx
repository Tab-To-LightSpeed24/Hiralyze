import React from "react";
import { Candidate } from "@/types";
import CandidateCard from "./CandidateCard";

interface CandidateListProps {
  candidates: Candidate[];
}

const CandidateList: React.FC<CandidateListProps> = ({ candidates }) => {
  if (candidates.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        No candidates processed yet. Upload resumes and a job description to see results.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
};

export default CandidateList;