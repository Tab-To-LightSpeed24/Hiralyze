export interface Candidate {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string[];
  education: string[];
  matchScore: number;
  justification: string;
  resumeFileName: string;
  suggestedRole?: string; // New field for job role suggestions
}

export interface JobDescription {
  text: string;
}