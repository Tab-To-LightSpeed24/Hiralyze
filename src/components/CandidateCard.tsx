import React from "react";
import { NeonCard, NeonCardContent, NeonCardHeader, NeonCardTitle, NeonCardDescription } from "@/components/NeonCard";
import { Badge } from "@/components/ui/badge";
import { Candidate } from "@/types";
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const MotionDiv = motion.div;

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
  onClick: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, index, onClick }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 0 15px hsl(var(--primary)/0.4), 0 0 25px hsl(var(--primary)/0.2)",
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <MotionDiv
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick}
      className="cursor-pointer h-full"
    >
      <NeonCard className="w-full h-full flex flex-col justify-between">
        <div>
          <NeonCardHeader>
            <div className="flex justify-between items-start">
              <NeonCardTitle className="flex-grow min-w-0 text-xl">
                {candidate.name}
              </NeonCardTitle>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-lg px-3 py-1 border-primary text-primary bg-primary/10",
                  "shadow-neon-glow-sm flex-shrink-0"
                )}
              >
                {candidate.matchScore}/10
              </Badge>
            </div>
            <NeonCardDescription className="text-sm text-muted-foreground truncate">
              {candidate.email}
            </NeonCardDescription>
          </NeonCardHeader>
          <NeonCardContent className="space-y-3">
            {candidate.suggestedRole && (
              <div>
                <h4 className="font-semibold text-xs mb-1 text-primary/80">Suggested Role</h4>
                <p className="text-sm font-medium text-foreground truncate">{candidate.suggestedRole}</p>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-xs mb-1 text-primary/80">Top Skills</h4>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 3).map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant="secondary" className="text-xs">{skill}</Badge>
                ))}
                {candidate.skills.length > 3 && <Badge variant="outline">+{candidate.skills.length - 3} more</Badge>}
              </div>
            </div>
          </NeonCardContent>
        </div>
        <div className="p-6 pt-2 flex justify-end items-center text-primary text-sm font-semibold">
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </NeonCard>
    </MotionDiv>
  );
};

export default CandidateCard;