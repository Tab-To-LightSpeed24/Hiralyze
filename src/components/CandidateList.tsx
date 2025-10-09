import React from "react";
import { Candidate } from "@/types";
import CandidateCard from "./CandidateCard";
import { motion } from "framer-motion";

interface CandidateListProps {
  candidates: Candidate[];
}

const CandidateList: React.FC<CandidateListProps> = ({ candidates }) => {
  if (candidates.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center text-muted-foreground p-8"
      >
        No candidates processed yet. Upload resumes and a job description to see results.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {candidates.map((candidate, index) => (
        <CandidateCard key={candidate.id} candidate={candidate} index={index} />
      ))}
    </motion.div>
  );
};

export default CandidateList;