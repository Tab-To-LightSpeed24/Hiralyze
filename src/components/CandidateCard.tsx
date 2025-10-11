import React from "react";
import { NeonCard, NeonCardContent, NeonCardHeader, NeonCardTitle, NeonCardDescription } from "@/components/NeonCard"; // Use NeonCard
import { Badge } from "@/components/ui/badge";
import { Candidate } from "@/types";
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';

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
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <NeonCard className="w-full h-full flex flex-col"> {/* Use NeonCard */}
        <NeonCardHeader> {/* Use NeonCardHeader */}
          <NeonCardTitle className="flex justify-between items-center"> {/* Use NeonCardTitle */}
            <span>{candidate.name}</span>
            <Badge 
              variant="outline" 
              className={cn(
                "text-lg px-3 py-1 border-primary text-primary bg-primary/10",
                "shadow-neon-glow-sm" // Subtle glow for badge
              )}
            >
              Score: {candidate.matchScore}/10
            </Badge>
          </NeonCardTitle>
          <NeonCardDescription className="text-sm text-muted-foreground"> {/* Use NeonCardDescription */}
            {candidate.email} | Resume: {candidate.resumeFileName}
          </NeonCardDescription>
        </NeonCardHeader>
        <NeonCardContent className="space-y-4 flex-grow"> {/* Use NeonCardContent */}
          {candidate.suggestedRole && (
            <div>
              <h4 className="font-semibold mb-1 text-primary text-neon-glow">Suggested Role:</h4>
              <Badge variant="default" className="text-base px-3 py-1 bg-primary text-primary-foreground shadow-neon-glow-sm">{candidate.suggestedRole}</Badge>
            </div>
          )}
          <div>
            <h4 className="font-semibold mb-1 text-primary text-neon-glow">Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, skillIndex) => (
                <Badge key={skillIndex} variant="outline" className="border-primary/50 text-muted-foreground bg-secondary/20">{skill}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-1 text-primary text-neon-glow">Experience:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {candidate.experience.map((exp, expIndex) => (
                <li key={expIndex}>{exp}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1 text-primary text-neon-glow">Education:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {candidate.education.map((edu, eduIndex) => (
                <li key={eduIndex}>{edu}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1 text-primary text-neon-glow">Justification:</h4>
            <p className="text-sm text-muted-foreground">{candidate.justification}</p>
          </div>
        </NeonCardContent>
      </NeonCard>
    </motion.div>
  );
};

export default CandidateCard;