import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Candidate } from "@/types";

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  return (
    <Card className="w-full">
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
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-1">Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill, index) => (
              <Badge key={index} variant="outline">{skill}</Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Experience:</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {candidate.experience.map((exp, index) => (
              <li key={index}>{exp}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Education:</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {candidate.education.map((edu, index) => (
              <li key={index}>{edu}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Justification:</h4>
          <p className="text-sm text-muted-foreground">{candidate.justification}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;