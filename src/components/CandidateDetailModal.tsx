import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Candidate } from '@/types';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({ candidate, isOpen, onClose }) => {
  if (!candidate) return null;

  const handleCopy = () => {
    const details = `
Candidate Name: ${candidate.name}
Email: ${candidate.email}
Resume File: ${candidate.resumeFileName}
Match Score: ${candidate.matchScore}/10
Suggested Role: ${candidate.suggestedRole || 'N/A'}

Justification:
${candidate.justification}

Technical Skills:
${candidate.skills.map(s => `- ${s}`).join('\n')}

Experience & Projects:
${[...candidate.experience, ...(candidate.projects || [])].map(e => `- ${e.title}:\n  - ${e.description.join('\n  - ')}`).join('\n')}

Education:
${candidate.education.map(e => `- ${e.degree} from ${e.institution} (${e.startDate} - ${e.endDate})${e.gpa ? ` - GPA: ${e.gpa}` : ''}`).join('\n')}
    `.trim();
    navigator.clipboard.writeText(details)
      .then(() => showSuccess("Candidate details copied to clipboard!"))
      .catch(() => showError("Failed to copy details. Please try again."));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-primary/30 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary text-neon-glow">{candidate.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {candidate.email} | Resume: {candidate.resumeFileName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
          {/* Score, Role, and Justification */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Badge 
                variant="outline" 
                className={cn(
                  "text-lg px-3 py-1 border-primary text-primary bg-primary/10",
                  "shadow-neon-glow-sm"
                )}
              >
                Score: {candidate.matchScore}/10
              </Badge>
              {candidate.suggestedRole && (
                <div className="text-right">
                  <h4 className="font-semibold mb-1 text-primary text-neon-glow text-sm">Suggested Role:</h4>
                  <Badge variant="default" className="text-base px-3 py-1 bg-primary text-primary-foreground shadow-neon-glow-sm break-words">{candidate.suggestedRole}</Badge>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-primary text-neon-glow">Justification:</h4>
              <p className="text-sm text-muted-foreground break-words">{candidate.justification}</p>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h4 className="font-semibold mb-2 text-primary text-neon-glow">Technical Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.length > 0 ? candidate.skills.map((skill, skillIndex) => (
                <Badge key={skillIndex} variant="outline" className="border-primary/50 text-muted-foreground bg-secondary/20 break-words">{skill}</Badge>
              )) : <p className="text-sm text-muted-foreground">N/A</p>}
            </div>
          </div>

          {/* Experience & Projects */}
          <div>
            <h4 className="font-semibold mb-2 text-primary text-neon-glow">Experience & Projects:</h4>
            {candidate.experience.length > 0 || (candidate.projects && candidate.projects.length > 0) ? (
              <div className="space-y-4">
                {candidate.experience.map((exp, expIndex) => (
                  <div key={`exp-${expIndex}`}>
                    <p className="font-medium text-foreground">{exp.title}</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-1 pl-2">
                      {exp.description.map((desc, descIndex) => (
                        <li key={descIndex}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {candidate.projects?.map((proj, projIndex) => (
                  <div key={`proj-${projIndex}`}>
                    <p className="font-medium text-foreground">{proj.title}</p>
                     <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-1 pl-2">
                      {proj.description.map((desc, descIndex) => (
                        <li key={descIndex}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">N/A</p>}
          </div>

          {/* Education */}
          <div>
            <h4 className="font-semibold mb-2 text-primary text-neon-glow">Education:</h4>
            {candidate.education.length > 0 ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {candidate.education.map((edu, eduIndex) => (
                  <li key={eduIndex} className="flex flex-col">
                    <span className="font-medium text-foreground">{edu.institution}</span>
                    <span>{edu.degree}{edu.gpa && ` - GPA: ${edu.gpa}`}</span>
                    <span className="text-xs text-muted-foreground/80">{edu.startDate} - {edu.endDate}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">N/A</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" /> Copy Details
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDetailModal;