import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Candidate } from "@/types";
import { motion } from "framer-motion";

interface CandidateCardProps {
  candidate: Candidate;
  index: number; // Added for staggered animation
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: index * 0.1, // Staggered animation
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{candidate.name}</span>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              Score: {candidate.matchScore}/10
            </Badge>
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {candidate.email} | Resume: {candidate.resumeFileName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow">
          {candidate.suggestedRole && (
            <div>
              <h4 className="font-semibold mb-1">Suggested Role:</h4>
              <Badge variant="default" className="text-base px-3 py-1">{candidate.suggestedRole}</Badge>
            </div>
          )}
          <div>
            <h4 className="font-semibold mb-1">Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, skillIndex) => (
                <Badge key={skillIndex} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Experience:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {candidate.experience.map((exp, expIndex) => (
                <li key={expIndex}>{exp}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Education:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {candidate.education.map((edu, eduIndex) => (
                <li key={eduIndex}>{edu}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Justification:</h4>
            <p className="text-sm text-muted-foreground">{candidate.justification}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CandidateCard;