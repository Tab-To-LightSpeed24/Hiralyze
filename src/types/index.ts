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
}

export interface JobDescription {
  text: string;
}