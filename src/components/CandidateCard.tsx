import React from "react";
import { NeonCard, NeonCardContent, NeonCardHeader, NeonCardTitle, NeonCardDescription } from "@/components/NeonCard";
import { Badge } from "@/components/ui/badge";
import { Candidate } from "@/types";
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';

// Define MotionDiv as a direct alias for motion.div to help SWC parser
const MotionDiv = motion.div;

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
      boxShadow: "0 0 15px hsl(var(--primary)/0.4), 0 0 25px hsl(var(--primary)/0.2)", // Enhanced glow on hover
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <MotionDiv // Using the alias here
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <NeonCard className="w-full h-full flex flex-col">
        <NeonCardHeader>
          <NeonCardTitle className="flex justify-between items-center flex-wrap gap-2">
            <span className="flex-grow min-w-0">{candidate.name}</span>
            <Badge 
              variant="outline" 
              className={cn(
                "text-lg px-3 py-1 border-primary text-primary bg-primary/10",
                "shadow-neon-glow-sm flex-shrink-0"
              )}
            >
              Score: {candidate.matchScore}/10
            </Badge>
          </NeonCardTitle>
          <NeonCardDescription className="text-sm text-muted-foreground break-words">
            {candidate.email} | Resume: {candidate.resumeFileName}
          </NeonCardDescription>
        </NeonCardHeader>
        <NeonCardContent className="space-y-4 flex-grow">
          {candidate.suggestedRole && (
            <div>
              <h4 className="font-semibold mb-1 text-primary text-neon-glow">Suggested Role:</h4>
              <Badge variant="default" className="text-base px-3 py-1 bg-primary text-primary-foreground shadow-neon-glow-sm break-words">{candidate.suggestedRole}</Badge>
            </div>
          )}
          <div>
            <h4 className="font-semibold mb-1 text-primary text-neon-glow">Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, skillIndex) => (
                <Badge key={skillIndex} variant="outline" className="border-primary/50 text-muted-foreground bg-secondary/20 break-words">{skill}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-1 text-primary text-neon-glow">Experience:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 break-words">
              {candidate.experience.map((exp, expIndex) => (
                <li key={expIndex}>{exp}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1 text-primary text-neon-glow">Education:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 break-words">
              {candidate.education.map((edu, eduIndex) => (
                <li key={eduIndex}>{edu}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1 text-primary text-neon-glow">Justification:</h4>
            <p className="text-sm text-muted-foreground break-words">{candidate.justification}</p>
          </div>
        </NeonCardContent>
      </NeonCard>
    </MotionDiv>
  );
};

export default CandidateCard;